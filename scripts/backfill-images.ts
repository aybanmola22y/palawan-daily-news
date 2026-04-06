import { createClient } from "@supabase/supabase-js";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import dotenv from "dotenv";
import { decodeHTML } from "entities";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function buildDecodedTitleMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  return new Promise<Map<string, string>>((resolve, reject) => {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    });
    createReadStream("data/pdn-data.csv").pipe(parser);
    parser.on("data", (row: Record<string, string>) => {
      const rawTitle = row["Title"] || "";
      const decodedTitle = decodeHTML(rawTitle).trim().toLowerCase();
      const img = (row["Featured Image"] || "").trim();
      if (decodedTitle && img) {
        map.set(decodedTitle, img);
      }
    });
    parser.on("end", () => resolve(map));
    parser.on("error", reject);
  });
}

async function finalBackfill() {
  console.log("📖 Reading CSV and DECODING titles with 'entities'...");
  const titleMap = await buildDecodedTitleMap();
  console.log(`✅ Map ready: ${titleMap.size} titles cached.`);

  console.log("🔍 Fetching target articles from Supabase...");
  // Using a paginated fetch to be safe
  const PAGE_SIZE = 1000;
  let missing: any[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from('articles').select('id, title').is('featured_image', null).range(from, from + PAGE_SIZE - 1);
    if (error) break;
    if (!data || data.length === 0) break;
    missing = missing.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log(`📋 Processing ${missing.length} articles...`);

  let updated = 0;
  for (const article of missing) {
    const searchTitle = article.title.trim().toLowerCase();
    const img = titleMap.get(searchTitle);
    
    if (img) {
      const { error: upErr } = await supabase
        .from("articles")
        .update({ featured_image: img })
        .eq("id", article.id);
      if (!upErr) updated++;
      if (updated % 50 === 0) process.stdout.write(`\r🖼️  Updated ${updated}...`);
    }
  }

  console.log(`\n✅ Done! Final updates: ${updated}`);
}

finalBackfill().catch(console.error);
