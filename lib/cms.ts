import "server-only";
import { unstable_cache } from "next/cache";
import { defaultCopy, type Copy } from "./copy";

// Laraib's edits are stored as one JSON document. On Vercel it lives in the project's private
// Vercel Blob store ("impsychout-blob"): connecting the store adds BLOB_STORE_ID, and the SDK signs
// in with Vercel's own OIDC token, so there's no secret to manage (an older-style
// BLOB_READ_WRITE_TOKEN works too). Private means the file can only be read by this site's
// server, never by URL. In local development it falls back to .data/copy.json.
const PATH = "cms/copy.json";
export const COPY_TAG = "copy";

type Json = unknown;

const blobConnected = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

async function readStored(): Promise<Json | null> {
  if (blobConnected()) {
    const { get } = await import("@vercel/blob");
    // useCache: false so a save shows up straight away instead of waiting on a cached copy
    const res = await get(PATH, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200 || !res.stream) return null;
    return new Response(res.stream).json();
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
  return blobConnected() || !process.env.VERCEL;
}

export async function writeStored(data: Json) {
  const body = JSON.stringify(data, null, 2);
  if (blobConnected()) {
    const { put } = await import("@vercel/blob");
    await put(PATH, body, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
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
