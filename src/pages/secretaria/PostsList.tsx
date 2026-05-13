import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { AspectImage } from "@/components/ui/AspectImage";
import { usePosts } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import { IMAGE_RATIOS } from "@/lib/constants";
import type { PostCategoria } from "@/types/database";

const BASE_PATHS: Record<PostCategoria, string> = {
  noticia: "/secretaria/noticias",
  programa_projeto: "/secretaria/programas-e-projetos",
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
  programa_projeto: {
    kicker: "posts.programs.kicker",
    title: "posts.programs.list.title",
    highlight: "posts.programs.list.titleHighlight",
    subtitle: "posts.programs.list.subtitle",
    empty: "posts.programs.list.empty",
  },
};

type Props = { categoria: PostCategoria };

export default function PostsList({ categoria }: Props) {
  const { t } = useTranslation();
  const { data: posts, isLoading } = usePosts(categoria);
  const basePath = BASE_PATHS[categoria];
  const keys = I18N_KEYS[categoria];

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
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-[20px]" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
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
