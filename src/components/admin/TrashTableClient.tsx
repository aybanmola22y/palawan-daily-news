"use client";

import { useState } from "react";
import { 
  RotateCcw, 
  Trash2, 
  Search,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"; // Using relative path

interface DeletedArticle {
  id: number | string;
  title: string;
  category: string;
  author: string;
  deletedAt: string;
}

export default function TrashTableClient({ initialArticles }: { initialArticles: DeletedArticle[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const filteredArticles = articles.filter(a => {
    if (!search) return true;
    const regex = new RegExp(`\\b${search}\\b`, "i");
    return (
      regex.test(a.title) ||
      regex.test(a.author)
    );
  });


  const handleRestore = async (id: number | string) => {
    try {
      const res = await fetch(`/api/articles/${id}/restore`, { method: "POST" });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
        toast.success("Article restored successfully");
      } else {
        toast.error("Failed to restore article");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handlePermanentDelete = async (id: number | string) => {
    try {
      const res = await fetch(`/api/articles/${id}?permanent=true`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
        toast.success("Article permanently deleted");
      } else {
        toast.error("Failed to delete article");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-8">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden text-foreground">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deleted articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all text-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-sm font-semibold text-foreground border-b border-border">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground border-b border-border">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground border-b border-border">Author</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground border-b border-border">Deleted On</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                       <Trash2 className="h-8 w-8 opacity-20" />
                       <p>No deleted articles found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{article.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{article.category}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{article.author}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{article.deletedAt}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(article.id)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>

                        <AlertDialog onOpenChange={(v) => { if (!v) setConfirmText(""); }}>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                              title="Delete Permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-xs font-semibold">Delete Forever</span>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl bg-card">
                            <div className="px-6 py-5 bg-linear-to-b from-red-50 to-white dark:from-red-950/20 dark:to-card border-b border-red-100 dark:border-red-900/30">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-start gap-4 text-foreground">
                                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 shadow-inner">
                                    <AlertCircle className="h-6 w-6" />
                                  </span>
                                  <span className="flex-1 text-left">
                                    <span className="block text-xl font-bold leading-tight text-red-900 dark:text-red-400">Delete Permanently?</span>
                                    <span className="block text-sm text-muted-foreground mt-1 font-medium">
                                      This action is irreversible. The article will be lost forever.
                                    </span>
                                  </span>
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                            </div>

                            <div className="px-6 py-6 space-y-6 bg-card">
                              <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/40 dark:bg-red-900/10 p-5 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 dark:text-red-400/80 mb-3">Permanent Removal Target</p>
                                <p className="text-lg font-bold text-foreground leading-tight">{article.title}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center rounded-lg bg-background border border-red-100 dark:border-red-900/30 px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-400 shadow-sm">
                                     {article.category}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-background border border-red-100 dark:border-red-900/30 px-3 py-1.5 text-xs font-mono text-muted-foreground shadow-sm">
                                     ID: {article.id}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    Confirm Title
                                  </label>
                                  <span className="text-[11px] text-red-500 dark:text-red-400 font-medium italic">Required to proceed</span>
                                </div>
                                <input
                                  type="text"
                                  value={confirmText}
                                  onChange={(e) => setConfirmText(e.target.value)}
                                  placeholder={article.title}
                                  className="w-full px-4 py-4 bg-muted border border-border rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-background transition-all text-foreground shadow-inner placeholder:opacity-30"
                                  autoFocus
                                />
                                <p className="text-[11px] text-muted-foreground font-medium text-left">
                                  Validation is case-sensitive. Please copy exactly: <span className="text-foreground font-bold">"{article.title}"</span>
                                </p>
                              </div>
                            </div>

                            <div className="px-6 py-5 bg-muted/50 border-t border-border flex flex-col sm:flex-row gap-3">
                              <AlertDialogFooter className="w-full sm:space-x-3">
                                <AlertDialogCancel className="w-full sm:w-32 h-12 rounded-xl border-border bg-background font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handlePermanentDelete(article.id)}
                                  disabled={confirmText !== article.title}
                                  className="w-full sm:flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider disabled:opacity-30 shadow-lg shadow-red-200/50 dark:shadow-red-900/50 active:scale-[0.98] transition-all"
                                >
                                  Delete Forever
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </div>
                          </AlertDialogContent>

                        </AlertDialog>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
