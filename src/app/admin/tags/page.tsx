"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

const initialTags = [
  { id: 1, name: "Palawan", slug: "palawan", count: 5 },
  { id: 2, name: "Tourism", slug: "tourism", count: 3 },
  { id: 3, name: "Environment", slug: "environment", count: 4 },
  { id: 4, name: "Technology", slug: "technology", count: 2 },
  { id: 5, name: "El Nido", slug: "el-nido", count: 2 },
  { id: 6, name: "Coron", slug: "coron", count: 1 },
  { id: 7, name: "Marine", slug: "marine", count: 2 },
  { id: 8, name: "Philippines", slug: "philippines", count: 3 },
  { id: 9, name: "Puerto Princesa", slug: "puerto-princesa", count: 2 },
  { id: 10, name: "Basketball", slug: "basketball", count: 1 },
  { id: 11, name: "Budget", slug: "budget", count: 1 },
  { id: 12, name: "UNESCO", slug: "unesco", count: 1 },
];

export default function TagsPage() {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");

  function handleAdd() {
    if (!newTag.trim()) return;
    const slug = newTag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setTags(t => [...t, { id: Date.now(), name: newTag.trim(), slug, count: 0 }]);
    setNewTag("");
  }

  function handleDelete(id: number) {
    setTags(t => t.filter(tag => tag.id !== id));
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500">Manage article tags</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add tag */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Add New Tag</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Tag Name</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Enter tag name..."
                    className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Slug</label>
                  <input
                    type="text"
                    value={newTag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}
                    readOnly
                    placeholder="auto-generated"
                    className="w-full h-9 px-3 border border-gray-100 bg-gray-50 rounded-lg text-sm text-gray-500"
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
            <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">All Tags ({tags.length})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 group transition-colors"
                  >
                    <span>{tag.name}</span>
                    <span className="text-xs text-gray-400">({tag.count})</span>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
