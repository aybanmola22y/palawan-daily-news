
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Mappings = [
  { pattern: '%[EDITORIAL]%', targetSlug: 'editorial' },
  { pattern: '%[COLUMN]%', targetSlug: 'column' },
  { pattern: '%[OPINION]%', targetSlug: 'opinion' },
  { pattern: '%national%', targetSlug: 'national' },
  { pattern: '%international%', targetSlug: 'international' }
];

async function fixCategorization() {
  const { data: categories } = await supabase.from('categories').select('id, name, slug');
  const catMap = categories?.reduce((acc: any, curr: any) => {
    acc[curr.slug] = curr.id;
    return acc;
  }, {});

  for (const mapping of Mappings) {
    const targetId = catMap[mapping.targetSlug];
    if (!targetId) continue;

    const { data: matches } = await supabase
      .from('articles')
      .select('id, title, category_id')
      .ilike('title', mapping.pattern)
      .neq('category_id', targetId);

    if (matches && matches.length > 0) {
      console.log(`Found ${matches.length} articles matching "${mapping.pattern}" that are NOT in ${mapping.targetSlug}`);
      // Preview first 2
      matches.slice(0, 2).forEach(m => console.log(` - ${m.title} (current cat: ${m.category_id})`));
      
      // Perform the update
      const { count, error } = await supabase
        .from('articles')
        .update({ category_id: targetId })
        .ilike('title', mapping.pattern);
        
      if (error) {
        console.error(`Error updating for ${mapping.targetSlug}:`, error);
      } else {
        console.log(`Successfully moved matching articles to ${mapping.targetSlug}`);
      }
    } else {
       console.log(`No miscategorized articles found for ${mapping.pattern}`);
    }
  }
}

fixCategorization();
