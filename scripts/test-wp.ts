async function main() {
  const res = await fetch("https://palawandailynews.com/wp-json/wp/v2/posts?per_page=1&_embed=true");
  const data = await res.json();
  const post = data[0];
  
  if (post.yoast_head) {
    console.log("Yoast Head found. Searching for author:");
    const match = post.yoast_head.match(/<meta name="author" content="([^"]+)"/);
    if (match) console.log("Author:", match[1]);
  }

  // Also check if there's any other place the author might be
  console.log("Embedded Author:", post._embedded?.author);
  console.log("Keys:", Object.keys(post));
  
  if (post.yoast_head_json && post.yoast_head_json.author) {
    console.log("Yoast Author:", post.yoast_head_json.author);
  }
}
main();
