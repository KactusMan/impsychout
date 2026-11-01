import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { COPY_TAG, storageReady, writeStored } from "@/lib/cms";
import { defaultCopy } from "@/lib/copy";

// Saves the whole edited copy document. Middleware has already checked the session.
// Only known sections are kept, and only plain text, numbers and lists of them are accepted.
type J = unknown;

function sanitize(base: J, val: J, depth = 0): J {
  if (depth > 8) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(val)) return base;
    return val.slice(0, 60).map((v) => sanitize(base[0], v, depth + 1));
  }
  if (base && typeof base === "object") {
    if (!val || typeof val !== "object" || Array.isArray(val)) return base;
    const out: Record<string, J> = {};
    for (const k of Object.keys(base as Record<string, J>)) {
      if (k in (val as Record<string, J>)) out[k] = sanitize((base as Record<string, J>)[k], (val as Record<string, J>)[k], depth + 1);
    }
    return out;
  }
  if (typeof base === "string") return typeof val === "string" ? val.slice(0, 4000) : base;
  if (typeof base === "number") return typeof val === "number" ? val : base;
  return base;
}

export async function PUT(req: Request) {
  if (!storageReady()) return NextResponse.json({ error: "storage_not_connected" }, { status: 503 });
  const raw = await req.text();
  if (raw.length > 600_000) return NextResponse.json({ error: "too_large" }, { status: 413 });
  let data: J;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const clean = sanitize(defaultCopy, data);
  try {
    await writeStored(clean);
  } catch {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
  revalidateTag(COPY_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
