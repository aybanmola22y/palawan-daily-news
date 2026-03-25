"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, ArrowLeft, XCircle, Loader2, Calendar, Image as ImageIcon, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { DateTimePicker } from "@/components/admin/DateTimePicker";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

function formatDateTimeLocal(dateStr?: string | Date) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  tags: "",
  status: "draft",
  featured: false,
  breaking: false,
  scheduledAt: "",
};

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`/api/categories?t=${Date.now()}`);
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    }
    loadCategories();
  }, []);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  async function handleMediaUpload(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) return null;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      return data?.url || null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/articles/${id}?t=${Date.now()}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const a = await res.json();
        setForm({
          title: a.title ?? "",
          slug: a.slug ?? "",
          excerpt: a.excerpt ?? "",
          content: a.content ?? "",
          featuredImage: a.featuredImage ?? "",
          category: a.categoryName ?? "",
          tags: Array.isArray(a.tags) ? a.tags.join(", ") : "",
          status: a.status ?? "draft",
          featured: a.featured ?? false,
          breaking: a.breaking ?? false,
          scheduledAt: formatDateTimeLocal(a.publishedAt),
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleTitleChange(title: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm((f) => ({ ...f, title, slug }));
  }

  async function handleSave(status?: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: status ?? form.status,
        }),
      });
      if (!res.ok) {
        setSaving(false);
        return;
      }
      router.push("/admin/articles");
    } catch {
      setSaving(false);
    }
  }

  async function handleApprove() {
    setSaving(true);
    try {
      await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      router.push("/admin/articles");
    } catch (e) {
      setSaving(false);
    }
  }

  async function handleReject() {
    setSaving(true);
    try {
      await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectionReason: rejectReason }),
      });
      setShowRejectDialog(false);
      router.push("/admin/articles");
    } catch (e) {
      setSaving(false);
    }
  }

  async function uploadFeaturedImage(file: File) {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setUploadingImage(false);
        return;
      }
      if (data?.url) {
        setForm((f) => ({ ...f, featuredImage: data.url }));
      }
    } finally {
      setUploadingImage(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar user={demoUser} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground line-clamp-1 max-w-md">Edit: {form.title}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {form.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(form.status === "pending_review" || form.status === "approved") && (
              <>
                <button
                  onClick={() => setShowRejectDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Approve & Publish
                </button>
              </>
            )}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex items-center gap-6 py-2 px-6 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              {saving ? "Updating..." : "Update Story"}
            </button>
          </div>
        </div>

        {/* Reject dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h2 className="text-lg font-bold text-foreground mb-2">Reject Article</h2>
              <p className="text-sm text-muted-foreground mb-4">Please provide a reason for rejection. The writer will be notified.</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this article is being rejected..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 text-foreground"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowRejectDialog(false)} className="px-4 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-muted font-medium">
                  Cancel
                </button>
                <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700">
                  Reject Article
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-widest">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-foreground"
                  />
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    Slug: <code className="bg-muted px-2 py-0.5 rounded text-xs text-red-500 font-mono">{form.slug}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-widest">
                    Content
                  </label>
                  <RichTextEditor
                    content={form.content}
                    onChange={(html) => setForm({ ...form, content: html })}
                    onImageUpload={handleMediaUpload}
                  />
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <label className="block text-sm font-bold text-muted-foreground mb-2 uppercase tracking-widest">
                  Excerpt
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-foreground resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
                <h3 className="font-bold text-foreground border-b border-border pb-4 uppercase tracking-widest text-xs">Publish Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {form.status === "scheduled" && (
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1 block uppercase tracking-widest">
                        Schedule Date
                      </label>
                      <DateTimePicker
                        date={form.scheduledAt ? new Date(form.scheduledAt) : undefined}
                        onChange={(date) => setForm({ ...form, scheduledAt: date.toISOString() })}
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="pt-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="sr-only peer" />
                        <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-blue-600 transition-colors border border-border"></div>
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors italic">Featured Story</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" checked={form.breaking} onChange={(e) => setForm({ ...form, breaking: e.target.checked })} className="sr-only peer" />
                        <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-red-600 transition-colors border border-border"></div>
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-red-600 transition-colors italic">Breaking News</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">Category & Tags</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tags</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="Tags (comma separated)"
                      className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs tracking-tighter">Featured Image</h3>
                {form.featuredImage ? (
                  <div className="rounded-xl overflow-hidden mb-4 border border-border bg-muted">
                    <img src={form.featuredImage} alt="Featured" className="w-full h-64 object-cover" />
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border rounded-xl p-16 text-center hover:border-red-500/50 transition-colors cursor-pointer mb-4 block group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadFeaturedImage(f);
                    }} />
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 group-hover:text-red-500 transition-colors" />
                        <p className="text-sm text-muted-foreground font-medium">Click to upload image</p>
                      </>
                    )}
                  </label>
                )}
                <input
                  type="url"
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="Or paste image URL..."
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
