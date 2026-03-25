"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Save, Send, ArrowLeft, Calendar, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { mockOrgChartEmployees } from "@/lib/mock-data";
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

const statuses = [
  { value: "draft", label: "Save as Draft" },
  { value: "pending_review", label: "Submit for Review" },
  { value: "published", label: "Publish Now" },
  { value: "scheduled", label: "Schedule" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
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
    scheduledAt: formatDateTimeLocal(new Date()),
    seoTitle: "",
    seoDescription: "",
    authorName: mockOrgChartEmployees[0]?.name || "Staff",
    authorAvatar: mockOrgChartEmployees[0]?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  });

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

  function handleTitleChange(title: string) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm((f) => ({ ...f, title, slug }));
  }

  async function handleSave(status: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status,
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
              <h1 className="text-xl font-bold text-foreground">New Article</h1>
              <p className="text-sm text-muted-foreground">Create a new news article</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors font-mono uppercase tracking-tighter"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave("pending_review")}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saving ? "Creating..." : "Submit Article"}
            </button>
          </div>
        </div>

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
                    placeholder="Enter an engaging title..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-foreground"
                  />
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    Slug: <code className="bg-muted px-2 py-0.5 rounded text-xs text-red-500 font-mono">{form.slug || "will-be-generated"}</code>
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
                  placeholder="A short summary of the article..."
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-foreground resize-none"
                />
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">SEO Settings</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="SEO Title Override"
                    className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <textarea
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    placeholder="SEO Description (150-160 chars)"
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>
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
                      {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
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
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">MetaData</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Author</label>
                    <select
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {mockOrgChartEmployees.map((emp) => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
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
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">Image</h3>
                {form.featuredImage ? (
                  <div className="rounded-xl overflow-hidden mb-4 border border-border bg-muted">
                    <img src={form.featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-red-500/50 transition-colors cursor-pointer mb-4 block group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadFeaturedImage(f);
                    }} />
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2 group-hover:text-red-500 transition-colors" />
                        <p className="text-xs text-muted-foreground font-medium">Click to upload image</p>
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
