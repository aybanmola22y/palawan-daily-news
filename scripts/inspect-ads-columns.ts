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
  const { data: first } = await supabaseAdmin.from("ads").select("*").limit(1).single();
  console.log("Ads Columns:", Object.keys(first || {}));
}

inspect();
