
import fs from 'fs';
import path from 'path';

const scriptsDir = 'd:/pdn/palawan-daily-news/scripts';
const files = fs.readdirSync(scriptsDir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(scriptsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('createClient(supabaseUrl, supabaseKey)')) {
      console.log(`Fixing ${file}...`);
      content = content.replace('createClient(supabaseUrl, supabaseKey)', 'createClient(supabaseUrl!, supabaseKey!)');
      fs.writeFileSync(filePath, content);
    }
  }
});
