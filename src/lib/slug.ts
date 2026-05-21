import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

export async function uniqueSlug(base: string, table: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(base);
  let query = supabase.from(table).select("slug").like("slug", `${baseSlug}%`);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  const existing = new Set((data ?? []).map((r: { slug: string }) => r.slug));
  if (!existing.has(baseSlug)) return baseSlug;
  let i = 2;
  while (existing.has(`${baseSlug}-${i}`)) i++;
  return `${baseSlug}-${i}`;
}
