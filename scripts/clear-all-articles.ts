import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function clearAllArticles() {
  console.log("🔍 Checking current article count...");
  const { count, error: countError } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("❌ Error counting articles:", countError);
    process.exit(1);
  }

  console.log(`⚠️  Found ${count} articles in Supabase. Deleting all...`);

  // Delete all articles — Supabase requires a WHERE clause, use neq on id workaround
  const { error } = await supabase
    .from("articles")
    .delete()
    .neq("id", 0); // deletes everything since all IDs are > 0

  if (error) {
    console.error("❌ Error deleting articles:", error);
    process.exit(1);
  }

  console.log(`✅ Successfully deleted all ${count} articles from Supabase!`);
  console.log("🚀 Database is now clean and ready for the full CSV import.");
}

clearAllArticles().catch(console.error);
