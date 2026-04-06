import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function list() {
  const { data, error } = await supabase.from("articles").select("id, title, slug, author_name").order("id", { ascending: false });
  if (error) {
    console.error("Error fetching articles:", error);
    return;
  }
  
  console.log(`TOTAL ARTICLES: ${data.length}`);
  console.log("------------------------");
  data.forEach(a => {
    console.log(`[${a.id}] ${a.title} (Author: ${a.author_name})`);
  });
}

list();
