import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Experiencia, CategoriaExperiencia } from "@/types/database";

export function useExperiences(categorySlug?: string) {
  return useQuery({
    queryKey: ["experiencias", categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("experiencias")
        .select("*, categoria:categorias_experiencia(*)")
        .eq("ativo", true)
        .order("ordem");

      if (categorySlug && categorySlug !== "todos") {
        const { data: cat } = await supabase
          .from("categorias_experiencia")
          .select("id")
          .eq("slug", categorySlug)
          .single();

        if (cat) {
          query = query.eq("categoria_id", cat.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Experiencia[];
    },
  });
}

export function useFeaturedExperiences() {
  return useQuery({
    queryKey: ["experiencias", "destaque"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiencias")
        .select("*, categoria:categorias_experiencia(*)")
        .eq("ativo", true)
        .eq("destaque", true)
        .order("ordem");

      if (error) throw error;
      return data as Experiencia[];
    },
  });
}

export function useExperienceBySlug(slug: string) {
  return useQuery({
    queryKey: ["experiencia", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiencias")
        .select("*, categoria:categorias_experiencia(*)")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Experiencia;
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
