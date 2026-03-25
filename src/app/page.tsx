import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleCard from "@/components/public/ArticleCard";
import { getPublishedArticles } from "@/lib/articles-service";
import { getCategories } from "@/lib/categories-service";
import { getAds } from "@/lib/ads-service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Mail, ArrowRight } from "lucide-react";
import { AdPlaceholder } from "@/components/public/AdPlaceholder";
import CategoryDropdown from "@/components/public/CategoryDropdown";
import SectionHeader from "@/components/public/SectionHeader";

export const metadata: Metadata = {
  title: "Palawan Daily News - Palawan's Premier News Source",
  description: "Stay updated with the latest news from Palawan, Philippines. Breaking news, politics, business, sports, and more.",
};

export default async function HomePage() {
  const [published, allCategories, ads] = await Promise.all([
    getPublishedArticles(),
    getCategories(),
    getAds()
  ]);

  const featuredArticle = published[0];
  const latestArticles = published.slice(1, 5);
  const trendingArticles = published.slice(2, 7);
  const cityArticles = published.filter((a) => a.categorySlug === "city-news");
  const provincialArticles = published.filter((a) => a.categorySlug === "provincial-news");
  const regionalArticles = published.filter((a) => a.categorySlug === "regional-news");
  const nationalArticles = published.filter((a) => a.categorySlug === "national");
  const youthArticles = published.filter((a) => a.categorySlug === "youth-campus");
  const internationalArticles = published.filter((a) => a.categorySlug === "international");
  const editorialArticles = published.filter((a) => a.categorySlug === "editorial");
  const opinionArticles = published.filter((a) => a.categorySlug === "opinion");

  const techArticles = published.filter((a) => a.categorySlug === "technology");
  const businessArticles = published.filter((a) => a.categorySlug === "business");
  const sportsArticles = published.filter((a) => a.categorySlug === "sports");
  const envArticles = published.filter((a) => a.categorySlug === "environment");

  const billboardAd = ads.find(ad => ad.id === "home-billboard");
  const leaderboardAd = ads.find(ad => ad.id === "home-leaderboard");

  return (
    <>
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        {/* Category Browser - Top Bar */}
        <section className="mb-8 p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="font-playfair font-bold text-sm uppercase tracking-wider text-gray-900 whitespace-nowrap">
              Explore Topics
            </h3>
          </div>
          <div className="w-full sm:w-80">
            <CategoryDropdown categories={allCategories} />
          </div>
        </section>

        {/* Hero Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured article */}
            <div className="lg:col-span-2">
              <ArticleCard article={featuredArticle} variant="featured" />
            </div>
            {/* Side articles */}
            <div className="flex flex-col gap-4">
              <h3 className="font-playfair font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-600" />
                Latest News
              </h3>
              {latestArticles.map((article) => (
                <div key={article.id}>
                  <ArticleCard article={article} variant="horizontal" />
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Category News - Row 1 (4 Categories) */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* City News */}
            <div className="flex flex-col">
              <SectionHeader title="City News" color="emerald" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={cityArticles[0] || published[0]} />
                <div className="space-y-4">
                  {cityArticles[1] && <ArticleCard article={cityArticles[1]} variant="horizontal" />}
                  {cityArticles[2] && <ArticleCard article={cityArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>

            {/* Provincial News */}
            <div className="flex flex-col">
              <SectionHeader title="Provincial News" color="blue" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={provincialArticles[0] || published[1]} />
                <div className="space-y-4">
                  {provincialArticles[1] && <ArticleCard article={provincialArticles[1]} variant="horizontal" />}
                  {provincialArticles[2] && <ArticleCard article={provincialArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>

            {/* Regional News */}
            <div className="flex flex-col">
              <SectionHeader title="Regional News" color="orange" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={regionalArticles[0] || published[2]} />
                <div className="space-y-4">
                  {regionalArticles[1] && <ArticleCard article={regionalArticles[1]} variant="horizontal" />}
                  {regionalArticles[2] && <ArticleCard article={regionalArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>

            {/* National News */}
            <div className="flex flex-col">
              <SectionHeader title="National News" color="slate" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={nationalArticles[0] || published[3]} />
                <div className="space-y-4">
                  {nationalArticles[1] && <ArticleCard article={nationalArticles[1]} variant="horizontal" />}
                  {nationalArticles[2] && <ArticleCard article={nationalArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category News - Row 2 (4 Categories) */}
        <section className="mb-12 border-t border-gray-100 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* International News */}
            <div className="flex flex-col">
              <SectionHeader title="International News" color="sky" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={internationalArticles[0] || published[4]} />
                <div className="space-y-4">
                  {internationalArticles[1] && <ArticleCard article={internationalArticles[1]} variant="horizontal" />}
                  {internationalArticles[2] && <ArticleCard article={internationalArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>

            {/* Youth & Campus */}
            <div className="flex flex-col">
              <SectionHeader title="Youth & Campus" color="pink" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={youthArticles[0] || published[5]} />
                <div className="space-y-4">
                  {youthArticles[1] && <ArticleCard article={youthArticles[1]} variant="horizontal" />}
                  {youthArticles[2] && <ArticleCard article={youthArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>

            {/* Editorial */}
            <div className="flex flex-col">
              <SectionHeader title="Editorial" color="indigo" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={editorialArticles[0] || published[6]} />
                <div className="space-y-4">
                  {editorialArticles[1] && <ArticleCard article={editorialArticles[1]} variant="horizontal" />}
                  {editorialArticles[2] && <ArticleCard article={editorialArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>

            {/* Opinion */}
            <div className="flex flex-col">
              <SectionHeader title="Opinion" color="red" />
              <div className="flex flex-col gap-6">
                <ArticleCard article={opinionArticles[0] || published[7]} />
                <div className="space-y-4">
                  {opinionArticles[1] && <ArticleCard article={opinionArticles[1]} variant="horizontal" />}
                  {opinionArticles[2] && <ArticleCard article={opinionArticles[2]} variant="horizontal" />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advertisement Section (Pre-Footer) */}
        <section className="mb-10 w-full">
          <AdPlaceholder ad={billboardAd} height="250px" />
        </section>

        {/* Main content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Latest articles grid */}
            <section>
              <SectionHeader title="Latest News" href="/category/all" color="red" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {published.slice(0, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {/* Technology */}
            {techArticles.length > 0 && (
              <section>
                <SectionHeader title="Technology" href="/category/technology" color="blue" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {techArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Business */}
            {businessArticles.length > 0 && (
              <section>
                <SectionHeader title="Business" href="/category/business" color="emerald" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {businessArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Sports & Environment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {sportsArticles.length > 0 && (
                <section>
                  <SectionHeader title="Sports" href="/category/sports" color="orange" />
                  {sportsArticles.slice(0, 1).map((a) => <ArticleCard key={a.id} article={a} />)}
                </section>
              )}
              {envArticles.length > 0 && (
                <section>
                  <SectionHeader title="Environment" href="/category/environment" color="green" />
                  {envArticles.slice(0, 1).map((a) => <ArticleCard key={a.id} article={a} />)}
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Trending */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-playfair font-bold text-sm uppercase tracking-wider text-gray-900 flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-red-600" />
                Trending Now
              </h3>
              {trendingArticles.map((article, idx) => (
                <div key={article.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group items-center min-h-[90px]">
                  <span className="font-playfair text-3xl font-black text-gray-200 leading-none shrink-0 w-10 text-left">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <Link href={`/news/${article.slug}`}>
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">{article.views.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="bg-red-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Newsletter</h3>
              </div>
              <p className="text-sm text-red-100 mb-4">
                Get the latest Palawan news delivered to your inbox every morning.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-white text-red-600 font-semibold text-sm rounded-md hover:bg-red-50 transition-colors"
                >
                  Subscribe Now
                </button>
              </form>
            </div>
          </aside>
        </div>

        {/* Advertisement Section (Bottom) */}
        <section className="mt-14 max-w-4xl mx-auto">
          <AdPlaceholder ad={leaderboardAd} height="400px" />
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] text-center mt-4">Advertisement</p>
        </section>

      </main>

      <Footer />
    </>
  );
}
