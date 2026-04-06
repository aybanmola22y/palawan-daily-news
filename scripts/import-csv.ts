import { createClient } from "@supabase/supabase-js";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import he from "he";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ─── Supabase Setup ───────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// ─── Category Mapping (WordPress → our slugs) ────────────────────────────────
const CATEGORY_MAP: Record<string, { name: string; slug: string }> = {
  "city news": { name: "City News", slug: "city-news" },
  "city news > puerto princesa city": { name: "City News", slug: "city-news" },
  "provincial news": { name: "Provincial News", slug: "provincial-news" },
  "provincial news > brooke's point": { name: "Provincial News", slug: "provincial-news" },
  "provincial news > el nido": { name: "Provincial News", slug: "provincial-news" },
  "provincial news > roxas": { name: "Provincial News", slug: "provincial-news" },
  "provincial news > san vicente": { name: "Provincial News", slug: "provincial-news" },
  "regional news": { name: "Regional News", slug: "regional-news" },
  "national news": { name: "National News", slug: "national-news" },
  "international": { name: "International", slug: "international" },
  "environment": { name: "Environment", slug: "environment" },
  "lifestyle": { name: "Lifestyle", slug: "lifestyle" },
  "sports": { name: "Sports", slug: "sports" },
  "column": { name: "Column", slug: "column" },
  "opinion": { name: "Opinion", slug: "opinion" },
  "feature": { name: "Feature", slug: "feature" },
  "business": { name: "Business", slug: "business" },
  "legal": { name: "Legal Section", slug: "legal-section" },
  "legal section": { name: "Legal Section", slug: "legal-section" },
  "uncategorized": { name: "City News", slug: "city-news" },
};

// Author display name mapping
const AUTHOR_MAP: Record<string, string> = {
  "hannacameliatalabucon": "Hanna Camella Talabucon",
  "hanna-camella-talabucon": "Hanna Camella Talabucon",
  "gerardoreyesjr": "Gerardo Reyes Jr",
  "gerardo-reyes-jr": "Gerardo Reyes Jr",
  "lancefactor": "Lance Factor",
  "lance-factor": "Lance Factor",
  "pdn-associate-editor": "PDN Associate Editor",
  "pdnassociateeditor": "PDN Associate Editor",
  "admin": "PDN Editorial Team",
  "administrator": "PDN Editorial Team",
};

function resolveCategory(rawCategories: string): { name: string; slug: string } {
  if (!rawCategories) return { name: "City News", slug: "city-news" };
  // Take the first category
  const cats = rawCategories.split(",").map(c => c.trim().toLowerCase());
  for (const cat of cats) {
    if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
    // partial match
    for (const [key, val] of Object.entries(CATEGORY_MAP)) {
      if (cat.includes(key) || key.includes(cat)) return val;
    }
  }
  return { name: "City News", slug: "city-news" };
}

function resolveAuthor(rawAuthor: string): string {
  if (!rawAuthor) return "PDN Editorial Team";
  const lower = rawAuthor.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
  // Check map using normalized key
  for (const [key, val] of Object.entries(AUTHOR_MAP)) {
    if (key.replace(/-/g, "") === lower || rawAuthor.toLowerCase() === key) return val;
  }
  // Fallback: prettify the username
  return rawAuthor
    .replace(/-/g, " ")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function generateSlug(title: string, urlSlug?: string): string {
  if (urlSlug && urlSlug.trim()) return urlSlug.trim().toLowerCase();
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

function cleanText(text: string): string {
  if (!text) return "";
  return he.decode(text.trim());
}

async function importCsv() {
  // Fetch existing categories from Supabase
  const { data: existingCats } = await supabase.from("categories").select("id, slug");
  const categoryIdMap: Record<string, string> = {};
  for (const cat of existingCats || []) {
    categoryIdMap[cat.slug] = cat.id;
  }
  console.log(`✅ Loaded ${Object.keys(categoryIdMap).length} categories from Supabase`);

  const records: any[] = [];
  const slugsSeen = new Set<string>();
  let skipped = 0;

  await new Promise<void>((resolve, reject) => {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    createReadStream("data/pdn-data.csv").pipe(parser);

    parser.on("data", (row: Record<string, string>) => {
      const title = cleanText(row["Title"] || "");
      if (!title) { skipped++; return; }

      const status = (row["Status"] || "draft").toLowerCase();
      // Only import published articles
      if (status !== "published") { skipped++; return; }

      const rawSlug = row["URL Slug"] || row["﻿URL Slug"] || "";
      let slug = generateSlug(title, rawSlug);

      // Deduplicate slugs
      if (slugsSeen.has(slug)) {
        const id = row["record_id"] || Date.now().toString();
        slug = `${slug}-${id}`;
      }
      slugsSeen.add(slug);

      const category = resolveCategory(row["Categories"] || "");
      const categoryId = categoryIdMap[category.slug];

      const authorRaw = row["Author"] || "";
      const authorName = resolveAuthor(authorRaw);

      // Get featured image - try multiple possible column names
      const featuredImage =
        row["Featured Image"] ||
        row["Featured Image URL"] ||
        row["Thumbnail"] ||
        "";

      const publishedAt = row["Date"] ? new Date(row["Date"]).toISOString() : new Date().toISOString();
      const content = row["Content"] || "";
      const excerpt = cleanText(row["Excerpt"] || "");
      const seoTitle = cleanText(row["Yoast Wpseo Title"] || row["SEO Title"] || title);
      const seoDescription = cleanText(row["Yoast Wpseo Metadesc"] || row["SEO Description"] || excerpt);

      // Parse tags
      const rawTags = row["Tags"] || "";
      const tags = rawTags ? rawTags.split(",").map((t: string) => cleanText(t)).filter(Boolean) : [];

      records.push({
        title: cleanText(title),
        slug,
        content,
        excerpt: excerpt || cleanText(title).substring(0, 200),
        featured_image: featuredImage || null,
        status: "published",
        category_id: categoryId || null,
        author_name: authorName,
        author_avatar: null,
        author_id: null,
        tags,
        views: 0,
        featured: false,
        breaking: false,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        published_at: publishedAt,
        created_at: publishedAt,
        updated_at: publishedAt,
      });
    });

    parser.on("end", resolve);
    parser.on("error", reject);
  });

  console.log(`📋 Parsed ${records.length} valid published articles (skipped ${skipped})`);

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("articles").insert(batch);
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
      failed += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r🚀 Inserted ${inserted}/${records.length} articles...`);
    }
  }

  console.log(`\n\n✅ Import complete!`);
  console.log(`   ✔ Inserted: ${inserted}`);
  console.log(`   ✖ Failed:   ${failed}`);
  console.log(`   ⏭ Skipped:  ${skipped} (drafts/non-published)`);
}

importCsv().catch(console.error);
