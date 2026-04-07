import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [key, ...val] = line.split("=");
  if (key && val.length > 0) env[key.trim()] = val.join("=").trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function inspect() {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("title, category_id, categories(name, slug), published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);
  
  console.log("Newest 20 Published Articles:", articles?.map(a => ({
    title: a.title,
    category: a.categories?.slug,
    date: a.published_at
  })));
}

inspect();
