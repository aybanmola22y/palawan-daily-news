import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes an HTML string to prevent XSS attacks while preserving
 * safe formatting tags like p, h1-h6, b, i, img, a, etc.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "strong", "em", "u", "s", "span",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "blockquote", "cite", "code", "pre",
      "img", "a",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "section", "article"
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "id", "style",
      "target", "rel", "width", "height"
    ],
  });
}
