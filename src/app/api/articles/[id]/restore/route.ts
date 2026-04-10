import { NextResponse } from "next/server";
import { restoreArticle } from "@/lib/articles-actions";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  const success = await restoreArticle(id);
  if (!success) {
    return NextResponse.json({ error: "Failed to restore article" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
