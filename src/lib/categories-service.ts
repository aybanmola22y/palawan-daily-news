import fs from "fs";
import path from "path";
import { mockCategories } from "./mock-data";
import { getArticles } from "./articles-service";
import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";
import { unstable_cache, revalidateTag } from "next/cache";

export interface StoredCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount?: number;
}

function fromSupabase(row: any): StoredCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    color: row.color || "blue",
  };
}

const DATA_FILE = path.join(process.cwd(), "src/data/categories.json");

let cachedCategories: StoredCategory[] | null = null;
let cachedMtimeMs: number | null = null;

async function ensureDataFile(): Promise<StoredCategory[]> {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  try {
    if (fs.existsSync(DATA_FILE)) {
      const mtimeMs = fs.statSync(DATA_FILE).mtimeMs;
      if (cachedCategories && cachedMtimeMs === mtimeMs) return cachedCategories;
    }
  } catch {}

  if (!fs.existsSync(DATA_FILE)) {
    const initial = mockCategories.map(c => ({ ...c }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    cachedCategories = initial;
    return initial;
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const categories: StoredCategory[] = JSON.parse(raw);
  cachedCategories = categories;
  return categories;
}

async function saveCategories(categories: StoredCategory[]): Promise<boolean> {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 2), "utf-8");
    cachedCategories = categories;
    return true;
  } catch (e) {
    console.error("Error saving categories:", e);
    return false;
  }
}

export async function getCategories(): Promise<StoredCategory[]> {
  return unstable_cache(
    async () => {
      let categories: StoredCategory[] = [];

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from("categories").select("*").order("name");
        if (!error && data) {
          categories = data.map(fromSupabase);
        }
      }

      if (categories.length === 0) {
        categories = await ensureDataFile();
      }

      // Optimize: Don't fetch all articles just to count them. 
      // This was causing timeouts in large databases.
      return categories.map(cat => ({
        ...cat,
        articleCount: 0 // Placeholder or implementation-pending
      }));
    },
    ['categories'],
    { tags: ['categories'], revalidate: 3600 }
  )();
}

export async function createCategory(input: Partial<StoredCategory>): Promise<StoredCategory | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description,
        color: input.color,
      })
      .select()
      .single();
    
    if (!error && data) {
      revalidateTag('categories');
      return fromSupabase(data);
    }
    if (error) {
      console.error("Supabase createCategory error:", error);
      return null; // Don't fall back to JSON if Supabase is configured
    }
  }

  const categories = await ensureDataFile();
  const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) : 0;
  const newCat: StoredCategory = {
    id: maxId + 1,
    name: input.name ?? "",
    slug: input.slug ?? "",
    description: input.description ?? "",
    color: input.color ?? "blue",
  };
  categories.push(newCat);
  const ok = await saveCategories(categories);
  return ok ? newCat : null;
}

export async function updateCategory(id: number | string, updates: Partial<StoredCategory>): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("categories")
      .update({
        name: updates.name,
        slug: updates.slug,
        description: updates.description,
        color: updates.color,
      })
      .eq("id", id);
    if (!error) {
      revalidateTag('categories');
      return true;
    }
    console.error("Supabase updateCategory error:", error);
    return false; // Don't fall back to JSON if Supabase is configured
  }

  const categories = await ensureDataFile();
  const idx = categories.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return false;
  categories[idx] = { ...categories[idx], ...updates };
  return await saveCategories(categories);
}

export async function deleteCategory(id: number | string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (!error) {
      revalidateTag('categories');
      return true;
    }
    console.error("Supabase deleteCategory error:", error);
    return false; // Don't fall back to JSON if Supabase is configured
  }

  const categories = await ensureDataFile();
  const next = categories.filter(c => String(c.id) !== String(id));
  if (next.length === categories.length) return false;
  return await saveCategories(next);
}
