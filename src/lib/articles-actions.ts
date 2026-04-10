"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { getArticles, saveArticles, StoredArticle, fromSupabase, ensureDataFile } from "./articles-service";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/articles.json");

export async function createArticle(input: Partial<StoredArticle>): Promise<StoredArticle | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        featured_image: input.featuredImage,
        category_id: input.categoryId,
        status: input.status,
        featured: input.featured,
        breaking: input.breaking,
        published_at: input.publishedAt,
        tags: input.tags,
        author_name: input.authorName,
        author_avatar: input.authorAvatar,
      })
      .select()
      .single();
    
    if (!error && data) {
      revalidateTag('articles');
      revalidatePath("/");
      revalidatePath("/admin/articles");
      return fromSupabase(data);
    }
    if (error) {
      console.error("Supabase createArticle error:", error);
      return null;
    }
  }

  // Local JSON fallback
  const articles = await getArticles();
  const maxId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) : 0;
  
  if (input.featured === true) {
    for (const a of articles) a.featured = false;
  }
  
  const newArticle: StoredArticle = {
    id: maxId + 1,
    title: input.title ?? "",
    slug: input.slug ?? "",
    excerpt: input.excerpt ?? "",
    content: input.content ?? "",
    featuredImage: input.featuredImage ?? "",
    categoryId: input.categoryId ?? 1,
    categoryName: input.categoryName ?? "",
    categorySlug: input.categorySlug ?? "",
    authorName: input.authorName ?? "Staff",
    authorAvatar: input.authorAvatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(input.authorName || "Staff")}&background=random&color=fff`,
    status: input.status ?? "draft",
    featured: input.featured ?? false,
    breaking: input.breaking ?? false,
    views: input.views ?? 0,
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    tags: Array.isArray(input.tags) ? input.tags : (typeof input.tags === "string" ? (input.tags as string).split(",").map((t) => t.trim()).filter(Boolean) : []),
    seoTitle: input.seoTitle ?? "",
    seoDescription: input.seoDescription ?? "",
  };
  
  articles.push(newArticle);
  const ok = await saveArticles(articles);
  if (ok) {
    revalidateTag('articles');
    revalidatePath("/");
    revalidatePath("/admin/articles");
  }
  return ok ? newArticle : null;
}

export async function updateArticle(id: number | string, updates: Partial<StoredArticle>): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin
      .from("articles")
      .update({
        title: updates.title,
        slug: updates.slug,
        excerpt: updates.excerpt,
        content: updates.content,
        featured_image: updates.featuredImage,
        category_id: updates.categoryId,
        status: updates.status,
        featured: updates.featured,
        breaking: updates.breaking,
        published_at: updates.publishedAt,
        tags: updates.tags,
        author_name: updates.authorName,
        author_avatar: updates.authorAvatar,
      })
      .eq("id", id);
    
    if (!error) {
      revalidateTag('articles');
      revalidatePath("/");
      revalidatePath("/admin/articles");
      return true;
    }
    console.error("Supabase updateArticle error:", error);
    return false;
  }

  const articles = await getArticles();
  const idx = articles.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;

  if (updates.featured === true) {
    for (const a of articles) {
      if (a.id !== id) a.featured = false;
    }
  }

  const updated = { ...articles[idx], ...updates };
  const pubAt = updates.publishedAt;
  if (pubAt != null && typeof pubAt === "object" && "toISOString" in pubAt) {
    (updated as StoredArticle).publishedAt = (pubAt as Date).toISOString();
  }
  if (Array.isArray(updates.tags)) {
    (updated as StoredArticle).tags = updates.tags;
  } else if (typeof updates.tags === "string") {
    (updated as StoredArticle).tags = (updates.tags as string).split(",").map((t) => t.trim()).filter(Boolean);
  }
  
  articles[idx] = updated as StoredArticle;
  const ok = await saveArticles(articles);
  if (ok) {
    revalidateTag('articles');
    revalidatePath("/");
    revalidatePath("/admin/articles");
  }
  return ok;
}

export async function deleteArticle(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("id", id);
    if (!error) {
      revalidateTag('articles');
      return true;
    }
    console.error("Supabase deleteArticle error:", error);
    return false;
  }

  const articles = await ensureDataFile();
  const idx = articles.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;
  articles[idx].deletedAt = new Date().toISOString();
  const ok = await saveArticles(articles);
  if (ok) revalidateTag('articles');
  return ok;
}

export async function restoreArticle(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { data: article, error: fetchError } = await supabaseAdmin
      .from("trash_articles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (fetchError || !article) return false;

    const { deleted_at, ...originalData } = article;
    const { error: insertError } = await supabaseAdmin
      .from("articles")
      .insert({ ...originalData, deleted_at: null });
    
    if (insertError) {
      console.error("Supabase restoreArticle error:", insertError);
      return false;
    }

    await supabaseAdmin.from("trash_articles").delete().eq("id", id);
    revalidateTag('articles');
    return true;
  }

  const articles = await ensureDataFile();
  const idx = articles.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;
  articles[idx].deletedAt = null;
  const ok = await saveArticles(articles);
  if (ok) revalidateTag('articles');
  return ok;
}

export async function permanentlyDeleteArticle(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from("trash_articles").delete().eq("id", id);
    if (!error) {
      revalidateTag('articles');
      return true;
    }
    return false;
  }

  const articles = await ensureDataFile();
  const next = articles.filter((a) => String(a.id) !== String(id));
  if (next.length === articles.length) return false;
  const ok = await saveArticles(next);
  if (ok) revalidateTag('articles');
  return ok;
}

export async function deleteAuthor(id: string) {
  if (isSupabaseConfigured) {
    let { error } = await supabaseAdmin.from("authors").delete().eq("id", id);
    if (error) {
      const { error: profileError } = await supabaseAdmin.from("profiles").delete().eq("id", id);
      error = profileError;
    }
    if (!error) revalidateTag('articles');
    return !error;
  }
  return false;
}

export async function incrementArticleViews(slug: string) {
  if (isSupabaseConfigured) {
    try {
      const { data, error: selectError } = await supabaseAdmin
        .from("articles")
        .select("id, views")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      
      if (data && !selectError) {
        await supabaseAdmin
          .from("articles")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);
        // We don't necessarily need to revalidate on every view increment
        // unless we want real-time trending, which unstable_cache handles with TTL anyway
      }
    } catch (err) {
      console.error("Error incrementing article views:", err);
    }
    return;
  }

  try {
    const articles = await getArticles();
    const found = articles.find((a) => a.slug === slug);
    if (found) {
      found.views = (found.views || 0) + 1;
      fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
    }
  } catch (err) {
    // ignore
  }
}
