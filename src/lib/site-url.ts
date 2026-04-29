/**
 * Canonical site origin for sitemap, robots, and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://palawandailynews.ph).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "https://palawandailynews.ph";
}
