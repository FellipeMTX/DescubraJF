import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Post, PostCategoria } from "@/types/database";

export function usePosts(categoria: PostCategoria, onlyPublished = true) {
  return useQuery({
    queryKey: ["posts", categoria, onlyPublished],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("categoria", categoria)
        .order("created_at", { ascending: false });

      if (onlyPublished) query = query.eq("publicado", true);

      const { data, error } = await query;
      if (error) throw error;
      return data as Post[];
    },
  });
}

export function usePostBySlug(categoria: PostCategoria, slug: string) {
  return useQuery({
    queryKey: ["post", categoria, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("categoria", categoria)
        .eq("slug", slug)
        .eq("publicado", true)
        .single();

      if (error) throw error;
      return data as Post;
    },
    enabled: !!slug,
  });
}
