import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { AspectImage } from "@/components/ui/AspectImage";
import { Pagination } from "@/components/ui/Pagination";
import { usePostsPaginated } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import { IMAGE_RATIOS } from "@/lib/constants";
import type { PostCategoria } from "@/types/database";

const PAGE_SIZE = 9;

const BASE_PATHS: Record<PostCategoria, string> = {
  noticia: "/secretaria/noticias",
};

const I18N_KEYS: Record<
  PostCategoria,
  { kicker: string; title: string; highlight: string; subtitle: string; empty: string }
> = {
  noticia: {
    kicker: "posts.news.kicker",
    title: "posts.news.list.title",
    highlight: "posts.news.list.titleHighlight",
    subtitle: "posts.news.list.subtitle",
    empty: "posts.news.list.empty",
  },
};

type Props = { categoria: PostCategoria };

export default function PostsList({ categoria }: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePostsPaginated(categoria, page, PAGE_SIZE);
  const basePath = BASE_PATHS[categoria];
  const keys = I18N_KEYS[categoria];

  const posts = data?.items ?? [];
  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  function handlePageChange(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12">
        <PageHeader
          kicker={t(keys.kicker)}
          title={t(keys.title)}
          highlight={t(keys.highlight)}
          subtitle={t(keys.subtitle)}
        />

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-[20px]" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`${basePath}/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--color-bl-card)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <AspectImage
                    src={post.imagem_capa}
                    alt={post.titulo}
                    ratio={IMAGE_RATIOS.postCover}
                    imgClassName="transition-transform duration-500 group-hover:scale-105"
                    placeholder={t("common.noImage")}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="bl-num">{formatDate(post.created_at)}</p>
                    <h2 className="bl-display mt-2 text-xl leading-tight">
                      {post.titulo}
                    </h2>
                    {post.resumo && (
                      <p
                        className="mt-3 line-clamp-3 text-sm leading-[1.6]"
                        style={{ color: "var(--color-bl-muted)" }}
                      >
                        {post.resumo}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p
            className="mt-12 text-center"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {t(keys.empty)}
          </p>
        )}
      </div>
    </div>
  );
}
