import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Hospedagem } from "@/types/database";

export function useLodgingEstablishments(type?: string) {
  return useQuery({
    queryKey: ["hospedagens", type],
    queryFn: async () => {
      let query = supabase
        .from("hospedagens")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (type && type !== "todos") {
        query = query.eq("tipo", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Hospedagem[];
    },
  });
}

export function useLodgingBySlug(slug: string) {
  return useQuery({
    queryKey: ["hospedagem", "detalhe", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospedagens")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Hospedagem;
    },
    enabled: !!slug,
  });
}
