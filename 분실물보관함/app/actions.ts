"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

const MAX_IMAGE = 4 * 1024 * 1024; // Vercel 요청 크기 제한 고려

export async function createItem(formData: FormData) {
  let image_url: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE) redirect("/register?error=size");
    if (!file.type.startsWith("image/")) redirect("/register?error=type");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("items")
      .upload(path, file, { contentType: file.type });
    if (error) redirect("/register?error=upload");
    image_url = supabase.storage.from("items").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from("items").insert({
    name: String(formData.get("name")).slice(0, 100),
    category: String(formData.get("category")),
    found_place: String(formData.get("found_place")).slice(0, 100),
    found_date: String(formData.get("found_date")),
    storage_place: String(formData.get("storage_place")).slice(0, 100),
    description: String(formData.get("description") ?? "").slice(0, 500) || null,
    image_url,
  });
  if (error) redirect("/register?error=save");

  revalidatePath("/");
  redirect("/");
}

export async function setStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) === "returned" ? "returned" : "keeping";
  await supabase.from("items").update({ status }).eq("id", id);
  revalidatePath("/");
  revalidatePath(`/items/${id}`);
}
