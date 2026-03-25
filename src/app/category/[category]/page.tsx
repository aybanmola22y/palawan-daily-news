import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleCard from "@/components/public/ArticleCard";
import { getPublishedArticles } from "@/lib/articles-service";
import { getCategories } from "@/lib/categories-service";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const params = categories.map((c) => ({ category: c.slug }));
  params.push({ category: "all" });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (category === "all") {
    return {
      title: "Latest News - Palawan Daily News",
      description: "Stay updated with the latest news from Palawan, Philippines.",
    };
  }
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} News`,
    description: `Latest ${cat.name} news from Palawan Daily News`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const isAll = category === "all";
  const allCategories = await getCategories();
  const cat = isAll 
    ? { name: "Latest News", slug: "all", description: "All the latest stories from Palawan Daily News." }
    : allCategories.find((c) => c.slug === category);
  
  if (!cat) notFound();

  const published = await getPublishedArticles();
  const articles = isAll 
    ? published 
    : published.filter((a) => a.categorySlug === category);

  const colorMap: Record<string, string> = {
    technology: "bg-blue-600",
    business: "bg-green-600",
    politics: "bg-red-600",
    sports: "bg-orange-500",
    environment: "bg-emerald-600",
    tourism: "bg-purple-600",
    national: "bg-indigo-600",
    "youth-campus": "bg-pink-600",
    advertise: "bg-gray-600",
    opinion: "bg-red-700",
    "legal-section": "bg-slate-700",
    lifestyle: "bg-pink-500",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`mt-1 h-11 w-1.5 rounded-full ${colorMap[category] || "bg-red-600"}`} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  {["advertise", "legal", "all"].includes(category) ? "Section" : "Category"}
                </p>
                <h1 className="font-playfair text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                  {cat.name}
                </h1>
                {cat.description && (
                  <p className="text-gray-600 mt-2 max-w-2xl leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <span className="text-xs font-semibold text-gray-700">
                  {articles.length}
                </span>
                <span className="text-xs text-gray-500">
                  {articles.length === 1 ? "article" : "articles"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-linear-to-b from-gray-50 to-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Home
              </Link>
              <span className="text-xs text-gray-300">/</span>
              <span className="text-xs font-semibold text-gray-800">
                {cat.name}
              </span>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {articles[0] && (
              <div className="mb-8">
                <ArticleCard article={articles[0]} variant="featured" />
              </div>
            )}

            {/* Grid */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
