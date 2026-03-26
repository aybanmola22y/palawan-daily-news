import fs from "fs";
import path from "path";
import { mockArticles } from "./mock-data";
import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";

export interface StoredArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  authorName: string;
  authorAvatar: string;
  status: string;
  featured: boolean;
  breaking: boolean;
  views: number;
  publishedAt: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  deletedAt?: string | null;
}

const DATA_FILE = path.join(process.cwd(), "src/data/articles.json");

// Lightweight in-memory cache to avoid re-reading/parsing JSON on every request.
// Automatically invalidates if the file changes on disk (mtime).
let cachedArticles: StoredArticle[] | null = null;
let cachedMtimeMs: number | null = null;

function toStored(article: (typeof mockArticles)[0]): StoredArticle {
  return {
    ...article,
    publishedAt: article.publishedAt instanceof Date ? article.publishedAt.toISOString() : article.publishedAt,
    tags: Array.isArray(article.tags) ? article.tags : [],
  };
}

function fromStored(article: StoredArticle) {
  return {
    ...article,
    publishedAt: new Date(article.publishedAt),
  };
}

function fromSupabase(row: any): StoredArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featured_image,
    categoryId: row.category_id,
    categoryName: row.categories?.name || "",
    categorySlug: row.categories?.slug || "",
    authorName: row.author_name || (row.profiles?.name) || "Staff",
    authorAvatar: row.author_avatar || (row.profiles?.avatar_url) || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    status: row.status,
    featured: row.featured,
    breaking: row.breaking,
    views: row.views,
    publishedAt: row.published_at,
    tags: row.tags || [],
    deletedAt: row.deleted_at,
  };
}

async function ensureDataFile(): Promise<StoredArticle[]> {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Serve from cache if the underlying file hasn't changed.
  try {
    if (fs.existsSync(DATA_FILE)) {
      const mtimeMs = fs.statSync(DATA_FILE).mtimeMs;
      if (cachedArticles && cachedMtimeMs === mtimeMs) {
        return cachedArticles;
      }
    }
  } catch {
    // ignore cache checks if stat fails
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initial = mockArticles.map(toStored);
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    try {
      cachedArticles = initial;
      cachedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch {
      // ignore
    }
    return initial;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const existing: StoredArticle[] = JSON.parse(raw);

  // Ensure any new mock articles (e.g., newly added categories) are also present
  // in the stored JSON file so category pages always see the latest demo content.
  const existingSlugs = new Set(existing.map((a) => a.slug));
  let merged = existing;
  let updated = false;

  for (const mock of mockArticles) {
    if (!existingSlugs.has(mock.slug)) {
      if (merged === existing) merged = [...existing];
      merged.push(toStored(mock));
      updated = true;
    }
  }

  // Guard against duplicate IDs in the stored file (can happen after manual edits
  // or older demo data). React lists and admin tables require stable unique keys.
  const seenIds = new Set<number>();
  const currentMaxId = merged.reduce((m, a) => (typeof a.id === "number" && a.id > m ? a.id : m), 0);
  let nextId = currentMaxId + 1;
  for (const a of merged) {
    if (seenIds.has(a.id)) {
      a.id = nextId++;
      updated = true;
    }
    seenIds.add(a.id);
  }

  if (updated) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
  }

  try {
    cachedArticles = merged;
    cachedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
  } catch {
    // ignore
  }

  return merged;
}

async function saveArticles(articles: StoredArticle[]): Promise<boolean> {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
    try {
      cachedArticles = articles;
      cachedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch {
      // ignore
    }
    return true;
  } catch (e) {
    console.error("Error saving articles:", e);
    return false;
  }
}

export async function getArticles(includeDeleted: boolean = false): Promise<StoredArticle[]> {
  if (isSupabaseConfigured) {
    let query = supabase
      .from("articles")
      .select("*, categories(name, slug), profiles(name, avatar_url)");
    
    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (!error && data) {
      return data.map(fromSupabase);
    }
  }

  const articles = await ensureDataFile();
  if (!includeDeleted) {
    return articles.filter(a => !a.deletedAt);
  }
  return articles;
}

export async function getArticlesForFrontend() {
  const stored = await getArticles();
  return stored.map(fromStored);
}

export async function getPublishedArticles() {
  const all = await getArticlesForFrontend();
  const published = all.filter((a) => {
    if (a.status === "published") return true;
    if (a.status === "scheduled") {
      return new Date(a.publishedAt) <= new Date();
    }
    return false;
  });

  // Prefer featured (and newer) content first so homepage hero updates when
  // admins change which article is marked featured.
  published.sort((a, b) => {
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDiff !== 0) return featuredDiff;

    const breakingDiff = Number(Boolean(b.breaking)) - Number(Boolean(a.breaking));
    if (breakingDiff !== 0) return breakingDiff;

    const timeA = a.publishedAt instanceof Date ? a.publishedAt.getTime() : new Date(a.publishedAt).getTime();
    const timeB = b.publishedAt instanceof Date ? b.publishedAt.getTime() : new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

  return published;
}

export async function getArticleById(id: number) {
  const articles = await getArticles();
  const found = articles.find((a) => a.id === id);
  return found ? fromStored(found) : null;
}

export async function getArticleBySlug(slug: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug), profiles(name, avatar_url)")
      .eq("slug", slug)
      .single();
    
    if (!error && data) {
      const article = fromSupabase(data);
      if (article.status === "scheduled" && new Date(article.publishedAt) > new Date()) {
        return null;
      }
      return fromStored(article);
    }
  }

  const articles = await getArticles();
  const found = articles.find((a) => a.slug === slug);
  if (!found) return null;
  const article = fromStored(found);
  
  if (article.status === "scheduled" && new Date(article.publishedAt) > new Date()) {
    return null;
  }
  
  return article;
}

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
      return fromSupabase(data);
    }
    console.error("Supabase createArticle error:", error);
    // Return null — do NOT fall through to the JSON file writer.
    // On Vercel the filesystem is read-only and would crash if we tried.
    return null;
  }

  // Local JSON fallback — only used when Supabase is NOT configured at all
  const articles = await getArticles();
  const maxId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) : 0;
  // Enforce a single featured article.
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
    authorAvatar: input.authorAvatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
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
    
    if (!error) return true;
    console.error("Supabase updateArticle error:", error);
    return false;
  }

  const articles = await getArticles();
  const idx = articles.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;

  // Enforce a single featured article.
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
  if (updates.seoTitle !== undefined) (updated as StoredArticle).seoTitle = updates.seoTitle;
  if (updates.seoDescription !== undefined) (updated as StoredArticle).seoDescription = updates.seoDescription;

  articles[idx] = updated as StoredArticle;
  return await saveArticles(articles);
}

