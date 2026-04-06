import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function check() {
  const { data, error } = await supabase.from("articles").select("id, title");
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log(`Actual number of rows in Supabase: ${data.length}`);
  
  const ids = data.map(r => r.id);
  const maxId = Math.max(...ids);
  const minId = Math.min(...ids);
  
  console.log(`Lowest ID: ${minId}`);
  console.log(`Highest ID: ${maxId}`);
  
  // Check for duplicates
  const titles = data.map(r => r.title);
  const uniqueTitles = new Set(titles);
  console.log(`Unique titles: ${uniqueTitles.size}`);
  
  if (titles.length !== uniqueTitles.size) {
    console.log("There are duplicate titles!");
  }
}

check();
