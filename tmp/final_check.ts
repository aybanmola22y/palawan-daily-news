
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
async function check() {
  const { count: international } = await supabase.from('articles').select('*', { count: 'exact', head: true }).eq('category_id', '20'); // International ID from previous log
  const { count: editorial } = await supabase.from('articles').select('*', { count: 'exact', head: true }).eq('category_id', '14'); // Editorial ID 
  console.log(`International: ${international}, Editorial: ${editorial}`);
}
check();
