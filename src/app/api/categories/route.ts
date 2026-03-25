import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/categories-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCat = await createCategory(body);
    if (!newCat) return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    return NextResponse.json(newCat);
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
