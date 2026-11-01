import "server-only";
import { unstable_cache } from "next/cache";
import { defaultCopy, type Copy } from "./copy";

// Laraib's edits are stored as one JSON document. On Vercel it lives in Vercel Blob
// (needs BLOB_READ_WRITE_TOKEN, added automatically when a Blob store is connected to the project);
// in local development it falls back to .data/copy.json.
const PATH = "cms/copy.json";
export const COPY_TAG = "copy";

type Json = unknown;

async function readStored(): Promise<Json | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: PATH, limit: 1 });
    const b = blobs.find((x) => x.pathname === PATH);
    if (!b) return null;
    // cache-bust with the upload time so a fresh save is never served stale from the CDN
    const res = await fetch(`${b.url}?v=${new Date(b.uploadedAt).getTime()}`, { cache: "no-store" });
    return res.ok ? res.json() : null;
  }
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    try {
      const fs = await import("node:fs/promises");
      return JSON.parse(await fs.readFile(".data/copy.json", "utf8"));
    } catch {
      return null;
    }
  }
  return null;
}

export function storageReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) || !process.env.VERCEL;
}

export async function writeStored(data: Json) {
  const body = JSON.stringify(data, null, 2);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(PATH, body, { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
    return;
  }
  if (process.env.VERCEL) throw new Error("storage_not_connected");
  const fs = await import("node:fs/promises");
  await fs.mkdir(".data", { recursive: true });
  await fs.writeFile(".data/copy.json", body, "utf8");
}

// Lay saved edits over the defaults. Objects merge key by key; arrays use the saved items but
// keep each item's hidden technical fields (colours, icons, slugs) from the matching default.
function merge(base: Json, over: Json): Json {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    return over.map((item, i) => merge(base[i] ?? base[base.length - 1], item));
  }
  if (base && typeof base === "object") {
    if (!over || typeof over !== "object" || Array.isArray(over)) return base;
    const out: Record<string, Json> = { ...(base as Record<string, Json>) };
    for (const [k, v] of Object.entries(over as Record<string, Json>)) {
      out[k] = k in out ? merge(out[k], v) : v;
    }
    return out;
  }
  return typeof over === typeof base ? over : base;
}

export const getStoredCopy = unstable_cache(async () => readStored(), ["cms-copy"], { tags: [COPY_TAG] });

export async function getCopy(): Promise<Copy> {
  try {
    return merge(defaultCopy, await getStoredCopy()) as Copy;
  } catch {
    return defaultCopy;
  }
}
