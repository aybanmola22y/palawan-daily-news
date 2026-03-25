import { NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/categories-service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await req.json();
    const ok = await updateCategory(id, body);
    if (!ok) return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const ok = await deleteCategory(id);
    if (!ok) return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
