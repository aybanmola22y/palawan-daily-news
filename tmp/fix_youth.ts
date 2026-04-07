
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function fixYouth() {
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'youth-campus').single();
  if (!cat) return;

  const { data: matches } = await supabase
    .from('articles')
    .select('id')
    .or(`title.ilike.%youth%,title.ilike.%campus%,title.ilike.%DepEd%`);

  if (!matches || matches.length === 0) {
    console.log('No matches found');
    return;
  }

  console.log(`Updating ${matches.length} articles...`);
  const ids = matches.map(m => m.id);
  
  // Batch updates of 100
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const { error } = await supabase
      .from('articles')
      .update({ category_id: cat.id })
      .in('id', chunk);
    if (error) console.error('Error updating chunk:', error);
  }
  console.log('Update complete');
}

fixYouth();
