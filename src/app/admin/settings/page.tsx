"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Save, Loader2 } from "lucide-react";
import { getSettings, updateSettings, type SiteSettings } from "@/lib/settings-service";
import { toast } from "sonner";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
      setLoading(false);
    }
    loadSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    const success = await updateSettings(settings);
    setSaving(false);
    if (success) {
      toast.success("Settings saved successfully");
    } else {
      toast.error("Failed to save settings");
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Configure your news website (Saved to Supabase)</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        <div className="p-8 max-w-2xl space-y-6">
          {/* General */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings(s => s ? ({ ...s, siteName: e.target.value }) : s)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings(s => s ? ({ ...s, tagline: e.target.value }) : s)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Editorial Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(s => s ? ({ ...s, contactEmail: e.target.value }) : s)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Articles Per Page</label>
                <select
                  value={settings.articlesPerPage}
                  onChange={(e) => setSettings(s => s ? ({ ...s, articlesPerPage: Number(e.target.value) }) : s)}
                  className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[5, 10, 15, 20, 25].map(n => <option key={n} value={n} className="bg-background">{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-4">Content Workflow</h3>
            <div className="space-y-4">
              {[
                { key: "requireApproval", label: "Require editor approval before publishing", description: "Writers must submit for review before articles can be published." },
                { key: "enableComments", label: "Enable comments on articles", description: "Allow readers to comment on published articles." },
                { key: "breakingNewsEnabled", label: "Enable breaking news ticker", description: "Show a breaking news banner at the top of the site." },
                { key: "newsletterEnabled", label: "Enable newsletter subscription", description: "Show newsletter signup form to readers." },
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={key}
                    checked={settings[key as keyof SiteSettings] as boolean}
                    onChange={(e) => setSettings(s => s ? ({ ...s, [key]: e.target.checked }) : s)}
                    className="h-4 w-4 mt-0.5 rounded border-border text-red-600 focus:ring-red-500 bg-background"
                  />
                  <div>
                    <label htmlFor={key} className="text-sm font-medium text-foreground">{label}</label>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-card rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm p-6">
            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                <div>
                  <p className="text-sm font-medium text-foreground">Clear all drafts</p>
                  <p className="text-xs text-muted-foreground">Permanently delete all draft articles</p>
                </div>
                <button className="px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                  Clear Drafts
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
