import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostBySlug } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import { renderPostContent } from "@/lib/renderPostContent";
import type { PostCategoria } from "@/types/database";

const LABELS: Record<PostCategoria, { backLabel: string; basePath: string }> = {
  noticia: { backLabel: "Notícias", basePath: "/secretaria/noticias" },
  programa_projeto: { backLabel: "Programas e Projetos", basePath: "/secretaria/programas-e-projetos" },
};

type Props = { categoria: PostCategoria };

export default function PostDetail({ categoria }: Props) {
  const { slug = "" } = useParams();
  const { data: post, isLoading, error } = usePostBySlug(categoria, slug);
  const labels = LABELS[categoria];

  if (isLoading) {
    return (
      <div className="bl-app min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-14">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-4 h-64 w-full rounded-2xl" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bl-app min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-14">
          <p style={{ color: "var(--color-bl-muted)" }}>Post não encontrado.</p>
          <Link to={labels.basePath} className="bl-btn-ghost mt-6 inline-flex">
            <ChevronLeft size={14} /> Voltar para {labels.backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bl-app min-h-screen">
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-14">
        <Link to={labels.basePath} className="bl-btn-ghost inline-flex">
          <ChevronLeft size={14} /> {labels.backLabel}
        </Link>

        <h1
          className="bl-display mt-8 m-0"
          style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
        >
          {post.titulo}
        </h1>

        <div
          className="mt-4 flex flex-wrap items-center gap-3 text-sm"
          style={{ color: "var(--color-bl-muted)" }}
        >
          <span className="bl-num">{formatDate(post.created_at)}</span>
          {post.autor && (
            <>
              <span>·</span>
              <span>{post.autor}</span>
            </>
          )}
        </div>

        {post.imagem_capa && (
          <img
            src={post.imagem_capa}
            alt={post.titulo}
            className="mt-10 aspect-video w-full rounded-2xl object-cover"
            style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
          />
        )}

        {post.resumo && (
          <p
            className="mt-10 text-lg leading-[1.7]"
            style={{ color: "var(--color-bl-ink)" }}
          >
            {post.resumo}
          </p>
        )}

        {post.conteudo_html && (
          <div className="post-content mt-8 leading-[1.7]">
            {renderPostContent(post.conteudo_html)}
          </div>
        )}
      </article>
    </div>
  );
}
