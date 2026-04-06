import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function fixAuthors() {
  console.log("Fetching latest 50 posts from WordPress to map their authors...");
  const wpUrl = "https://palawandailynews.com/wp-json/wp/v2/posts?_embed=true&per_page=50";
  const wpRes = await fetch(wpUrl);
  const wpPosts = await wpRes.json();

  console.log(`Fetched ${wpPosts.length} posts from WP. Syncing author data...`);

  let updatedCount = 0;

  for (const post of wpPosts) {
    const slug = post.slug;
    
    // Find the author from WP
    let wpAuthorName = "";
    let wpAuthorAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

    if (post.yoast_head_json && post.yoast_head_json.author) {
      wpAuthorName = post.yoast_head_json.author;
    } else if (post.yoast_head) {
      const match = post.yoast_head.match(/<meta name="author" content="([^"]+)"/);
      if (match) wpAuthorName = match[1];
    }
    
    // Let's try to match Avatar with one of our mock authors if they already have one
    const mockAvatars: Record<string, string> = {
      "Maria Santos": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      "Jose Reyes": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      "Ana Bautista": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      "Roberto Cruz": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      "Clara Mendoza": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      "Miguel Torres": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      "Liza Garcia": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      "Hanna Camella Talabucon": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
      // Add more if needed, but default is fine.
    };
    
    if (mockAvatars[wpAuthorName]) {
      wpAuthorAvatar = mockAvatars[wpAuthorName];
    }

    if (!wpAuthorName) continue;

    const { error: updateError } = await supabase
      .from("articles")
      .update({ 
        author_name: wpAuthorName,
        author_avatar: wpAuthorAvatar
      })
      .eq("slug", slug);

    if (updateError) {
      console.error(`Error updating article ${slug}:`, updateError.message);
    } else {
      console.log(`✔ Updated ${slug} author to "${wpAuthorName}"`);
      updatedCount++;
    }
  }

  console.log(`\nAuthor sync completed. Updated ${updatedCount} articles.`);
}

fixAuthors();
