import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { EstabelecimentoGastronomia, CategoriaGastronomia } from "@/types/database";

export function useDiningEstablishments(categorySlug?: string) {
  return useQuery({
    queryKey: ["gastronomia", categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("estabelecimentos_gastronomia")
        .select("*, categoria:categorias_gastronomia(*)")
        .eq("ativo", true)
        .order("ordem");

      if (categorySlug && categorySlug !== "todos") {
        const { data: cat } = await supabase
          .from("categorias_gastronomia")
          .select("id")
          .eq("slug", categorySlug)
          .single();

        if (cat) {
          query = query.eq("categoria_gastronomia_id", cat.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EstabelecimentoGastronomia[];
    },
  });
}

export function useDiningBySlug(slug: string) {
  return useQuery({
    queryKey: ["gastronomia", "detalhe", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estabelecimentos_gastronomia")
        .select("*, categoria:categorias_gastronomia(*)")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as EstabelecimentoGastronomia;
    },
    enabled: !!slug,
  });
}

export function useDiningCategories() {
  return useQuery({
    queryKey: ["categorias_gastronomia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias_gastronomia")
        .select("*")
        .order("ordem");

      if (error) throw error;
      return data as CategoriaGastronomia[];
    },
  });
}
