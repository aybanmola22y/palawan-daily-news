
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function checkYouth() {
  const { count: youthCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).ilike('title', '%youth%');
  const { count: campusCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).ilike('title', '%campus%');
  const { count: depedCount } = await supabase.from('articles').select('*', { count: 'exact', head: true }).ilike('title', '%DepEd%');
  
  console.log(`Youth: ${youthCount}, Campus: ${campusCount}, DepEd: ${depedCount}`);
}

checkYouth();
