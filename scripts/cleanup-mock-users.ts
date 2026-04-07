import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Manually load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [key, ...val] = line.split("=");
  if (key && val.length > 0) env[key.trim()] = val.join("=").trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

const mockNames = [
  "Kent Janaban", "Harthwell Capistrano", "Clarina Herrera Guludah", 
  "Rexcel John Sorza", "Atty. Analisa Navarro - Padon", "Sevedeo Borda III", 
  "Hanna Camella Talabucon", "Gerardo Reyes Jr.", "John Castor Viernes", 
  "Maria Santos", "Mechael Glen Dagot", "Carlos dela Cruz", 
  "Ana Bautista", "Roberto Cruz", "Liza Garcia", 
  "Miguel Torres", "Sofia Reyes", "Jose Reyes", "Staff Reporter"
];

async function cleanup() {
  console.log("Starting cleanup of mock users from database...");
  
  for (const name of mockNames) {
    const { error: authorError } = await supabaseAdmin.from("authors").delete().eq("name", name);
    const { error: profileError } = await supabaseAdmin.from("profiles").delete().eq("name", name);
    
    if (authorError) console.error(`Error deleting author ${name}:`, authorError);
    else if (profileError) console.error(`Error deleting profile ${name}:`, profileError);
    else console.log(`Processed: ${name}`);
  }
  
  console.log("Cleanup complete.");
}

cleanup();
