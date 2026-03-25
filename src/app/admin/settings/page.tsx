"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Save } from "lucide-react";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Palawan Daily News",
    tagline: "Palawan's Premier News Source",
    contactEmail: "editorial@palawandaily.com",
    articlesPerPage: 10,
    enableComments: false,
    requireApproval: true,
    breakingNewsEnabled: true,
    newsletterEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Configure your news website</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        <div className="p-8 max-w-2xl space-y-6">
          {/* General */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings(s => ({ ...s, siteName: e.target.value }))}
                  className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings(s => ({ ...s, tagline: e.target.value }))}
                  className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Editorial Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(s => ({ ...s, contactEmail: e.target.value }))}
                  className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Articles Per Page</label>
                <select
                  value={settings.articlesPerPage}
                  onChange={(e) => setSettings(s => ({ ...s, articlesPerPage: Number(e.target.value) }))}
                  className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[5, 10, 15, 20, 25].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Content Workflow</h3>
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
                    checked={settings[key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings(s => ({ ...s, [key]: e.target.checked }))}
                    className="h-4 w-4 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <label htmlFor={key} className="text-sm font-medium text-gray-700">{label}</label>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
            <h3 className="font-semibold text-red-700 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Clear all drafts</p>
                  <p className="text-xs text-gray-500">Permanently delete all draft articles</p>
                </div>
                <button className="px-3 py-1.5 border border-red-300 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors">
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
