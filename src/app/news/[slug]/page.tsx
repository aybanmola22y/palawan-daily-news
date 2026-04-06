import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleCard from "@/components/public/ArticleCard";
import { getPublishedArticles, getArticleBySlug } from "@/lib/articles-service";
import { getAds } from "@/lib/ads-service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/utils/security";

import { Clock, Eye } from "lucide-react";
import { AdPlaceholder } from "@/components/public/AdPlaceholder";
import ShareButtons from "@/components/public/ShareButtons";
import AuthorHoverCard from "@/components/public/AuthorHoverCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.authorName],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const published = await getPublishedArticles();

  // Strictly same category for consistency
  const moreFromCategory = published
    .filter((a) => a.id !== article.id && a.categorySlug === article.categorySlug)
    .slice(0, 3);

  // If we don't have enough from the same category, maybe allow tag matches but prioritize category
  const related = moreFromCategory.length >= 3
    ? moreFromCategory
    : published
      .filter((a) =>
        a.id !== article.id &&
        (a.categorySlug === article.categorySlug || a.tags.some(tag => article.tags.includes(tag)))
      )
      .slice(0, 3);

  const ads = await getAds();
  const sidebarAd = ads.find((ad) => ad.id === "article-sidebar");

  const categoryColors: Record<string, "blue" | "green" | "red" | "orange" | "purple" | "emerald"> = {
    technology: "blue", business: "green", politics: "red",
    sports: "orange", environment: "emerald", tourism: "purple",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-red-600">Home</Link>
              <span>/</span>
              <Link href={`/category/${article.categorySlug}`} className="hover:text-red-600">
                {article.categoryName}
              </Link>
              <span>/</span>
              <span className="text-gray-700 truncate">{article.title.substring(0, 40)}...</span>
            </nav>

            {/* Category & Breaking */}
            <div className="flex items-center gap-2 mb-4">
              {article.breaking && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">BREAKING</span>
              )}
              <Badge variant={categoryColors[article.categorySlug] || "blue"}>
                {article.categoryName}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-6 font-light border-l-4 border-red-200 pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 py-4 border-t border-b border-gray-200">
              <div className="flex items-center gap-2">
                <AuthorHoverCard 
                  authorId={article.authorId}
                  authorName={article.authorName}
                  authorAvatar={article.authorAvatar}
                />
              </div>
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="relative w-full aspect-[1200/630] rounded-xl overflow-hidden mb-8 bg-gray-50 border border-gray-100">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Share buttons */}
            <ShareButtons title={article.title} />

            {/* Article content */}
            <div
              className="article-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-sm text-gray-600 rounded-full transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-4">Related Stories</h3>
              <div className="space-y-4">
                {related.map((a) => (
                  <div key={a.id}>
                    <ArticleCard article={a} variant="horizontal" />
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <AdPlaceholder
                ad={sidebarAd}
                height="600px"
                label="SIDEBAR ADVERTISEMENT SPACE"
                sublabel="Contact us at ads@palawandaily.com for rates"
              />
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] text-center mt-3">Advertisement</p>
            </div>

            <div className="bg-red-600 rounded-xl p-5 text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Newsletter</h3>
              <p className="text-sm text-red-100 mb-4">Get the latest news in your inbox.</p>
              <form className="space-y-2">
                <input type="email" placeholder="Email address" className="w-full px-3 py-2 rounded-md text-sm text-gray-900 focus:outline-none" />
                <button type="submit" className="w-full py-2 bg-white text-red-600 font-semibold text-sm rounded-md hover:bg-red-50 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>

        {/* More articles */}
        {moreFromCategory.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-red-600 pl-3 mb-6">
              More from {article.categoryName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {moreFromCategory.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
