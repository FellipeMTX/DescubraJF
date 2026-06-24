import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Post, PostCategoria } from "@/types/database";

export type PaginatedPosts = { items: Post[]; total: number };

/**
 * Posts paginados, sempre do mais recente para o mais antigo (created_at desc).
 * Usa range() + count exato no Supabase; mantém os dados anteriores enquanto
 * a próxima página carrega (keepPreviousData), evitando "piscar" a lista.
 */
export function usePostsPaginated(
  categoria: PostCategoria,
  page: number,
  pageSize: number,
  onlyPublished = true,
) {
  return useQuery({
    queryKey: ["posts", categoria, "paginated", onlyPublished, page, pageSize],
    queryFn: async (): Promise<PaginatedPosts> => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("categoria", categoria)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (onlyPublished) query = query.eq("publicado", true);

      const { data, error, count } = await query;
      if (error) throw error;
      return { items: (data as Post[]) ?? [], total: count ?? 0 };
    },
    placeholderData: keepPreviousData,
  });
}

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
