import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleCard from "@/components/public/ArticleCard";
import { getPublishedArticles, searchArticles } from "@/lib/articles-service";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search",
  description: "Search Palawan Daily News",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchArticles(query, 100) : [];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <form method="get" action="/search">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search for news, topics, categories..."
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {q ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {results.length > 0 ? (
                  <>Found <span className="text-red-600">{results.length}</span> results for &quot;{q}&quot;</>
                ) : (
                  <>No results found for &quot;{q}&quot;</>
                )}
              </h2>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">Try different keywords or browse by category.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Enter a search term to find articles</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
