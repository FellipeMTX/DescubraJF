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
      <div className="min-h-screen bg-primary-50 pt-20">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-4 h-64 w-full rounded-xl" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-primary-50 pt-20">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-accent-500">Post não encontrado.</p>
          <Link to={labels.basePath} className="mt-4 inline-block text-primary-600 hover:underline">
            Voltar para {labels.backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link
          to={labels.basePath}
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
        >
          <ChevronLeft size={16} /> {labels.backLabel}
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-primary-800 md:text-4xl">{post.titulo}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-accent-500">
          <span>{formatDate(post.created_at)}</span>
          {post.autor && <><span>·</span><span>{post.autor}</span></>}
        </div>

        {post.imagem_capa && (
          <img
            src={post.imagem_capa}
            alt={post.titulo}
            className="mt-8 aspect-video w-full rounded-2xl object-cover shadow-md"
          />
        )}

        {post.resumo && (
          <p className="mt-8 text-lg leading-relaxed text-primary-700">{post.resumo}</p>
        )}

        {post.conteudo_html && (
          <div className="post-content mt-8">
            {renderPostContent(post.conteudo_html)}
          </div>
        )}
      </article>
    </div>
  );
}
