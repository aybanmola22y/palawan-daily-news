"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteAuthorAction(id: string) {
  // Delete from both to ensure sync
  const { error: authorError } = await supabase.from("authors").delete().eq("id", id);
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", id);
  
  if (!authorError || !profileError) {
    revalidatePath("/admin/users");
    return true;
  }
  return false;
}

export async function updateAuthorAction(id: string, updates: any) {
  // Update both to ensure sync
  const { error: authorError } = await supabase.from("authors").update(updates).eq("id", id);
  const { error: profileError } = await supabase.from("profiles").update(updates).eq("id", id);

  if (!authorError || !profileError) {
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
export async function inviteUserAction(data: any) {
  const { email, password, name, role, title, department, avatar_url } = data;

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name: name, role },
    email_confirm: true
  });

  if (authError) {
    console.error("Supabase createUser error:", authError);
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: "Failed to create user." };
  }

  // 2. Create the profile in BOTH authors and profiles tables
  const authorData = {
    id: authData.user.id,
    name,
    email,
    role,
    title,
    department,
    avatar_url,
    active: true
  };

  const [authorRes, profileRes] = await Promise.all([
    supabaseAdmin.from("authors").insert(authorData),
    supabaseAdmin.from("profiles").insert({
      id: authorData.id,
      name: authorData.name,
      email: authorData.email,
      role: authorData.role,
      avatar_url: authorData.avatar_url,
      active: true
    })
  ]);

  if (authorRes.error || profileRes.error) {
    console.error("Supabase sync error:", authorRes.error || profileRes.error);
    return { success: false, error: (authorRes.error || profileRes.error)?.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
