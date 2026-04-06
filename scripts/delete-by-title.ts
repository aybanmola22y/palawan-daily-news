import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function clean() {
  const { data: allArticles } = await supabase.from("articles").select("id, title");
  
  const demoTitles = [
    "Palawan Named World's Best Island for the 7th Consecutive Year",
    "Underground River Expansion Project Gets Green Light from DENR",
    "New Tech Hub to Open in Puerto Princesa, Creating 5,000 Jobs",
    "Palawan Provincial Budget for 2024 Hits Record PHP 12 Billion",
    "Palawan Pawnshop Group Posts 40% Profit Surge in Q4 2023",
    "Palawan Panthers Win PBA D-League Championship",
    "Coron Bay Coral Reef Restoration Project Exceeds Targets",
    "El Nido Launches New Island-Hopping Rules to Protect Marine Life",
    "Palawan State University Launches Campus Journalism Bootcamp",
    "Malacañang Backs Expanded Eco-Tourism Program for Palawan",
    "Senior High Students Launch Community Podcast in Barangay San Pedro",
    "How to Advertise with Palawan Daily News",
    "The Importance of Local Media in the Digital Age",
    "Public Notice: Upcoming Coastal Zone Management Hearing",
    "5 Hidden Gems to Visit in Palawan This Summer",
    "Global Leaders Converge for Climate Action Summit in Geneva",
    "Major Breakthrough in Quantum Computing Research Announced",
    "The Importance of Digital Literacy in Modern Palawan",
    "Palawan State University Students Win National Robotics Competition",
    "Preserving Palawan's Natural Beauty for the Next Generation",
    "City Government to Revitalize Puerto Princesa Baywalk",
    "New District Hospital Opens in Southern Palawan",
    "MIMAROPA Unity Games Set to Kick Off in Puerto Princesa",
    "Department of Energy Unveils New Renewable Energy Policy",
    "Global Economic Forecast Predicts Moderate Growth in 2024",
    "Student-Led Reforestation Project Plants 10,000 Trees",
    "The Vital Role of Transparency in Local Governance",
    "Why Community Gardening is the Future of Urban Sustainability",
    "Palawan Records Zero New Dengue Cases in Q1 2024",
    "Puerto Princesa City to Host International Coastal Clean-up 2024",
    "New Public Market Terminal Set for Completion in June",
    "MIMAROPA Agriculture Summit Focuses on Food Security",
    "Regional Health Offices Braced for Summer Disease Surge",
    "PBBM Signs New Infrastructure Growth Act",
    "The Digital Frontier: Empowering Rural Palawan"
  ];

  const toDelete = allArticles?.filter(a => demoTitles.includes(a.title)) || [];
  
  if (toDelete.length > 0) {
    console.log(`Found ${toDelete.length} leftover dummy articles by exact title matches.`);
    const ids = toDelete.map(a => a.id);
    const { error } = await supabase.from("articles").delete().in("id", ids);
    if (error) console.error(error);
    else console.log("Deleted leftover dummy articles!");
  } else {
    // If not found by exact title, maybe they are prefixed, or we can just delete IDs <= 35
    console.log("No exact title matches found for dummy articles. Deleting any article with ID <= 40 just to be sure.");
    const { error } = await supabase.from("articles").delete().lte("id", 40);
    if (!error) console.log("Cleaned up IDs <= 40.");
  }
}

clean();
