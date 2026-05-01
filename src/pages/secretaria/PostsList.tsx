import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePosts } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import type { PostCategoria } from "@/types/database";

const BASE_PATHS: Record<PostCategoria, string> = {
  noticia: "/secretaria/noticias",
  programa_projeto: "/secretaria/programas-e-projetos",
};

const COPY: Record<
  PostCategoria,
  { kicker: string; title: string; highlight: string; subtitle: string; empty: string }
> = {
  noticia: {
    kicker: "Secretaria de Turismo",
    title: "Últimas",
    highlight: "Notícias",
    subtitle: "Acompanhe as últimas notícias da Secretaria de Turismo de Juiz de Fora.",
    empty: "Nenhuma notícia publicada no momento.",
  },
  programa_projeto: {
    kicker: "Secretaria de Turismo",
    title: "Programas e",
    highlight: "Projetos",
    subtitle: "Conheça os programas e projetos da Secretaria de Turismo de Juiz de Fora.",
    empty: "Nenhum programa ou projeto publicado no momento.",
  },
};

type Props = { categoria: PostCategoria };

export default function PostsList({ categoria }: Props) {
  const { data: posts, isLoading } = usePosts(categoria);
  const basePath = BASE_PATHS[categoria];
  const copy = COPY[categoria];

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12">
        <PageHeader
          kicker={copy.kicker}
          title={copy.title}
          highlight={copy.highlight}
          subtitle={copy.subtitle}
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
                <div
                  className="aspect-video overflow-hidden"
                  style={{ background: "var(--color-bl-bg)" }}
                >
                  {post.imagem_capa ? (
                    <img
                      src={post.imagem_capa}
                      alt={post.titulo}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="bl-ph h-full w-full">Sem imagem</div>
                  )}
                </div>
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
            {copy.empty}
          </p>
        )}
      </div>
    </div>
  );
}
