import { supabase, isSupabaseConfigured, supabaseAdmin } from "./supabase";

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export async function getTags(): Promise<Tag[]> {
  if (isSupabaseConfigured) {
    const { data: tags, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");
    
    if (!error && tags) {
      return tags.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        count: 0 
      }));
    }
  }
  return [];
}

export async function createTag(name: string): Promise<Tag | null> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("tags")
      .insert({ name, slug })
      .select()
      .single();
    
    if (!error && data) {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/admin/tags");
      return data as Tag;
    }
    console.error("Supabase createTag error:", error);
  }
  return null;
}

export async function deleteTag(id: number): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin
      .from("tags")
      .delete()
      .eq("id", id);
    
    if (!error) {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/admin/tags");
      return true;
    }
    console.error("Supabase deleteTag error:", error);
  }
  return false;
}
