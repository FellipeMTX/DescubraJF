import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { AspectImage } from "@/components/ui/AspectImage";
import { useRoutes } from "@/hooks/useRoutes";
import { IMAGE_RATIOS } from "@/lib/constants";

export default function RouteList() {
  const { t } = useTranslation();
  const { data: routes, isLoading } = useRoutes();

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12">
        <PageHeader
          kicker={t("routes.list.kicker")}
          title={t("routes.list.title")}
          highlight={t("routes.list.titleHighlight")}
          subtitle={t("routes.list.subtitle")}
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-[28px]" />
              ))
            : routes?.map((route) => (
                <Link
                  key={route.id}
                  to={`/roteiros/${route.slug}`}
                  className="bl-card block"
                  style={{ background: "var(--color-bl-bg)" }}
                >
                  <AspectImage
                    src={route.imagem_destaque}
                    alt={route.nome}
                    ratio={IMAGE_RATIOS.cardLandscape}
                    placeholder={
                      <MapPin size={40} style={{ color: "var(--color-bl-muted)" }} />
                    }
                  />
                  <div className="p-5">
                    <h3 className="bl-display text-xl">{route.nome}</h3>
                    {route.descricao_curta && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--color-bl-muted)" }}
                      >
                        {route.descricao_curta}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
        </div>

        {!isLoading && !routes?.length && (
          <p
            className="mt-12 text-center"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {t("routes.list.empty")}
          </p>
        )}
      </div>
    </div>
  );
}
