import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

function safeExt(mime: string) {
  if (mime === "image/png") return ".png";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/webp") return ".webp";
  return "";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const ext = safeExt(file.type);
    const filename = `${crypto.randomUUID()}${ext}`;
    const buffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return NextResponse.json({ error: "Upload failed to storage" }, { status: 500 });
    }

    // Get Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

