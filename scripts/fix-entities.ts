import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import he from "he";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEntities() {
  console.log("Fetching all articles in pages...");
  
  const PAGE_SIZE = 1000;
  let allArticles: any[] = [];
  let from = 0;
  
  while (true) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, excerpt, seo_title, seo_description')
      .range(from, from + PAGE_SIZE - 1);
    
    if (error) {
      console.error("Error fetching articles:", error);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    allArticles = allArticles.concat(data);
    console.log(`  Fetched ${allArticles.length} articles so far...`);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log(`Found ${allArticles.length} total articles. Fixing entities...`);
  
  let updateCount = 0;
  for (const article of allArticles) {
    let needsUpdate = false;
    const updates: any = {};
    
    const fieldsToClean = ['title', 'excerpt', 'seo_title', 'seo_description'];
    for (const field of fieldsToClean) {
      if (article[field]) {
        const decoded = he.decode(article[field]);
        if (decoded !== article[field]) {
          updates[field] = decoded;
          needsUpdate = true;
        }
      }
    }
    
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', article.id);
        
      if (updateError) {
        console.error(`Failed to update article ${article.id}:`, updateError);
      } else {
        updateCount++;
        console.log(`Updated article ${article.id}: ${updates.title ? updates.title.substring(0, 30) + '...' : 'fields updated'}`);
      }
    }
  }
  
  console.log(`Finished! Updated ${updateCount} articles containing HTML entities.`);
}

fixEntities().catch(console.error);
