import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking published articles...");

  const { count, error } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Total published articles: ${count}`);

  // Check if they have categories
  const { data: samples, error: sampleError } = await supabase
    .from("articles")
    .select("id, title, category_id, categories(name, slug)")
    .eq("status", "published")
    .limit(10);

  if (sampleError) {
    console.error(sampleError);
    return;
  }

  console.log("Sample published articles:");
  samples.forEach(a => {
    console.log(`- [ID:${a.id}] ${a.title} | Category: ${a.categories ? (a.categories as any).slug : 'NULL (id: ' + a.category_id + ')'}`);
  });
}

main();
