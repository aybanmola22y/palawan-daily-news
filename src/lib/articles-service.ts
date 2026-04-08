import fs from "fs";
import path from "path";
import { mockArticles, mockOrgChartEmployees } from "./mock-data";
import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";
import { unstable_cache, revalidateTag } from "next/cache";

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
  authorId?: string;
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
    authorName: article.authorName,
    authorAvatar: article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.authorName)}&background=random&color=fff`,
    authorId: (article as any).authorId || article.authorName,
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
    authorAvatar: row.author_avatar || (row.profiles?.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.author_name || "Staff")}&background=random&color=fff`,
    authorId: row.author_id || row.author_name, // Fallback to name for local/mock matching
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

export async function getArticles(includeDeleted: boolean = false, limit: number = 2000): Promise<StoredArticle[]> {
  if (isSupabaseConfigured) {
    let query = supabase
      .from("articles")
      .select("*, categories(name, slug)");
    
    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query
      .order("published_at", { ascending: false })
      .limit(limit);
    
    if (!error && data) {
      return data.map(fromSupabase);
    }
    if (error) {
      console.error("Supabase getArticles error:", error);
    }
  }

  const articles = await ensureDataFile();
  if (!includeDeleted) {
    return articles.filter(a => !a.deletedAt);
  }
  return articles;
}

const SPAM_KEYWORDS = [
  "casino", "baccarat", "bingo", "slot", "poker", "gambling", 
  "betting", "blackjack", "slot machine", "online bonus", 
  "cash collect", "real money", "free spins"
];

export async function getArticlesForFrontend() {
  const stored = await getArticles(false, 2000);
  return stored.map(fromStored);
}

export async function getPublishedArticles(options: { limit?: number; categorySlug?: string } = {}) {
  const cacheKey = `published-articles-${options.limit ?? 1000}-${options.categorySlug ?? 'all'}`;
  
  return unstable_cache(
    async () => {
      const limit = options.limit ?? 1000;
      const { categorySlug } = options;

  if (isSupabaseConfigured) {
    const isGlobal = !categorySlug || categorySlug === "all";
    const selectStr = isGlobal ? "*, categories(name, slug)" : "*, categories!inner(name, slug)";
    
    let query = supabase
      .from("articles")
      .select(selectStr)
      .eq("status", "published")
      .is("deleted_at", null);

    if (!isGlobal && categorySlug) {
      const relatedSlugs = [categorySlug];
      if (categorySlug === "opinion") relatedSlugs.push("column");
      if (categorySlug === "column") relatedSlugs.push("opinion");
      if (categorySlug === "national") relatedSlugs.push("national-news");
      if (categorySlug === "national-news") relatedSlugs.push("national");
      if (categorySlug === "legal" || categorySlug === "legal-section") {
        relatedSlugs.push("legal", "legal-section");
      }

      query = query.in("categories.slug", [...new Set(relatedSlugs)]);
    }

    let { data, error } = await query
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase getPublishedArticles error:", error);
      // Fall through to fallback
    } else if (data) {
      let published = data.map(fromSupabase).map(fromStored);
      
      // Local spam filter for safety
      return published.filter(a => {
        const t = a.title.toLowerCase();
        return !SPAM_KEYWORDS.some(k => t.includes(k));
      });
    }
  }

  // Fallback to file/mock
  const all = await getArticlesForFrontend();
  let published = all.filter((a) => {
    if (a.status === "published") return true;
    if (a.status === "scheduled") return new Date(a.publishedAt) <= new Date();
    return false;
  });

  if (categorySlug && categorySlug !== "all") {
    const relatedSlugs = [categorySlug];
    if (categorySlug === "opinion") relatedSlugs.push("column");
    if (categorySlug === "column") relatedSlugs.push("opinion");
    if (categorySlug === "national") relatedSlugs.push("national-news");
    if (categorySlug === "national-news") relatedSlugs.push("national");
    if (categorySlug === "legal" || categorySlug === "legal-section") {
      relatedSlugs.push("legal", "legal-section");
    }

    const uniqueSlugs = [...new Set(relatedSlugs)];
    published = published.filter(a => uniqueSlugs.includes(a.categorySlug));
  }

  // Local spam filter
  published = published.filter(a => {
    const t = a.title.toLowerCase();
    return !SPAM_KEYWORDS.some(k => t.includes(k));
  });

  published.sort((a, b) => {
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDiff !== 0) return featuredDiff;
    const timeA = a.publishedAt instanceof Date ? a.publishedAt.getTime() : new Date(a.publishedAt).getTime();
    const timeB = b.publishedAt instanceof Date ? b.publishedAt.getTime() : new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

      return published.slice(0, limit);
    },
    [cacheKey],
    { tags: ['articles'], revalidate: 3600 }
  )();
}

export async function searchArticles(query: string, limit: number = 100): Promise<any[]> {
  if (!query) return [];
  
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug)")
      .eq("status", "published")
      .is("deleted_at", null)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (!error && data) {
      return data.map(fromSupabase).map(fromStored);
    }
    if (error) console.error("Supabase searchArticles error:", error);
  }

  // Fallback to local filtering
  const all = await getPublishedArticles({ limit: 100 });
  const regex = new RegExp(`\\b${query}\\b`, "i");
  return all.filter(a => 
    regex.test(a.title) || 
    regex.test(a.excerpt)
  ).slice(0, limit);
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
      .select("*, categories(name, slug)")
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
      revalidateTag('articles');
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath("/admin/articles");
      return fromSupabase(data);
    }
    if (error) {
      console.error("Supabase createArticle error:", error);
      return null;
    }
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
      const { revalidatePath } = await import("next/cache");
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
    if (!error) {
      revalidateTag('articles');
      return true;
    }
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
      .select("*, categories(name, slug)")
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

