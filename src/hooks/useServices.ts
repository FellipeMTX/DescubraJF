import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CategoriaServico, Servico } from "@/types/database";

export function useServiceCategories(pagina: "servicos" | "passeios") {
  return useQuery({
    queryKey: ["categorias_servicos", pagina],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias_servicos")
        .select("*")
        .eq("pagina", pagina)
        .eq("ativo", true)
        .order("ordem");
      if (error) throw error;
      return data as CategoriaServico[];
    },
  });
}

export function useServices(pagina: "servicos" | "passeios", categorySlug?: string) {
  return useQuery({
    queryKey: ["servicos", pagina, categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("servicos")
        .select("*, categoria:categorias_servicos(*)")
        .eq("pagina", pagina)
        .eq("ativo", true)
        .order("ordem");

      if (categorySlug && categorySlug !== "todos") {
        const { data: cat } = await supabase
          .from("categorias_servicos")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        if (cat) query = query.eq("categoria_id", cat.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Servico[];
    },
  });
}

export function useAllServiceCategories() {
  return useQuery({
    queryKey: ["categorias_servicos", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias_servicos")
        .select("*")
        .eq("ativo", true)
        .order("pagina")
        .order("ordem");
      if (error) throw error;
      return data as CategoriaServico[];
    },
  });
}
