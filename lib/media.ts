import "server-only";

// Photos Laraib uploads in Safe Haven. They live in the same private Vercel Blob store as her text
// (under media/), and the site serves them itself at /media/<name> (app/media/[name]/route.ts),
// so nothing in the store is ever reachable by a raw Blob URL. Each upload gets a new random
// name, which lets browsers and Vercel's image optimiser cache them forever.
// In local development they go to .data/media instead.

export const MEDIA_NAME = /^[a-z0-9-]{1,60}\.(jpg|png|webp)$/;
export const MAX_UPLOAD = 4 * 1024 * 1024; // Vercel functions accept up to 4.5MB; Safe Haven shrinks photos well below this

const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;
type Ext = keyof typeof TYPES;

const blobConnected = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

// Trust the file's first bytes, not the name or the browser's label.
export function sniff(b: Uint8Array): Ext | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "webp";
  return null;
}

export const contentType = (name: string) => TYPES[name.split(".").pop() as Ext] ?? "application/octet-stream";

export async function saveMedia(bytes: Uint8Array, ext: Ext, hint: string) {
  const slug = hint.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "photo";
  const name = `${slug}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  if (blobConnected()) {
    const { put } = await import("@vercel/blob");
    await put(`media/${name}`, Buffer.from(bytes), { access: "private", contentType: TYPES[ext], addRandomSuffix: false });
  } else {
    if (process.env.VERCEL) throw new Error("storage_not_connected");
    const fs = await import("node:fs/promises");
    await fs.mkdir(".data/media", { recursive: true });
    await fs.writeFile(`.data/media/${name}`, bytes);
  }
  return `/media/${name}`;
}

export async function readMedia(name: string): Promise<ReadableStream<Uint8Array> | Uint8Array | null> {
  if (!MEDIA_NAME.test(name)) return null;
  if (blobConnected()) {
    const { get } = await import("@vercel/blob");
    const res = await get(`media/${name}`, { access: "private" });
    return res && res.statusCode === 200 && res.stream ? res.stream : null;
  }
  try {
    const fs = await import("node:fs/promises");
    return new Uint8Array(await fs.readFile(`.data/media/${name}`));
  } catch {
    return null;
  }
}
