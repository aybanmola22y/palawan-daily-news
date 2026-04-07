import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SPAM_KEYWORDS = [
  "casino", "baccarat", "bingo", "slot", "poker", "gambling", 
  "betting", "blackjack", "slot machine", "online bonus", 
  "cash collect", "real money", "free spins", "pokies", "roulette",
  "jackpot", "wagering", "deposit", "bonus code", "free bet"
];

async function main() {
  console.log("Searching for legitimate-looking news in trash_articles...");

  const { data, error } = await supabase
    .from("trash_articles")
    .select("id, title, status, deleted_at, author_name")
    .limit(1000); // Check a larger sample

  if (error) {
    console.error(error);
    return;
  }

  const legitimate = data.filter(a => {
    const t = (a.title || "").toLowerCase();
    return !SPAM_KEYWORDS.some(k => t.includes(k));
  });

  console.log(`Found ${legitimate.length} non-spam articles in the sample of ${data.length}.`);
  legitimate.slice(0, 50).forEach((a, i) => {
    console.log(`${i+1}. [Deleted: ${a.deleted_at}] ${a.title} (Author: ${a.author_name})`);
  });
}

main();
