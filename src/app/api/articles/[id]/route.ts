import { NextResponse } from "next/server";
import {
  getArticleById,
  deleteArticle,
  updateArticle,
  type StoredArticle,
} from "@/lib/articles-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const updates: Record<string, unknown> = { ...body };
    delete updates.category;

    if (body.category != null) {
      const { getCategories } = await import("@/lib/categories-service");
      const categories = await getCategories();
      const catName = String(body.category);
      const catSlug = catName.toLowerCase().replace(/\s+/g, "-");
      const cat = categories.find(
        (c) => c.slug === catSlug || c.name === catName
      );
      updates.categoryId = cat?.id ?? 1;
      updates.categoryName = cat?.name ?? catName;
      updates.categorySlug = cat?.slug ?? catSlug;
    }
    
    if (body.scheduledAt) {
      updates.publishedAt = body.scheduledAt;
    }
    
    if (typeof body.tags === "string") {
      updates.tags = body.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    const success = await updateArticle(id, updates as Partial<StoredArticle>);
    if (!success) {
      return NextResponse.json({ error: "Failed to update article" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const permanent = searchParams.get("permanent") === "true";

  let success;
  if (permanent) {
    const { permanentlyDeleteArticle } = await import("@/lib/articles-service");
    success = await permanentlyDeleteArticle(id);
  } else {
    success = await deleteArticle(id);
  }

  if (!success) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

