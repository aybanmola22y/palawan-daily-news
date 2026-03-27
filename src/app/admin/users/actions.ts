"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteAuthorAction(id: string) {
  // Try authors table first
  let { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) {
    // Try profiles as fallback
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", id);
    error = profileError;
  }
  
  if (!error) {
    revalidatePath("/admin/users");
    return true;
  }
  return false;
}

export async function updateAuthorAction(id: string, updates: any) {
  // Try authors table first
  let { error } = await supabase.from("authors").update(updates).eq("id", id);
  if (error) {
    // Try profiles as fallback
    const { error: profileError } = await supabase.from("profiles").update(updates).eq("id", id);
    error = profileError;
  }

  if (!error) {
    revalidatePath("/admin/users");
    return true;
  }
  return false;
}

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return null;
  
  const fileName = `avatar-${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { 
      upsert: true,
      contentType: file.type || 'image/jpeg' 
    });
    
  if (!error && data) {
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    return publicUrl;
  }
  
  return null;
}
