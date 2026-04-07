
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function checkTeams() {
  const { data: authors, error: authorsError } = await supabase.from('authors').select('id, name');
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, name');
  const { data: cats, error: catsError } = await supabase.from('categories').select('id, name');
  
  console.log('Authors in DB:', authors?.length || 0);
  console.log('Profiles in DB:', profiles?.length || 0);
  console.log('Categories in DB:', cats?.length || 0);
}
checkTeams();
