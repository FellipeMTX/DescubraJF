import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouteBySlug } from "@/hooks/useRoutes";

export default function RouteDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: route, isLoading, error } = useRouteBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="bl-app min-h-screen">
        <div className="mx-auto max-w-5xl px-14 py-12">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-6 h-12 w-80" />
          <Skeleton className="mt-8 h-96 w-full rounded-[28px]" />
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="bl-app min-h-screen">
        <div className="mx-auto max-w-4xl px-14 py-16 text-center">
          <h1 className="bl-display text-4xl">
            {t("routes.detail.notFoundTitle")} <span className="bl-em">{t("routes.detail.notFoundHighlight")}</span>
          </h1>
          <Link to="/roteiros" className="bl-btn-ghost mt-6 inline-flex">
            <ChevronLeft size={16} /> {t("routes.detail.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-5xl px-14 py-12">
        <Link
          to="/roteiros"
          className="inline-flex items-center gap-1 text-sm hover:underline"
          style={{ color: "var(--color-bl-muted)" }}
        >
          <ChevronLeft size={16} /> {t("routes.detail.breadcrumb")}
        </Link>

        <h1
          className="bl-display mt-6 m-0"
          style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
        >
          {route.nome}
        </h1>
        {route.descricao && (
          <p
            className="mt-4 max-w-3xl whitespace-pre-line text-base leading-[1.7]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {route.descricao}
          </p>
        )}

        {route.mapa_url ? (
          <div className="mt-8 overflow-hidden rounded-[28px] shadow-lg">
            <iframe
              src={route.mapa_url}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={route.nome}
            />
          </div>
        ) : (
          <div
            className="mt-8 flex h-96 items-center justify-center rounded-[28px]"
            style={{
              background: "var(--color-bl-card)",
              color: "var(--color-bl-muted)",
            }}
          >
            {t("routes.detail.mapPlaceholder")}
          </div>
        )}
      </div>
    </div>
  );
}
