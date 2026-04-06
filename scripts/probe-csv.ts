import { createClient } from "@supabase/supabase-js";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function diagnose() {
  // Show a few CSV rows
  console.log("=== CSV Sample Slugs & Images ===");
  let csvCount = 0;
  await new Promise<void>((resolve, reject) => {
    const parser = parse({ columns: true, to: 10, relax_quotes: true, relax_column_count: true, skip_empty_lines: true });
    createReadStream("data/pdn-data.csv").pipe(parser);
    parser.on("data", (row: Record<string, string>) => {
      const slug = row["URL Slug"] || "";
      const img = row["Featured Image"] || "";
      const status = row["Status"] || "";
      if (img) csvCount++;
      console.log(`  slug="${slug.substring(0, 60)}" img="${img ? "YES" : "no"}" status=${status}`);
    });
    parser.on("end", resolve);
    parser.on("error", reject);
  });

  // Show a few Supabase slugs that have no image
  console.log("\n=== Supabase Missing Image Sample ===");
  const { data } = await supabase.from("articles").select("id, slug, featured_image").is("featured_image", null).limit(5);
  data?.forEach(a => console.log(`  id=${a.id} slug="${a.slug.substring(0,60)}"`));

  // Show a few Supabase slugs that HAVE image
  console.log("\n=== Supabase With Image Sample ===");
  const { data: data2 } = await supabase.from("articles").select("id, slug, featured_image").not("featured_image", "is", null).limit(5);
  data2?.forEach(a => console.log(`  id=${a.id} slug="${a.slug.substring(0,60)}" img="${a.featured_image?.substring(0,60)}"`));
}

diagnose().catch(console.error);
