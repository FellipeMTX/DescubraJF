import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Evento } from "@/types/database";

export function useUpcomingEvents(limit = 5) {
  return useQuery({
    queryKey: ["eventos", "proximos", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("data_inicio")
        .limit(limit);

      if (error) throw error;
      return data as Evento[];
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["eventos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("ativo", true)
        .order("data_inicio");

      if (error) throw error;
      return data as Evento[];
    },
  });
}

export function useEventBySlug(slug: string) {
  return useQuery({
    queryKey: ["evento", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Evento;
    },
    enabled: !!slug,
  });
}
