import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking for duplicate titles in trash_articles...");

  const { data, error } = await supabase
    .from("trash_articles")
    .select("title")
    .limit(2000);

  if (error) {
    console.error(error);
    return;
  }

  const counts: Record<string, number> = {};
  data.forEach(a => {
    const title = (a.title || "").trim();
    counts[title] = (counts[title] || 0) + 1;
  });

  const duplicates = Object.entries(counts)
    .filter(([title, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  console.log(`Found ${duplicates.length} titles with multiple entries in the sample.`);
  duplicates.slice(0, 20).forEach(([title, count]) => {
    console.log(`- [${count} entries] ${title}`);
  });
}

main();
