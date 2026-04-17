import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { SeturMembro, SeturPagina } from "@/types/database";

export function useSeturPagina() {
  return useQuery({
    queryKey: ["setur_pagina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("setur_pagina")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as SeturPagina | null;
    },
  });
}

export function useSeturEquipe() {
  return useQuery({
    queryKey: ["setur_equipe"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("setur_equipe")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;
      return data as SeturMembro[];
    },
  });
}
