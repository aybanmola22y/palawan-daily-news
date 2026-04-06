import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Deleting demo articles from Supabase...");

  // The demo articles have specific titles. I'll delete by titles of the demo mock data
  const demoSlugs = [
    "palawan-named-worlds-best-island-seventh-year",
    "underground-river-expansion-denr-approval",
    "tech-hub-puerto-princesa-five-thousand-jobs",
    "palawan-provincial-budget-2024-record-twelve-billion",
    "palawan-pawnshop-group-forty-percent-profit-surge-q4-2023",
    "palawan-panthers-pba-d-league-championship",
    "coron-bay-coral-reef-restoration-exceeds-targets",
    "el-nido-new-island-hopping-rules-marine-life",
    "psu-campus-journalism-bootcamp",
    "palace-backs-expanded-eco-tourism-program-palawan",
    "senior-high-students-community-podcast-san-pedro",
    "how-to-advertise-with-pdn",
    "importance-of-local-media-digital-age",
    "public-notice-coastal-zone-management-hearing",
    "5-hidden-gems-palawan-summer",
    "global-leaders-climate-action-summit-geneva",
    "quantum-computing-breakthrough-research",
    "importance-digital-literacy-palawan",
    "psu-students-national-robotics-win",
    "preserving-palawan-nature-editorial",
    "city-government-revitalize-baywalk",
    "new-district-hospital-southern-palawan",
    "mimaropa-unity-games-puerto-princesa",
    "doe-new-renewable-energy-policy",
    "global-economic-forecast-2024",
    "student-led-reforestation-ten-thousand-trees",
    "vital-role-transparency-local-governance",
    "why-community-gardening-matters",
    "palawan-zero-dengue-cases-q1-2024",
    "puerto-princesa-international-coastal-cleanup",
    "new-public-market-terminal-completion",
    "mimaropa-agriculture-summit-food-security",
    "regional-health-surge-summer",
    "pbbm-signs-infrastructure-growth-act",
    "digital-frontier-empowering-rural-palawan"
  ];

  const { data, error } = await supabase
    .from("articles")
    .delete()
    .in("slug", demoSlugs);

  if (error) {
    console.error("Error deleting demo articles:", error);
  } else {
    console.log("Successfully deleted dummy articles from Supabase.");
  }
}

main();
