import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  articlesPerPage: number;
  enableComments: boolean;
  requireApproval: boolean;
  breakingNewsEnabled: boolean;
  newsletterEnabled: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Palawan Daily News",
  tagline: "Trusted and Fair Quad Media Network in MIMAROPA",
  contactEmail: "editorial@palawandaily.com",
  articlesPerPage: 10,
  enableComments: false,
  requireApproval: true,
  breakingNewsEnabled: true,
  newsletterEnabled: true,
};

export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "site_configs")
      .single();

    if (!error && data) {
      return { ...DEFAULT_SETTINGS, ...data.value };
    }
  }
  return DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<boolean> {
  if (isSupabaseConfigured) {
    const current = await getSettings();
    const newValue = { ...current, ...updates };

    const { error } = await supabaseAdmin
      .from("settings")
      .upsert({
        key: "site_configs",
        value: newValue
      });

    if (!error) {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath("/admin/settings");
      return true;
    }
    console.error("Supabase updateSettings error:", error);
  }
  return false;
}
