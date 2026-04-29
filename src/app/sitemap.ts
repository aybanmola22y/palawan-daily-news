import type { MetadataRoute } from "next";
import { getPublishedArticleEntriesForSitemap } from "@/lib/articles-service";
import { getCategories } from "@/lib/categories-service";
import { getSiteUrl } from "@/lib/site-url";

/** Refresh sitemap periodically so new articles appear without redeploying. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const fallbackModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: fallbackModified,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: fallbackModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/about/contact-us`,
      lastModified: fallbackModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/about/ownership-and-funding`,
      lastModified: fallbackModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/search`,
      lastModified: fallbackModified,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base}/category/all`,
      lastModified: fallbackModified,
      changeFrequency: "hourly",
      priority: 0.85,
    },
  ];

  try {
    const [categories, articleEntries] = await Promise.all([
      getCategories(),
      getPublishedArticleEntriesForSitemap(),
    ]);

    const categoryUrls: MetadataRoute.Sitemap = categories
      .filter((c) => c.slug && c.slug !== "all")
      .map((c) => ({
        url: `${base}/category/${encodeURIComponent(c.slug)}`,
        lastModified: fallbackModified,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));

    const articleUrls: MetadataRoute.Sitemap = articleEntries.map((a) => ({
      url: `${base}/news/${encodeURIComponent(a.slug)}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    return [...staticPages, ...categoryUrls, ...articleUrls];
  } catch {
    return staticPages;
  }
}
