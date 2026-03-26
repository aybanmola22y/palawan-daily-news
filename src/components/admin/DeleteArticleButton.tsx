"use client";

import { useMemo, useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

type Props = {
  id: number;
  title: string;
  slug: string;
};

export default function DeleteArticleButton({ id, title, slug }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText === title && !loading;

  async function onDelete() {
    if (!canDelete) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Failed to delete article");
        setLoading(false);
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Failed to delete article");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) {
        setConfirmText("");
        setError(null);
        setLoading(false);
      }
    }}>
      <AlertDialogTrigger asChild>
        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="px-6 py-5 bg-linear-to-b from-red-50 to-white border-b border-red-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start gap-4">
            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <span className="flex-1">
              <span className="block text-xl font-bold leading-tight text-gray-900">Delete article?</span>
              <span className="block text-sm text-gray-500 mt-1 font-medium">
                The article will be moved to the Trash section. You can restore it later.
              </span>
            </span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        </div>

        <div className="px-6 py-6 space-y-6 bg-white">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Target for Deletion</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{title}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-mono text-gray-600 shadow-sm">
                Slug: {slug}
              </span>
              <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-600 shadow-sm">
                Restorable
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Confirm Name
              </label>
              <span className="text-[11px] text-red-500 font-medium italic">Required</span>
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type article name here..."
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 shadow-inner placeholder:opacity-30"
              autoFocus
            />
             <p className="text-[11px] text-gray-400 font-medium">
              Please type: <span className="text-gray-600 font-bold">"{title}"</span>
            </p>
          </div>
        </div>

        <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <AlertDialogFooter className="w-full sm:space-x-3">
            <AlertDialogCancel disabled={loading} className="w-full sm:w-32 h-12 rounded-xl border-gray-200 font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition-all">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={!canDelete}
                onClick={onDelete}
                className="w-full sm:flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider disabled:opacity-30 shadow-lg shadow-red-200 active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                Delete Article
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>

    </AlertDialog>
  );
}

