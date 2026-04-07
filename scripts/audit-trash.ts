import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Auditing trash_articles...");

  const { data, error, count } = await supabase
    .from("trash_articles")
    .select("id, title, status, deleted_at, author_name", { count: 'exact' })
    .order("deleted_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Total records in Trash: ${count}`);
  data.forEach((a, i) => {
    console.log(`${i+1}. [Deleted: ${a.deleted_at}] [Status: ${a.status}] ${a.title} (Author: ${a.author_name})`);
  });
}

main();
