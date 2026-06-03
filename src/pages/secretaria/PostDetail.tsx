import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostBySlug } from "@/hooks/usePosts";
import { formatDate } from "@/lib/utils";
import { renderPostContent } from "@/lib/renderPostContent";
import type { PostCategoria } from "@/types/database";

const PATHS: Record<PostCategoria, { kickerKey: string; backKey: string; basePath: string }> = {
  noticia: {
    kickerKey: "posts.news.kicker",
    backKey: "posts.news.detail.back",
    basePath: "/secretaria/noticias",
  },
  programa_projeto: {
    kickerKey: "posts.programs.kicker",
    backKey: "posts.programs.detail.back",
    basePath: "/secretaria/programas-e-projetos",
  },
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
        <Skeleton
          className="w-full rounded-none"
          style={{ height: "clamp(260px, 50vw, 560px)" }}
        />
        <div className="mx-auto max-w-5xl px-4 pb-16 md:px-14 md:pb-24">
          <Skeleton className="mx-2 -mt-16 h-48 rounded-[18px] sm:mx-6 sm:-mt-20 md:mx-24 md:-mt-28 md:h-56" />
          <Skeleton className="mx-auto mt-12 h-4 w-full max-w-3xl" />
          <Skeleton className="mx-auto mt-2 h-4 w-5/6 max-w-3xl" />
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
      {/* hero — imagem full-bleed + "Voltar" pill sobreposto */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(260px, 50vw, 560px)" }}
      >
        {post.imagem_capa ? (
          <img
            src={post.imagem_capa}
            alt={post.titulo}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, var(--color-bl-card) 0%, var(--color-bl-muted) 100%)",
            }}
          />
        )}

        <Link
          to={meta.basePath}
          className="absolute inline-flex items-center gap-2 rounded-full font-semibold no-underline transition-shadow hover:shadow-lg"
          style={{
            top: "clamp(12px, 2vw, 24px)",
            left: "clamp(16px, 3.5vw, 40px)",
            padding: "clamp(8px, 1vw, 10px) clamp(14px, 1.8vw, 20px)",
            fontSize: "clamp(12px, 1.2vw, 13.5px)",
            background: "var(--color-bl-bg)",
            color: "var(--color-bl-ink)",
            boxShadow: "0 8px 24px -10px rgba(0,0,0,0.25)",
          }}
        >
          <ChevronLeft size={14} />
          {t(meta.backKey)}
        </Link>
      </div>

      <article
        className="mx-auto w-full max-w-5xl"
        style={{
          paddingLeft: "clamp(16px, 3vw, 56px)",
          paddingRight: "clamp(16px, 3vw, 56px)",
          paddingBottom: "clamp(64px, 8vw, 96px)",
        }}
      >
        {/* title card — overlap negativo sobre a imagem */}
        <div
          className="relative z-10 rounded-[18px]"
          style={{
            marginLeft: "clamp(8px, 7vw, 96px)",
            marginRight: "clamp(8px, 7vw, 96px)",
            marginTop: "calc(-1 * clamp(64px, 9vw, 112px))",
            paddingTop: "clamp(28px, 3.6vw, 40px)",
            paddingBottom: "clamp(24px, 3vw, 32px)",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
            background: "var(--color-bl-bg)",
            boxShadow: "0 24px 60px -30px rgba(40,28,15,0.35)",
          }}
        >
          <span
            className="font-semibold uppercase"
            style={{
              fontSize: "clamp(10px, 1vw, 11px)",
              letterSpacing: "0.22em",
              color: "var(--color-bl-accent)",
            }}
          >
            {t(meta.kickerKey)}
          </span>
          <h1
            className="bl-display m-0"
            style={{
              marginTop: "clamp(10px, 1.2vw, 14px)",
              fontSize: "clamp(24px, 4vw, 44px)",
              fontWeight: 500,
              letterSpacing: "-0.015em",
              textWrap: "balance",
            }}
          >
            {post.titulo}
          </h1>

          <div
            className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t"
            style={{
              marginTop: "clamp(20px, 2.5vw, 28px)",
              paddingTop: "clamp(16px, 2vw, 22px)",
              borderColor: "rgba(0,0,0,0.08)",
            }}
          >
            <span
              className="font-semibold uppercase"
              style={{
                fontSize: "clamp(10px, 1vw, 11px)",
                letterSpacing: "0.22em",
                color: "var(--color-bl-muted)",
              }}
            >
              {t("posts.publishedOn")}
            </span>
            <span
              className="bl-em"
              style={{
                fontSize: "clamp(15px, 1.6vw, 18px)",
                fontStyle: "italic",
              }}
            >
              {formatDate(post.data_publicacao ?? post.created_at)}
            </span>
            {post.autor && (
              <span
                style={{
                  fontSize: "clamp(12px, 1.1vw, 13px)",
                  color: "var(--color-bl-muted)",
                }}
              >
                · {post.autor}
              </span>
            )}
          </div>
        </div>

        {/* body */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "min(720px, 100%)",
            marginTop: "clamp(40px, 5vw, 64px)",
          }}
        >
          {post.resumo && (
            <p
              className="m-0"
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                lineHeight: 1.55,
                color: "var(--color-bl-ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              {post.resumo}
            </p>
          )}

          {post.conteudo_html && (
            <div
              className="post-content"
              style={{
                marginTop: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.7,
              }}
            >
              {renderPostContent(post.conteudo_html)}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
