"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

const initialCategories = [
  { id: 1, name: "Provincial News", slug: "provincial-news", color: "blue", description: "News from the province of Palawan", articleCount: 3 },
  { id: 2, name: "City News", slug: "city-news", color: "green", description: "News from around the city", articleCount: 3 },
  { id: 3, name: "Puerto Princesa City", slug: "puerto-princesa-city", color: "indigo", description: "Specific updates from the capital", articleCount: 0 },
  { id: 4, name: "Police Report", slug: "police-report", color: "orange", description: "Latest police and crime reports", articleCount: 0 },
  { id: 5, name: "National News", slug: "national", color: "emerald", description: "News from across the Philippines", articleCount: 3 },
  { id: 6, name: "Feature", slug: "feature", color: "purple", description: "Special features and long-form stories", articleCount: 0 },
  { id: 7, name: "Press Release", slug: "press-release", color: "blue", description: "Official press releases", articleCount: 0 },
  { id: 8, name: "Environment", slug: "environment", color: "green", description: "Environmental and conservation news", articleCount: 2 },
  { id: 9, name: "Column", slug: "column", color: "red", description: "Columns and recurring sections", articleCount: 0 },
  { id: 10, name: "Opinion", slug: "opinion", color: "red", description: "Editorials and opinion pieces", articleCount: 3 },
  { id: 11, name: "Lifestyle", slug: "lifestyle", color: "pink", description: "Health, travel, and lifestyle", articleCount: 1 },
  { id: 12, name: "Advertise", slug: "advertise", color: "gray", description: "Advertising info", articleCount: 1 },
  { id: 13, name: "Legal Section", slug: "legal", color: "slate", description: "Legal notices", articleCount: 1 },
  { id: 14, name: "International News", slug: "international", color: "sky", description: "World news and global updates", articleCount: 3 },
  { id: 15, name: "Editorial", slug: "editorial", color: "indigo", description: "The Editorial Board's perspectives", articleCount: 3 },
  { id: 16, name: "Regional News", slug: "regional-news", color: "orange", description: "Updates from across the MIMAROPA region", articleCount: 3 },
  { id: 17, name: "Youth & Campus", slug: "youth-campus", color: "pink", description: "Campus news and youth-oriented stories", articleCount: 4 },
  { id: 18, name: "Tourism", slug: "tourism", color: "teal", description: "Explore the beauty and attractions of Palawan", articleCount: 3 },
  { id: 19, name: "Technology", slug: "technology", color: "blue", description: "Tech news, innovation, and digital trends", articleCount: 1 },
  { id: 20, name: "Business", slug: "business", color: "emerald", description: "Economic updates and business highlights", articleCount: 1 },
  { id: 21, name: "Sports", slug: "sports", color: "orange", description: "Local and national sports updates", articleCount: 1 },
];

import { useEffect } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", color: "blue" });

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?t=${Date.now()}`);
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleAdd() {
    setEditId(null);
    setForm({ name: "", slug: "", description: "", color: "blue" });
    setShowForm(true);
  }

  function handleEdit(cat: any) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color });
    setShowForm(true);
  }

  async function handleSave() {
    try {
      const url = editId ? `/api/categories/${editId}` : "/api/categories";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        loadCategories();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) loadCategories();
    } catch (e) {
      console.error(e);
    }
  }

  function handleNameChange(name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm(f => ({ ...f, name, slug }));
  }

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    emerald: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground">Manage news categories</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Add Category
          </button>
        </div>

        <div className="p-8">
          {/* Add/Edit form */}
          {showForm && (
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">{editId ? "Edit Category" : "Add New Category"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Category name"
                    className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="category-slug"
                    className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Short description"
                    className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Color</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
                    className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-foreground"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="emerald">Emerald</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  {editId ? "Update" : "Add"} Category
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-border text-foreground text-sm rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Categories table */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Slug</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Articles</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorMap[cat.color] || "bg-muted text-muted-foreground"}`}>
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{cat.slug}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{cat.description}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-bold">{cat.articleCount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(cat)} className="p-1 text-muted-foreground hover:text-blue-500 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
