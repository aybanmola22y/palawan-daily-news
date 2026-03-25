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

  const required = useMemo(() => `delete/${slug}`, [slug]);
  const canDelete = confirmText.trim() === required && !loading;

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
      setConfirmText("");
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
      <AlertDialogContent className="max-w-xl p-0 overflow-hidden">
        <div className="px-6 py-5 bg-linear-to-b from-red-50 to-white border-b">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-lg font-semibold leading-tight text-gray-900">Delete article</span>
              <span className="block text-sm text-gray-600 mt-1">
                This action is permanent and cannot be undone.
              </span>
            </span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">You are deleting</p>
            <p className="mt-2 font-semibold text-gray-900 leading-snug wrap-break-word">{title}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                Slug: <span className="ml-1 font-mono text-gray-900">{slug}</span>
              </span>
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
                Irreversible
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              To confirm, type{" "}
              <span className="font-mono font-semibold text-gray-900">{required}</span> below.
            </p>
            <div className="relative">
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={required}
                className={[
                  "w-full h-11 px-3 rounded-lg text-sm bg-white border transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-300",
                  confirmText.length > 0 && !canDelete ? "border-red-300" : "border-gray-200",
                ].join(" ")}
                autoFocus
                inputMode="text"
                aria-label="Type confirmation text"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <span className={[
                  "text-[11px] font-semibold",
                  canDelete ? "text-green-700" : "text-gray-400",
                ].join(" ")}>
                  {canDelete ? "Matched" : "Required"}
                </span>
              </div>
            </div>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <AlertDialogFooter className="sm:space-x-3">
            <AlertDialogCancel disabled={loading} className="sm:min-w-28">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={!canDelete}
                onClick={onDelete}
                className="gap-2 sm:min-w-32"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