export async function deleteArticle(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    // A physical delete on 'articles' will trigger the 'on_article_delete' function
    // which moves the row to 'trash_articles' automatically.
    const { error } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("id", id);
    if (!error) return true;
    console.error("Supabase deleteArticle (physical move to trash) error:", error);
    return false;
  }

  const articles = await ensureDataFile();
  const idx = articles.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;
  articles[idx].deletedAt = new Date().toISOString();
  return await saveArticles(articles);
}

export async function getDeletedArticles(): Promise<StoredArticle[]> {
  if (isSupabaseConfigured) {
    // Fetch from the physical trash table
    const { data, error } = await supabaseAdmin
      .from("trash_articles")
      .select("*, categories(name, slug), profiles(name, avatar_url)")
      .order("deleted_at", { ascending: false });
    
    if (!error && data) return data.map(fromSupabase);
  }

  const articles = await ensureDataFile();
  return articles.filter(a => !!a.deletedAt);
}

export async function restoreArticle(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    // 1. Fetch from trash
    const { data: article, error: fetchError } = await supabaseAdmin
      .from("trash_articles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (fetchError || !article) return false;

    // 2. Insert back into articles (remove deleted_at)
    const { deleted_at, ...originalData } = article;
    const { error: insertError } = await supabaseAdmin
      .from("articles")
      .insert({ ...originalData, deleted_at: null });
    
    if (insertError) {
      console.error("Supabase restoreArticle (insert back) error:", insertError);
      return false;
    }

    // 3. Delete from trash
    await supabaseAdmin.from("trash_articles").delete().eq("id", id);
    return true;
  }

  const articles = await ensureDataFile();
  const idx = articles.findIndex((a) => String(a.id) === String(id));
  if (idx === -1) return false;
  articles[idx].deletedAt = null;
  return await saveArticles(articles);
}

export async function permanentlyDeleteArticle(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    // Delete from the physical trash table
    const { error } = await supabaseAdmin.from("trash_articles").delete().eq("id", id);
    if (!error) return true;
    return false;
  }

  const articles = await ensureDataFile();
  const next = articles.filter((a) => String(a.id) !== String(id));
  if (next.length === articles.length) return false;
  return await saveArticles(next);
}
