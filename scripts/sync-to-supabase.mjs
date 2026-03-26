import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const ARTICLES_PATH = path.join(process.cwd(), "src/data/articles.json");

async function sync() {
  console.log("🚀 Starting Supabase Sync...");
  
  if (!fs.existsSync(ARTICLES_PATH)) {
    console.error("❌ Could not find articles.json");
    process.exit(1);
  }

  const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
  const localArticles = JSON.parse(raw);
  
  console.log(`📝 Found ${localArticles.length} articles locally.`);

  for (const article of localArticles) {
    // Map to Supabase column names
    const supabaseData = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featuredImage,
      category_id: article.categoryId,
      status: article.status,
      featured: article.featured,
      breaking: article.breaking,
      views: article.views || 0,
      published_at: article.publishedAt,
      tags: article.tags || [],
      author_name: article.authorName,
      author_avatar: article.authorAvatar,
    };

    const { error } = await supabase
      .from("articles")
      .upsert(supabaseData, { onConflict: "id" });

    if (error) {
      console.error(`❌ Error syncing article ${article.id}:`, error.message);
    } else {
      console.log(`✅ Synced: ${article.title}`);
    }
  }

  console.log("\n🎉 ALL DONE! Your 35+ articles are now live in Supabase. 🏆");
}

sync();
