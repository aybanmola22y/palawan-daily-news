import AdminSidebar from "@/components/admin/AdminSidebar";
import TrashTableClient from "@/components/admin/TrashTableClient";


import { getDeletedArticles } from "@/lib/articles-service";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

export default async function TrashPage() {
  const raw = await getDeletedArticles();
  const articles = raw.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.categoryName,
    author: a.authorName,
    deletedAt: a.deletedAt ? formatDate(a.deletedAt) : "Unknown",
  }));

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/articles"
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Trash</h1>
              <p className="text-sm text-muted-foreground">Manage deleted news articles</p>
            </div>
          </div>
        </div>

        <TrashTableClient initialArticles={articles} />
      </main>
    </div>
  );
}
