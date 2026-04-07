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

const DEFAULT_BILLBOARD = "https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?w=1600&h=420&fit=crop";
const DEFAULT_HEADER = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=200&fit=crop";

async function restore() {
  console.log("Restoring default ad images to Supabase...");
  
  // Billboard
  const { error: error1 } = await supabaseAdmin.from("ads").update({
    image_url: DEFAULT_BILLBOARD,
    active: true
  }).eq("id", "home-billboard");
  
  // Header
  const { error: error2 } = await supabaseAdmin.from("ads").update({
    image_url: DEFAULT_HEADER,
    active: true
  }).eq("id", "home-header");
  
  if (error1 || error2) {
    console.error("Error restoring ads:", error1 || error2);
  } else {
    console.log("Successfully restored default ad images.");
  }
}

restore();
