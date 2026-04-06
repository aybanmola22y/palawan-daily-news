import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function fixCategories() {
  console.log("Fetching categories from Supabase...");
  const { data: categories, error: catError } = await supabase.from("categories").select("id, name");
  if (catError) {
    console.error("Error fetching categories:", catError);
    return;
  }
  
  // Create a map from lowercase category name to category ID
  const catMap = new Map<string, number>();
  categories.forEach(c => catMap.set(c.name.toLowerCase().trim(), c.id));

  console.log(`Loaded ${categories.length} categories from Supabase.`);

  // We imported 50 articles from the old site, let's fetch them
  console.log("Fetching latest 50 posts from WordPress to map their categories...");
  const wpUrl = "https://palawandailynews.com/wp-json/wp/v2/posts?_embed=true&per_page=50";
  const wpRes = await fetch(wpUrl);
  const wpPosts = await wpRes.json();

  console.log(`Fetched ${wpPosts.length} posts from WP. Iterating...`);

  let updatedCount = 0;

  for (const post of wpPosts) {
    const slug = post.slug;
    
    // Find the category from WP
    let wpCategoryName = "";
    if (post._embedded && post._embedded["wp:term"] && post._embedded["wp:term"][0]) {
      // wp:term[0] is typically the categories array
      const terms = post._embedded["wp:term"][0];
      if (terms.length > 0) {
        wpCategoryName = terms[0].name; // Just take the primary category
      }
    }

    if (!wpCategoryName) continue; // Skip if no category found

    console.log(`WP Post "${slug}" belongs to WP Category "${wpCategoryName}".`);

    // Match WP category name to our DB category
    let newCategoryId = catMap.get(wpCategoryName.toLowerCase().trim());
    
    if (!newCategoryId) {
      // Try partial match
      const matchingCat = categories.find(c => wpCategoryName.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(wpCategoryName.toLowerCase()));
      if (matchingCat) {
        newCategoryId = matchingCat.id;
      }
    }

    if (newCategoryId) {
      // Update in Supabase
      const { error: updateError } = await supabase
        .from("articles")
        .update({ category_id: newCategoryId })
        .eq("slug", slug);

      if (updateError) {
        console.error(`Error updating article ${slug}:`, updateError.message);
      } else {
        console.log(`✔ Updated ${slug} to category_id ${newCategoryId}`);
        updatedCount++;
      }
    } else {
      console.warn(`! Could not find a matching local category for WP Category: "${wpCategoryName}"`);
    }
  }

  console.log(`\nCategory fix completed. Updated ${updatedCount} articles.`);
}

fixCategories();
