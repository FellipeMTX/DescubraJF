import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { EstabelecimentoGastronomia, CategoriaGastronomia } from "@/types/database";

export function useDiningEstablishments(categorySlug?: string) {
  return useQuery({
    queryKey: ["gastronomia", categorySlug],
    queryFn: async () => {
      // Fetch establishments with their categories via junction table
      const { data: establishments, error } = await supabase
        .from("estabelecimentos_gastronomia")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;

      // Fetch all category relations
      const { data: relations } = await supabase
        .from("estabelecimento_categorias")
        .select("estabelecimento_id, categoria:categorias_gastronomia(*)");

      // Map categories to establishments
      const result = establishments.map((est) => ({
        ...est,
        categorias: (relations ?? [])
          .filter((r) => r.estabelecimento_id === est.id)
          .map((r) => r.categoria as unknown as CategoriaGastronomia),
      })) as EstabelecimentoGastronomia[];

      // Filter by category if specified
      if (categorySlug && categorySlug !== "todos") {
        return result.filter((est) =>
          est.categorias?.some((c) => c.slug === categorySlug)
        );
      }

      return result;
    },
  });
}

export function useDiningBySlug(slug: string) {
  return useQuery({
    queryKey: ["gastronomia", "detalhe", slug],
    queryFn: async () => {
      const { data: est, error } = await supabase
        .from("estabelecimentos_gastronomia")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Fetch categories for this establishment
      const { data: relations } = await supabase
        .from("estabelecimento_categorias")
        .select("categoria:categorias_gastronomia(*)")
        .eq("estabelecimento_id", est.id);

      return {
        ...est,
        categorias: (relations ?? []).map((r) => r.categoria as unknown as CategoriaGastronomia),
      } as EstabelecimentoGastronomia;
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
