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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing public access to ads table...");
  const { data, error } = await supabasePublic.from("ads").select("*");
  if (error) {
    console.error("Public Read Error:", error);
  } else {
    console.log("Public Read Data:", data);
  }
}

test();
