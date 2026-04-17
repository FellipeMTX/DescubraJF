import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import type { PostCategoria } from "@/types/database";

const BASE_PATHS: Record<PostCategoria, string> = {
  noticia: "/secretaria/noticias",
  programa_projeto: "/secretaria/programas-e-projetos",
};

const KEY_BY_CATEGORIA: Record<PostCategoria, "news" | "programs"> = {
  noticia: "news",
  programa_projeto: "programs",
};

type Props = { categoria: PostCategoria };

export default function PostsList({ categoria }: Props) {
  const { t } = useTranslation();
  const { data: posts, isLoading } = usePosts(categoria);
  const basePath = BASE_PATHS[categoria];
  const key = KEY_BY_CATEGORIA[categoria];

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800 md:text-4xl">{t(`pages.posts.${key}.title`)}</h1>
        <p className="mt-2 text-accent-500">{t(`pages.posts.${key}.subtitle`)}</p>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`${basePath}/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="aspect-video overflow-hidden bg-primary-100">
                  {post.imagem_capa ? (
                    <img
                      src={post.imagem_capa}
                      alt={post.titulo}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-primary-400">
                      {t("pages.posts.noImage")}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-accent-400">{formatDate(post.created_at)}</p>
                  <h2 className="mt-1 text-lg font-bold text-primary-800 group-hover:text-primary-600">
                    {post.titulo}
                  </h2>
                  {post.resumo && (
                    <p className="mt-2 line-clamp-3 text-sm text-accent-500">{post.resumo}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-accent-500">{t(`pages.posts.${key}.empty`)}</p>
        )}
      </div>
    </div>
  );
}
