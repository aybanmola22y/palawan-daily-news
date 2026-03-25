import fs from "fs";
import path from "path";
import { mockCategories } from "./mock-data";
import { getArticles } from "./articles-service";

export interface StoredCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  articleCount?: number;
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
  const categories = await ensureDataFile();
  const articles = await getArticles();

  // Calculate article counts dynamically
  return categories.map(cat => ({
    ...cat,
    articleCount: articles.filter(a => a.categoryId === cat.id || a.categorySlug === cat.slug).length
  }));
}

export async function createCategory(input: Partial<StoredCategory>): Promise<StoredCategory | null> {
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

export async function updateCategory(id: number, updates: Partial<StoredCategory>): Promise<boolean> {
  const categories = await ensureDataFile();
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return false;
  categories[idx] = { ...categories[idx], ...updates };
  return await saveCategories(categories);
}

export async function deleteCategory(id: number): Promise<boolean> {
  const categories = await ensureDataFile();
  const next = categories.filter(c => c.id !== id);
  if (next.length === categories.length) return false;
  return await saveCategories(next);
}
