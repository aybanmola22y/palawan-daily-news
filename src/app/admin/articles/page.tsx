import Link from "next/link";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getArticles } from "@/lib/articles-service";
import { PlusCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ArticlesTableClient from "@/components/admin/ArticlesTableClient";

// Protected by AdminLayout


export default async function ArticlesPage() {
  const user = await getSession();

  const raw = await getArticles(false, 500);
  const articles = raw.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.categoryName,
    status: a.status,
    author: a.authorName,
    date: formatDate(a.publishedAt),
    publishedAt: new Date(a.publishedAt),
    featured: a.featured,
    breaking: a.breaking,
  }));
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={user as any} />

      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Articles</h1>
            <p className="text-sm text-muted-foreground">Manage all news articles</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/articles/trash"
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Trash
            </Link>
            <Link
              href="/admin/articles/new"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              New Article
            </Link>
          </div>

        </div>

        <ArticlesTableClient articles={articles} />
      </main>
    </div>
  );
}
