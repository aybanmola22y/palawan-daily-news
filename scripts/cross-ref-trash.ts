import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const titlesToCheck = [
    "PCSD, nilinaw ang umano’y pamumutol ng kahoy para sa motocross event sa El Nido",
    "Faulty electrical wiring, nangungunang sanhi pa rin ng sunog ayon sa BFP",
    "Puerto Princesa City Water District, siniguro ang kalinisan ng tubig na sinusuplay sa mga konsyumer",
    "Philippine aircraft challenged as Chinese forces swarm disputed shoal",
    "Sama All Charity Fun Run launches with special category for persons with disabilities"
  ];

  console.log("Cross-referencing trash with live articles...");

  for (const title of titlesToCheck) {
    const { data: live, error: liveError } = await supabase
      .from("articles")
      .select("id")
      .ilike("title", title)
      .limit(1);

    const { data: trash, error: trashError } = await supabase
      .from("trash_articles")
      .select("id")
      .ilike("title", title);

    console.log(`- Title: "${title}"`);
    console.log(`  Live:  ${live && live.length > 0 ? "EXISTS" : "MISSING"}`);
    console.log(`  Trash: ${trash ? trash.length : 0} entries`);
  }
}

main();
