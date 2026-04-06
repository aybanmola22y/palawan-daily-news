/**
 * Sanitizes HTML by stripping disallowed tags while preserving safe content.
 * This is a lightweight server-compatible alternative to DOMPurify.
 * No external dependencies — safe for Next.js server components.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "b", "i", "strong", "em", "u", "s", "span",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "cite", "code", "pre",
  "img", "a",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "section", "article",
]);

const ALLOWED_ATTRS = new Set([
  "href", "src", "alt", "title", "class", "id", "style",
  "target", "rel", "width", "height",
]);

function sanitizeAttrs(tag: string, attrs: string): string {
  // Strip javascript: and data: URIs from href/src
  const cleaned = attrs.replace(
    /(href|src)\s*=\s*["']?\s*(javascript:|data:)[^"'\s>]*/gi,
    ""
  );
  // Only keep allowed attributes
  return cleaned.replace(
    /(\w[\w-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/g,
    (match, attrName: string) => {
      return ALLOWED_ATTRS.has(attrName.toLowerCase()) ? match : "";
    }
  );
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // 1. Strip WordPress shortcodes (e.g., [caption]...[/caption], [id...])
  // We remove the brackets and attributes, but keep the content inside
  let safe = html
    .replace(/\[caption[^\]]*\]/gi, "")
    .replace(/\[\/caption\]/gi, "")
    .replace(/\[[a-z0-9_-]+[^\]]*\]/gi, "") // Generic shortcode stripper [anything]
    .replace(/\[\/[a-z0-9_-]+\]/gi, "");   // Generic shortcode closer [/anything]

  // 2. Fix fragmented lists. If every paragraph starts with "1. ", 
  // it's likely a WordPress export artifact where a list was broken up.
  // We'll leave this for now as it's safer than guessing, but we ensure basic sanitization.

  // 3. Strip script/style blocks entirely
  safe = safe
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 4. Process all tags
  safe = safe.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?\s*\/?>/g,
    (match, tagName: string, attrs: string = "") => {
      const lower = tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(lower)) return ""; // strip disallowed tags
      const isClosing = match.startsWith("</");
      if (isClosing) return `</${lower}>`;
      return `<${lower}${sanitizeAttrs(lower, attrs)}>`;
    }
  );

  return safe;
}
