import { NextRequest, NextResponse } from "next/server";
import { getArticlesForFrontend } from "@/lib/articles-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let articles;
  if (status === "deleted") {
    const { getDeletedArticles } = await import("@/lib/articles-service");
    articles = await getDeletedArticles();
  } else {
    articles = await getArticlesForFrontend();
  }

  if (status && status !== "deleted") {
    articles = articles.filter((a) => a.status === status);
  }
  if (category) {
    articles = articles.filter((a) => a.categorySlug === category);
  }
  if (q) {
    const query = q.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query)
    );
  }

  const total = articles.length;
  const start = (page - 1) * limit;
  const data = articles.slice(start, start + limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { createArticle } = await import("@/lib/articles-service");
    const { getCategories } = await import("@/lib/categories-service");
    const categories = await getCategories();

    const catName = body.category || body.categoryName || "";
    const catSlug = catName.toLowerCase().replace(/\s+/g, "-");
    const cat = categories.find(
      (c) => c.slug === catSlug || c.name === catName
    );

    const article = await createArticle({
      title: body.title ?? "",
      slug: body.slug ?? "",
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      featuredImage: body.featuredImage ?? "",
      categoryId: cat?.id ?? 1,
      categoryName: cat?.name ?? catName,
      categorySlug: cat?.slug ?? catSlug,
      authorName: body.authorName || "Palawan Daily News",
      authorAvatar: body.authorAvatar,
      status: body.status ?? "draft",
      featured: body.featured ?? false,
      breaking: body.breaking ?? false,
      views: 0,
      publishedAt:
        body.status === "published"
          ? new Date().toISOString()
          : (body.scheduledAt || body.publishedAt || new Date().toISOString()),
      tags:
        typeof body.tags === "string"
          ? body.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : Array.isArray(body.tags)
            ? body.tags
            : [],
    });

    if (!article) {
      return NextResponse.json(
        { error: "Failed to create article in database" },
        { status: 400 }
      );
    }
    return NextResponse.json(article);
  } catch (error: any) {
    console.error("API Articles POST Error:", error);
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}
