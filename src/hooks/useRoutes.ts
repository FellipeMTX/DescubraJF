import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Roteiro } from "@/types/database";

export function useRoutes() {
  return useQuery({
    queryKey: ["roteiros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roteiros")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;
      return data as Roteiro[];
    },
  });
}

export function useRouteBySlug(slug: string) {
  return useQuery({
    queryKey: ["roteiro", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roteiros")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Roteiro;
    },
    enabled: !!slug,
  });
}
