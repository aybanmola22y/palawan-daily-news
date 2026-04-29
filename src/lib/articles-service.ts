import "server-only";
import fs from "fs";
import path from "path";
import { mockArticles, mockOrgChartEmployees } from "./mock-data";
import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";
import { unstable_cache } from "next/cache";

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

export function fromSupabase(row: any): StoredArticle {
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
    authorId: row.author_id || row.author_name,
    status: row.status,
    featured: row.featured,
    breaking: row.breaking,
    views: row.views,
    publishedAt: row.published_at,
    tags: row.tags || [],
    deletedAt: row.deleted_at,
  };
}

export async function ensureDataFile(): Promise<StoredArticle[]> {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try {
    if (fs.existsSync(DATA_FILE)) {
      const mtimeMs = fs.statSync(DATA_FILE).mtimeMs;
      if (cachedArticles && cachedMtimeMs === mtimeMs) {
        return cachedArticles;
      }
    }
  } catch {}

  if (!fs.existsSync(DATA_FILE)) {
    const initial = mockArticles.map(toStored);
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    try {
      cachedArticles = initial;
      cachedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch {}
    return initial;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const existing: StoredArticle[] = JSON.parse(raw);
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
  } catch {}

  return merged;
}

export async function saveArticles(articles: StoredArticle[]): Promise<boolean> {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
    try {
      cachedArticles = articles;
      cachedMtimeMs = fs.statSync(DATA_FILE).mtimeMs;
    } catch {}
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

/** Test / junk rows that may still exist in Supabase — never show on the public site. */
const EXCLUDED_PUBLIC_SLUGS = new Set(["sample-news-article"]);

function filterPublicFeed<T extends { slug: string }>(articles: T[]): T[] {
  return articles.filter((a) => !EXCLUDED_PUBLIC_SLUGS.has(a.slug));
}

/**
 * Slugs + dates only — for /sitemap.xml. Does NOT use unstable_cache
 * (large sites would exceed Next.js’s ~2MB cache limit when full articles are cached).
 */
export async function getPublishedArticleEntriesForSitemap(): Promise<
  { slug: string; publishedAt: string | Date }[]
> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("slug, published_at, title")
      .eq("status", "published")
      .is("deleted_at", null);

    if (!error && data) {
      return data
        .filter((row) => row.slug && !EXCLUDED_PUBLIC_SLUGS.has(row.slug))
        .filter((row) => {
          const t = (row.title || "").toLowerCase();
          return !SPAM_KEYWORDS.some((k) => t.includes(k));
        })
        .map((row) => ({
          slug: row.slug,
          publishedAt: row.published_at,
        }));
    }
  }

  const stored = await getArticles(false, 50000);
  let rows = stored.filter((a) => {
    if (a.status === "published") return true;
    if (a.status === "scheduled") return new Date(a.publishedAt) <= new Date();
    return false;
  });
  rows = filterPublicFeed(rows);
  rows = rows.filter((a) => {
    const t = a.title.toLowerCase();
    return !SPAM_KEYWORDS.some((k) => t.includes(k));
  });
  return rows.map((a) => ({ slug: a.slug, publishedAt: a.publishedAt }));
}

export async function getArticlesForFrontend() {
  const stored = await getArticles(false, 2000);
  return stored.map(fromStored);
}

