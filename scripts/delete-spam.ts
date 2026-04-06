import { createClient } from "@supabase/supabase-js";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Spam slug patterns
const SPAM_PATTERNS = [
  /casino/i, /pokies/i, /roulette/i, /slot/i, /betting/i, /gambl/i,
  /bonus-code/i, /no-deposit/i, /free-spin/i, /mobilbet/i, /bitstarz/i,
  /jackpot/i, /wager/i, /bookie/i, /sportsbook/i
];

function isSpam(slug: string, title: string): boolean {
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(slug) || pattern.test(title)) return true;
  }
  return false;
}

async function deleteSpam() {
  console.log("Scanning Supabase for spam articles...");
  const PAGE_SIZE = 1000;
  let spamIds: number[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("articles")
      .select("id, slug, title")
      .range(from, from + PAGE_SIZE - 1);
    if (error) { console.error("Error:", error); break; }
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (isSpam(row.slug || "", row.title || "")) spamIds.push(row.id);
    }
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log(`Found ${spamIds.length} spam articles to delete.`);
  if (spamIds.length === 0) { console.log("Nothing to delete!"); return; }

  // Delete in batches of 100
  let deleted = 0;
  for (let i = 0; i < spamIds.length; i += 100) {
    const batch = spamIds.slice(i, i + 100);
    const { error } = await supabase.from("articles").delete().in("id", batch);
    if (error) console.error(`Batch delete failed:`, error.message);
    else { deleted += batch.length; process.stdout.write(`\r🗑️  Deleted ${deleted}/${spamIds.length}...`); }
  }

  console.log(`\n✅ Deleted ${deleted} spam articles.`);
}

deleteSpam().catch(console.error);
