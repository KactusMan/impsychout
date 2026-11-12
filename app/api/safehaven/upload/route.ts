import { NextResponse } from "next/server";
import { storageReady } from "@/lib/cms";
import { MAX_UPLOAD, saveMedia, sniff } from "@/lib/media";

// Takes one photo from Safe Haven and stores it. Middleware has already checked the session.
// The browser shrinks the photo first (and that also drops hidden details such as the location a
// phone camera records), so the body is the image itself; `?name=` is only used for the file name.
// The photo isn't shown on the site until Laraib presses Save.

export async function POST(req: Request) {
  if (!storageReady()) return NextResponse.json({ error: "storage_not_connected" }, { status: 503 });
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_UPLOAD) return NextResponse.json({ error: "too_large" }, { status: 413 });

  const bytes = new Uint8Array(await req.arrayBuffer());
  if (!bytes.length) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (bytes.length > MAX_UPLOAD) return NextResponse.json({ error: "too_large" }, { status: 413 });
  const ext = sniff(bytes);
  if (!ext) return NextResponse.json({ error: "not_an_image" }, { status: 415 });

  const hint = new URL(req.url).searchParams.get("name") ?? "";
  try {
    return NextResponse.json({ ok: true, src: await saveMedia(bytes, ext, hint) });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
