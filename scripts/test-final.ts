import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getPublishedArticles } from "./src/lib/articles-service";

async function main() {
  console.log("Testing getPublishedArticles({ categorySlug: 'all' }) after fix...");
  try {
    const articles = await getPublishedArticles({ categorySlug: 'all' });
    console.log(`Result count: ${articles.length}`);
    if (articles.length > 0) {
      console.log(`First article: ${articles[0].title}`);
      console.log(`Categories: ${JSON.stringify(articles[0].categoryName)}`);
    } else {
      console.log("Still 0 articles. Something is wrong.");
    }
  } catch (err) {
    console.error("Error calling getPublishedArticles:", err);
  }
}

main();
