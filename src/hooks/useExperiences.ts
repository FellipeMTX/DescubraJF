import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Experiencia, CategoriaExperiencia } from "@/types/database";

async function fetchCategoryById() {
  const { data } = await supabase.from("categorias_experiencia").select("*");
  return new Map((data ?? []).map((c) => [c.id, c as CategoriaExperiencia]));
}

function withCategorias(
  exp: Experiencia,
  catById: Map<string, CategoriaExperiencia>
): Experiencia {
  const categorias = (exp.categoria_ids ?? [])
    .map((id) => catById.get(id))
    .filter((c): c is CategoriaExperiencia => Boolean(c));
  return { ...exp, categorias };
}

export function useExperiences(categorySlug?: string) {
  return useQuery({
    queryKey: ["experiencias", categorySlug],
    queryFn: async () => {
      const catById = await fetchCategoryById();

      let query = supabase
        .from("experiencias")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (categorySlug && categorySlug !== "todos") {
        const catId = [...catById.values()].find((c) => c.slug === categorySlug)?.id;
        if (catId) query = query.contains("categoria_ids", [catId]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Experiencia[]).map((e) => withCategorias(e, catById));
    },
  });
}

export function useFeaturedExperiences() {
  return useQuery({
    queryKey: ["experiencias", "destaque"],
    queryFn: async () => {
      const catById = await fetchCategoryById();
      const { data, error } = await supabase
        .from("experiencias")
        .select("*")
        .eq("ativo", true)
        .eq("destaque", true)
        .order("ordem");

      if (error) throw error;
      return (data as Experiencia[]).map((e) => withCategorias(e, catById));
    },
  });
}

export function useExperienceBySlug(slug: string) {
  return useQuery({
    queryKey: ["experiencia", slug],
    queryFn: async () => {
      const catById = await fetchCategoryById();
      const { data, error } = await supabase
        .from("experiencias")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return withCategorias(data as Experiencia, catById);
    },
    enabled: !!slug,
  });
}

export function useExperienceCategories() {
  return useQuery({
    queryKey: ["categorias_experiencia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias_experiencia")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;
      return data as CategoriaExperiencia[];
    },
  });
}
