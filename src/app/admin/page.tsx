import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  FileText, Clock, CheckCircle, Calendar, Newspaper,
  TrendingUp, Eye, PlusCircle, AlertCircle, Users,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getArticlesForFrontend } from "@/lib/articles-service";
import { formatDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  pending_review: { label: "Pending Review", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-700" },
  scheduled: { label: "Scheduled", className: "bg-purple-100 text-purple-700" },
  published: { label: "Published", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  archived: { label: "Archived", className: "bg-gray-100 text-gray-500" },
};

import { mockOrgChartEmployees } from "@/lib/mock-data";

export default async function AdminDashboard() {
  let user = null;
  try {
    user = await getSession();
  } catch {
    // DB not ready, use demo mode
  }

  if (user === undefined) {
    redirect("/admin/login");
  }

  const demoUser = user || { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

  const allArticles = await getArticlesForFrontend();
  const mockStats = {
    total: allArticles.length,
    drafts: allArticles.filter((a) => a.status === "draft").length,
    pendingReview: allArticles.filter((a) => a.status === "pending_review").length,
    scheduled: allArticles.filter((a) => a.status === "scheduled").length,
    published: allArticles.filter((a) => a.status === "published").length,
    rejected: allArticles.filter((a) => a.status === "rejected").length,
    archived: allArticles.filter((a) => a.status === "archived").length,
  };
  const recentArticles = allArticles
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.categoryName,
      status: a.status,
      author: a.authorName,
      date: formatDate(a.publishedAt),
      views: a.views,
    }));

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={demoUser as { name: string; email: string; role: string }} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {demoUser.name}</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Article
          </Link>
        </div>

        <div className="p-8">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Newspaper className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Articles</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.published}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.pendingReview}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.drafts}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.scheduled}</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">48.2K</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{mockOrgChartEmployees.length}</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/articles/new" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <PlusCircle className="h-4 w-4" /> New Article
              </Link>
              <Link href="/admin/articles?status=pending_review" className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-200 transition-colors">
                <AlertCircle className="h-4 w-4" /> Review Pending ({mockStats.pendingReview})
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                <Newspaper className="h-4 w-4" /> Manage Categories
              </Link>
            </div>
          </div>

          {/* Recent articles table */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-semibold text-foreground">Recent Articles</h2>
              <Link href="/admin/articles" className="text-sm text-red-600 hover:underline">
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Article</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Author</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Views</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentArticles.map((article) => {
                    const status = statusConfig[article.status];
                    return (
                      <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground text-sm line-clamp-1 max-w-xs">{article.title}</div>
                          <div className="text-xs text-muted-foreground">{article.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{article.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{article.author}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {article.views > 0 ? article.views.toLocaleString() : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/articles/${article.id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</Link>
                            {article.status === "pending_review" && (
                              <>
                                <button className="text-xs text-green-600 dark:text-green-400 hover:underline">Approve</button>
                                <button className="text-xs text-red-600 dark:text-red-400 hover:underline">Reject</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