export async function getAuthorById(id: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (!error && data) return data;
  }
  
  // Try authors table next
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data;
  }
  
  
  // Final fallback: If we still haven't found an author but we have a name/id,
  // return a "virtual" author object so the profile page still works for legacy/guest authors.
  if (id && typeof id === 'string' && id.length > 2) {
    // Ensure we decode the ID if it's a name with encoding (e.g., "Lance%20Factor")
    const decodedName = decodeURIComponent(id);
    
    return {
      id: id,
      name: decodedName,
      email: decodedName.toLowerCase().replace(/\s+/g, ".") + "@palawandailynews.com",
      role: "contributor",
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(decodedName)}&background=random&color=fff`,
      department: "Editorial",
      title: "Staff Reporter",
      active: true,
      created_at: new Date("2024-01-01").toISOString()
    };
  }

  return null;
}

export async function getAuthorByName(name: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("name", name)
      .single();
    if (!error && data) return data;
  }
  
  // Try authors table
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .eq("name", name)
      .single();
    if (!error && data) return data;
  }

  return getAuthorById(name); // fallback to ID/name search which now has the virtual fallback
}

export async function getArticlesByAuthor(authorId: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug)")
      .eq("author_id", authorId)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    
    if (!error && data) return data.map(fromSupabase).map(fromStored);
  }
  
  const decodedId = decodeURIComponent(authorId);
  const articles = await getPublishedArticles({ limit: 100 });
  return articles.filter(a => 
    String(a.authorId) === String(authorId) || 
    String(a.authorId) === decodedId ||
    a.authorName === authorId ||
    a.authorName === decodedId
  );
}

export async function deleteAuthor(id: string) {
  if (isSupabaseConfigured) {
    // Try authors table first (the one just created)
    let { error } = await supabaseAdmin.from("authors").delete().eq("id", id);
    if (error) {
      // Try profiles as fallback
      const { error: profileError } = await supabaseAdmin.from("profiles").delete().eq("id", id);
      error = profileError;
    }
    return !error;
  }
  return false;
}

const MOCK_USER_NAMES = [
  "Kent Janaban", "Harthwell Capistrano", "Clarina Herrera Guludah", 
  "Rexcel John Sorza", "Atty. Analisa Navarro - Padon", "Sevedeo Borda III", 
  "Hanna Camella Talabucon", "Gerardo Reyes Jr.", "John Castor Viernes", 
  "Maria Santos", "Mechael Glen Dagot", "Carlos dela Cruz", 
  "Ana Bautista", "Roberto Cruz", "Liza Garcia", 
  "Miguel Torres", "Sofia Reyes", "Jose Reyes", "Staff Reporter"
];

export async function getAuthors() {
  if (isSupabaseConfigured) {
    // Try authors table first
    let { data: authors, error: authorsError } = await supabase
      .from("authors")
      .select("*");
    
    if (!authorsError && authors && authors.length > 0) {
      return authors.filter(a => !MOCK_USER_NAMES.includes(a.name));
    }
    
    // Fallback to profiles
    let { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");
    
    if (!profilesError && profiles) {
      return profiles.filter(p => !MOCK_USER_NAMES.includes(p.name));
    }
  }
  
  return mockOrgChartEmployees.map(emp => ({
    id: emp.id,
    name: emp.name,
    email: emp.name.toLowerCase().replace(/\s+/g, ".") + "@palawandaily.com",
    role: "writer",
    avatar_url: emp.avatarUrl,
    department: emp.department,
    title: emp.title,
    active: true,
    created_at: new Date("2024-01-15").toISOString()
  }));
}

export async function incrementArticleViews(slug: string) {
  if (isSupabaseConfigured) {
    try {
      // First find the article ID and current views
      const { data, error: selectError } = await supabase
        .from("articles")
        .select("id, views")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      
      if (data && !selectError) {
        // Use supabaseAdmin to bypass RLS for incrementing views
        await supabaseAdmin
          .from("articles")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);
      }
    } catch (err) {
      console.error("Error incrementing article views:", err);
    }
    return;
  }

  // Local JSON fallback
  try {
    const articles = await getArticles();
    const found = articles.find((a) => a.slug === slug);
    if (found) {
      found.views = (found.views || 0) + 1;
      fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
      // Force cache invalidation
      cachedArticles = null;
    }
  } catch (err) {
    // ignore
  }
}

export async function getTrendingArticles(limit: number = 5) {
  return unstable_cache(
    async () => {
      if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("views", { ascending: false })
      .limit(limit);
    
    if (!error && data) {
      return data.map(fromSupabase).map(fromStored);
    }
    if (error) {
      console.error("Supabase getTrendingArticles error:", error);
    }
  }

  // Fallback: Sort published articles by views
  const all = await getPublishedArticles({ limit: 100 });
    return all
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
    },
    [`trending-articles-${limit}`],
    { tags: ['articles'], revalidate: 3600 }
  )();
}
