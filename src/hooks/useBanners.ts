import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Banner } from "@/types/database";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("ativo", true)
        .order("ordem");

      if (error) throw error;
      return data as Banner[];
    },
  });
}
