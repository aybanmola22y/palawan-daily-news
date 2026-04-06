import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const wpUrl = process.argv[2];
  if (!wpUrl) {
    console.error("Please provide your WordPress site URL.");
    console.error('Usage: npx tsx scripts/import-wp.ts "https://old-site.com"');
    process.exit(1);
  }

  // Remove trailing slash
  const url = wpUrl.replace(/\/$/, "");
  const apiEndpoint = `${url}/wp-json/wp/v2/posts?_embed=true&per_page=50`;

  console.log(`Fetching articles from: ${apiEndpoint}`);

  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch from WP: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(`Found ${posts.length} articles to import.`);

    for (const post of posts) {
      // 1. Extract necessary data
      const title = post.title.rendered;
      const slug = post.slug;
      const content = post.content.rendered;
      // strip html tags for excerpt
      const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, "");
      const publishedAt = post.date;

      // Try to get featured image
      let featuredImage = "";
      if (post._embedded && post._embedded["wp:featuredmedia"]) {
        const media = post._embedded["wp:featuredmedia"][0];
        if (media && media.source_url) {
          featuredImage = media.source_url;
        }
      }

      console.log(`Importing: ${title}`);

      // 2. Insert into Supabase
      const { error } = await supabase.from("articles").insert({
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        category_id: 1, // Defaulting to category 1 for now (General)
        status: "published",
        featured: false,
        breaking: false,
        published_at: publishedAt,
        author_name: "Staff", // Default author
        author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
      });

      if (error) {
        console.error(`Error inserting ${slug}:`, error.message);
      } else {
        console.log(`Successfully imported: ${slug}`);
      }
    }

    console.log("Import process finished!");

  } catch (err: any) {
    console.error("Migration failed:", err.message);
  }
}

main();
