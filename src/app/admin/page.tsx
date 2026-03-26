import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  FileText, Clock, CheckCircle, Calendar, Newspaper,
  TrendingUp, Eye, PlusCircle, AlertCircle, Users,
  Pencil, Check, X, ArrowRight, XCircle
} from "lucide-react";


import { getSession } from "@/lib/auth";
import { getArticlesForFrontend } from "@/lib/articles-service";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";


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
    .slice(0, 5);

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
                <Newspaper className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Articles</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.published}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.pendingReview}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.drafts}</div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.scheduled}</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{mockStats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>

          {/* Quick actions box */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/articles/new">
                  <PlusCircle className="h-4 w-4" />
                  New Story
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/categories">
                  <Users className="h-4 w-4" />
                  Categories
                </Link>
              </Button>
            </div>
          </div>

          {/* Recent articles table */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-semibold text-foreground">Recent Articles</h2>
              <Button variant="ghost" size="sm" asChild className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 font-bold gap-2 group transition-all">
                <Link href="/admin/articles">
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Article</th>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Views</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentArticles.map((article) => {
                    const isScheduledButLive = 
                      article.status === 'scheduled' && 
                      new Date(article.publishedAt) <= new Date();
                    
                    const displayStatus = isScheduledButLive ? 'published' : article.status;

                    return (
                      <tr key={article.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground text-sm max-w-xs line-clamp-1 group-hover:text-red-600 transition-colors">
                            {article.title}
                          </div>
                          <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {formatDate(article.publishedAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {article.categoryName}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "font-medium",
                              displayStatus === 'published' ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" :
                              displayStatus === 'scheduled' ? "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100" :
                              displayStatus === 'pending_review' ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100" :
                              "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            {displayStatus === 'published' ? 'Published' :
                             displayStatus === 'scheduled' ? 'Scheduled' :
                             displayStatus === 'pending_review' ? 'Pending Review' : 
                             displayStatus === 'draft' ? 'Draft' : displayStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {article.authorName}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {article.views?.toLocaleString() || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all">
                              <Link href={`/admin/articles/${article.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            {displayStatus === "pending_review" && (
                              <>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-all">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all">
                                  <XCircle className="h-4 w-4" />
                                </Button>
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
