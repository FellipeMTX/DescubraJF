import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectImage } from "@/components/ui/AspectImage";
import { usePostBySlug } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import { renderPostContent } from "@/lib/renderPostContent";
import { IMAGE_RATIOS } from "@/lib/constants";
import type { PostCategoria } from "@/types/database";

const PATHS: Record<PostCategoria, { backKey: string; basePath: string }> = {
  noticia: { backKey: "posts.news.detail.back", basePath: "/secretaria/noticias" },
  programa_projeto: { backKey: "posts.programs.detail.back", basePath: "/secretaria/programas-e-projetos" },
};

const RETURN_KEYS: Record<PostCategoria, string> = {
  noticia: "posts.news.detail.backLink",
  programa_projeto: "posts.programs.detail.backLink",
};

type Props = { categoria: PostCategoria };

export default function PostDetail({ categoria }: Props) {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const { data: post, isLoading, error } = usePostBySlug(categoria, slug);
  const meta = PATHS[categoria];

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
          <p style={{ color: "var(--color-bl-muted)" }}>{t("posts.notFound")}</p>
          <Link to={meta.basePath} className="bl-btn-ghost mt-6 inline-flex">
            <ChevronLeft size={14} /> {t(RETURN_KEYS[categoria])}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bl-app min-h-screen">
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-14">
        <Link to={meta.basePath} className="bl-btn-ghost inline-flex">
          <ChevronLeft size={14} /> {t(meta.backKey)}
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
          <AspectImage
            src={post.imagem_capa}
            alt={post.titulo}
            ratio={IMAGE_RATIOS.postCover}
            className="mt-10 w-full rounded-2xl"
            imgClassName="rounded-2xl"
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
