"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { PlusCircle, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { getTags, createTag, deleteTag, type Tag } from "@/lib/tags-service";
import { toast } from "sonner";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTags() {
      const data = await getTags();
      setTags(data);
      setLoading(false);
    }
    loadTags();
  }, []);

  async function handleAdd() {
    if (!newTag.trim()) return;
    const added = await createTag(newTag.trim());
    if (added) {
      setTags(t => [...t, added]);
      setNewTag("");
      toast.success("Tag added successfully");
    } else {
      toast.error("Failed to add tag");
    }
  }

  async function handleDelete(id: number) {
    const success = await deleteTag(id);
    if (success) {
      setTags(t => t.filter(tag => tag.id !== id));
      toast.success("Tag deleted");
    } else {
      toast.error("Failed to delete tag");
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4">
          <h1 className="text-xl font-bold text-foreground">Tags</h1>
          <p className="text-sm text-muted-foreground">Manage article tags</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add tag */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h3 className="font-semibold text-foreground mb-4">Add New Tag</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tag Name</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Enter tag name..."
                    className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Slug</label>
                  <input
                    type="text"
                    value={newTag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}
                    readOnly
                    placeholder="auto-generated"
                    className="w-full h-9 px-3 border border-border bg-muted/30 rounded-lg text-sm text-muted-foreground"
                  />
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Tags list */}
            <div className="md:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">All Tags ({tags.length})</h3>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              <div className="flex flex-wrap gap-2">
                {!loading && tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No tags found. Add one on the left.</p>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted-accent rounded-full text-sm text-foreground group transition-colors border border-border/50"
                    >
                      <span>{tag.name}</span>
                      {tag.count !== undefined && <span className="text-xs text-muted-foreground">({tag.count})</span>}
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="text-muted-foreground hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
