"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle, Clock, Eye, Pencil, Search, Trash2, XCircle } from "lucide-react";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: string;
  author: string;
  date: string;
  publishedAt: Date;
  views: number;
  featured: boolean;
  breaking: boolean;
};

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", icon: <Clock className="h-3 w-3" /> },
  pending_review: { label: "Pending Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Clock className="h-3 w-3" /> },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <CheckCircle className="h-3 w-3" /> },
  scheduled: { label: "Scheduled", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: <Calendar className="h-3 w-3" /> },
  published: { label: "Published", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="h-3 w-3" /> },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground", icon: <Clock className="h-3 w-3" /> },
};

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

export default function ArticlesTableClient({ articles }: { articles: ArticleRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [month, setMonth] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) if (a.category) set.add(a.category);
    return ["", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [articles]);

  const authorOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) if (a.author) set.add(a.author);
    return ["", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [articles]);

  const monthOptions = useMemo(() => {
    const months = new Map<string, string>(); // value -> label

    // Always include current month
    const now = new Date();
    const nowV = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const nowL = now.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
    months.set(nowV, nowL);

    articles.forEach((a) => {
      const d = new Date(a.publishedAt);
      const m = d.getMonth();
      const y = d.getFullYear();
      const value = `${y}-${String(m + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
      if (!months.has(value)) {
        months.set(value, label);
      }
    });

    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0])) // Sort descending (most recent first)
      .map(([value, label]) => ({ value, label }));
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = articles.filter((a) => {
      if (status && a.status !== status) return false;
      if (category && a.category !== category) return false;
      if (author && a.author !== author) return false;
      if (month) {
        const d = new Date(a.publishedAt);
        const m = d.getMonth();
        const y = d.getFullYear();
        const val = `${y}-${String(m + 1).padStart(2, "0")}`;
        if (val !== month) return false;
      }
      if (q) {
        const regex = new RegExp(`\\b${q}\\b`, "i");
        const hay = `${a.title} ${a.slug} ${a.category} ${a.author}`;
        if (!regex.test(hay)) return false;
      }
      return true;
    });
    // Reset to page 1 when filters change
    setCurrentPage(1);
    return result;
  }, [articles, query, status, category, author, month]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <div className="p-8">
      {/* Filters */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-foreground"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {statusOptions.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Categories</option>
            {categoryOptions
              .filter((c) => c !== "")
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Authors</option>
            {authorOptions
              .filter((a) => a !== "")
              .map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            <option value="">All Months</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stats</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    {filtered.length > 0 ? "No articles on this page." : "No articles match your filters."}
                  </td>
                </tr>
              ) : (
                paginatedArticles.map((article) => {
                  const isScheduledButLive = 
                    article.status === 'scheduled' && 
                    new Date(article.publishedAt) <= new Date();
                  
                  const displayStatus = isScheduledButLive ? 'published' : article.status;
                  
                  const statusMeta = statusConfig[displayStatus] ?? {
                    label: displayStatus,
                    className: "bg-muted text-muted-foreground",
                    icon: <Clock className="h-3 w-3" />,
                  };

                  return (
                    <tr key={article.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground text-sm max-w-xs line-clamp-1 group-hover:text-red-600 transition-colors">
                          {article.title}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {article.featured && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Featured</span>
                          )}
                          {article.breaking && (
                            <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">Breaking</span>
                          )}
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-semibold">
                            <Calendar className="h-3 w-3" /> {article.date}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{article.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.className}`}>
                          {statusMeta.icon}
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{article.author}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Eye className="h-4 w-4" /> {article.views?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/news/${article.slug}`} className="p-1.5 text-muted-foreground hover:text-blue-500 hover:bg-muted rounded-lg transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link href={`/admin/articles/${article.id}`} className="p-1.5 text-muted-foreground hover:text-green-500 hover:bg-muted rounded-lg transition-colors" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeleteArticleButton id={article.id} title={article.title} slug={article.slug} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, filtered.length)}</span> of <span className="font-medium text-foreground">{filtered.length}</span> articles
          </p>
          
          {totalPages > 1 && (
            <nav className="flex items-center gap-1 shadow-sm rounded-lg p-1 bg-muted/20 border border-border/50">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-background hover:text-red-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-all"
              >
                Previous
              </button>
              
              <div className="flex items-center px-2">
                <span className="text-xs font-semibold text-foreground bg-background px-3 py-1 rounded shadow-sm border border-border min-w-8 text-center tabular-nums">
                  {currentPage}
                </span>
                <span className="mx-2 text-xs text-muted-foreground">of</span>
                <span className="text-xs font-medium text-muted-foreground min-w-8 text-center tabular-nums">
                  {totalPages}
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-background hover:text-red-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-all"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