export async function getPublishedArticles(options: { limit?: number; categorySlug?: string } = {}) {
  const cacheKey = `published-articles-v2-${options.limit ?? 1000}-${options.categorySlug ?? 'all'}`;
  
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

        if (!error && data) {
          let published = data.map(fromSupabase).map(fromStored);
          published = filterPublicFeed(published);
          return published.filter(a => {
            const t = a.title.toLowerCase();
            return !SPAM_KEYWORDS.some(k => t.includes(k));
          });
        }
      }

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

      published = published.filter(a => {
        const t = a.title.toLowerCase();
        return !SPAM_KEYWORDS.some(k => t.includes(k));
      });

      published = filterPublicFeed(published);

      published.sort((a, b) => {
        const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDiff !== 0) return featuredDiff;
        const timeA = new Date(a.publishedAt).getTime();
        const timeB = new Date(b.publishedAt).getTime();
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
      return filterPublicFeed(data.map(fromSupabase).map(fromStored));
    }
  }
  const all = await getPublishedArticles({ limit: 100 });
  const regex = new RegExp(`\\b${query}\\b`, "i");
  return all.filter(a => regex.test(a.title) || regex.test(a.excerpt)).slice(0, limit);
}

export async function getArticleById(id: number) {
  const articles = await getArticles();
  const found = articles.find((a) => a.id === id);
  return found ? fromStored(found) : null;
}

export async function getArticleBySlug(slug: string) {
  if (EXCLUDED_PUBLIC_SLUGS.has(slug)) return null;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug)")
      .eq("slug", slug)
      .single();
    
    if (!error && data) {
      const article = fromSupabase(data);
      if (article.status === "scheduled" && new Date(article.publishedAt) > new Date()) return null;
      return fromStored(article);
    }
  }
  const articles = await getArticles();
  const found = articles.find((a) => a.slug === slug);
  if (!found) return null;
  const article = fromStored(found);
  if (article.status === "scheduled" && new Date(article.publishedAt) > new Date()) return null;
  return article;
}

export async function getDeletedArticles(): Promise<StoredArticle[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("trash_articles")
      .select("*, categories(name, slug)")
      .order("deleted_at", { ascending: false });
    if (!error && data) return data.map(fromSupabase);
  }
  const articles = await ensureDataFile();
  return articles.filter(a => !!a.deletedAt);
}

export async function getAuthorById(id: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data;
    const { data: author, error: authorError } = await supabase.from("authors").select("*").eq("id", id).single();
    if (!authorError && author) return author;
  }
  if (id && typeof id === 'string' && id.length > 2) {
    const decodedName = decodeURIComponent(id);
    return {
      id: id,
      name: decodedName,
      email: decodedName.toLowerCase().replace(/\s+/g, ".") + "@palawandaily.com",
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
    const { data, error } = await supabase.from("profiles").select("*").eq("name", name).single();
    if (!error && data) return data;
    const { data: author, error: authorError } = await supabase.from("authors").select("*").eq("name", name).single();
    if (!authorError && author) return author;
  }
  return getAuthorById(name);
}

export async function getArticlesByAuthor(authorId: string) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*, categories(name, slug)")
      .eq("author_id", authorId)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (!error && data) return filterPublicFeed(data.map(fromSupabase).map(fromStored));
  }
  const decodedId = decodeURIComponent(authorId);
  const articles = await getPublishedArticles({ limit: 100 });
  return articles.filter(a => String(a.authorId) === String(authorId) || String(a.authorId) === decodedId || a.authorName === authorId || a.authorName === decodedId);
}

export async function getAuthors() {
  if (isSupabaseConfigured) {
    let { data: authors, error } = await supabase.from("authors").select("*");
    if (!error && authors && authors.length > 0) return authors.filter(a => !["Kent Janaban", "Staff Reporter"].includes(a.name));
    let { data: profiles, error: pError } = await supabase.from("profiles").select("*");
    if (!pError && profiles) return profiles.filter(p => !["Kent Janaban", "Staff Reporter"].includes(p.name));
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
          return filterPublicFeed(data.map(fromSupabase).map(fromStored)).slice(0, limit);
        }
      }
      const all = await getPublishedArticles({ limit: 100 });
      return filterPublicFeed(all.sort((a, b) => (b.views || 0) - (a.views || 0))).slice(0, limit);
    },
    [`trending-articles-v2-${limit}`],
    { tags: ['articles'], revalidate: 3600 }
  )();
}
