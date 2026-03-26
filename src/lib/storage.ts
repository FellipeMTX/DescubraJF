import { supabase } from "./supabase";

export async function uploadImage(file: File, folder = "general"): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const path = url.split("/images/")[1];
  if (!path) return;

  const { error } = await supabase.storage.from("images").remove([path]);
  if (error) throw error;
}
