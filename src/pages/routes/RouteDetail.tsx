import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft, MapPin, Bookmark, ArrowRight, Map } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconByName } from "@/components/ui/IconPicker";
import { SectionTitle } from "@/components/programa/SectionTitle";
import { PlaceCards } from "@/components/programa/PlaceCards";
import { BottomCTAStrip } from "@/components/programa/BottomCTAStrip";
import { RoteiroHero } from "@/components/roteiro/RoteiroHero";
import { RoteiroStats } from "@/components/roteiro/RoteiroStats";
import { RoteiroInfoCard } from "@/components/roteiro/RoteiroInfoCard";
import { RoteiroMap } from "@/components/roteiro/RoteiroMap";
import { useRouteBySlug, useRoutePontos } from "@/hooks/useRoutes";

const resolveIcon = (name?: string) => getIconByName(name ?? "") ?? MapPin;

function FillImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />;
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center px-3 text-center text-[12px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: "var(--color-bl-prog-muted)" }}
    >
      {alt}
    </div>
  );
}

export default function RouteDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: route, isLoading, error } = useRouteBySlug(slug ?? "");
  const { data: pontos } = useRoutePontos(route?.id ?? "");

  if (isLoading) {
    return (
      <div className="bl-prog min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="mt-6 h-72 w-full rounded-[18px]" />
          <Skeleton className="mt-6 h-24 w-full rounded-[16px]" />
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="bl-app min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:px-14">
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

  const layout = route.layout;
  const sobre = layout?.sobre;
  const hasSobre = sobre && ((sobre.paragrafos?.length ?? 0) > 0 || (sobre.card?.bullets?.length ?? 0) > 0);
  const cols = (pontos && pontos.length >= 5 ? 5 : pontos && pontos.length <= 2 ? 2 : pontos?.length ?? 3) as 2 | 3 | 4 | 5;

  return (
    <div className="bl-prog min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6 py-10 md:gap-16 md:px-10 md:py-12">
        <RoteiroHero
          eyebrow={layout?.hero.eyebrow ?? t("routes.list.kicker")}
          titulo={layout?.hero.titulo ?? route.nome}
          tituloAccent={layout?.hero.tituloAccent}
          subtitulo={layout?.hero.subtitulo ?? route.descricao_curta ?? undefined}
          descricao={layout?.hero.descricao ?? route.descricao ?? undefined}
          image={<FillImage src={route.imagem_destaque} alt={route.nome} />}
          primaryCta={{ label: layout?.hero.ctaPrimaryLabel ?? t("routes.detail.viewMap"), icon: MapPin, href: "#mapa" }}
          secondaryCta={
            layout?.hero.ctaSecondaryLabel
              ? { label: layout.hero.ctaSecondaryLabel, icon: Bookmark }
              : undefined
          }
        />

        {layout?.stats?.length ? (
          <RoteiroStats
            items={layout.stats.map((s) => ({
              icon: resolveIcon(s.icon),
              label: s.label,
              value: s.value,
              description: s.descricao,
            }))}
          />
        ) : null}

        {hasSobre && (
          <section className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <SectionTitle title={sobre.titulo || t("routes.detail.aboutTitle")} className="mb-6" />
              <div className="flex flex-col gap-4">
                {sobre.paragrafos?.map((p, i) => (
                  <p key={i} className="m-0 text-[14.5px] leading-[1.7]" style={{ color: "var(--color-bl-prog-ink)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
            {sobre.card?.bullets?.length ? (
              <RoteiroInfoCard
                title={sobre.card.titulo}
                intro={sobre.card.descricao}
                columns={2}
                items={sobre.card.bullets.map((b) => ({
                  icon: resolveIcon(b.icon),
                  title: b.titulo,
                  description: b.descricao,
                }))}
              />
            ) : null}
          </section>
        )}

        {pontos?.length ? (
          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <SectionTitle title={layout?.destaquesTitulo || t("routes.detail.highlightsTitle")} />
              <a
                href="#mapa"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold no-underline"
                style={{ color: "var(--color-bl-prog-accent)" }}
              >
                {t("routes.detail.viewAllOnMap")} <ArrowRight size={15} />
              </a>
            </div>
            <PlaceCards
              columns={cols}
              items={pontos.map((p) => ({
                image: <FillImage src={p.imagem} alt={p.nome} />,
                title: p.nome,
                description: p.descricao ?? undefined,
                location: p.local ?? undefined,
              }))}
            />
          </section>
        ) : null}

        <section id="mapa">
          <SectionTitle title={t("routes.detail.mapTitle")} className="mb-6" />
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1.4fr_1fr] md:gap-8">
            <RoteiroMap
              mapaUrl={route.mapa_url}
              mapsLink={layout?.mapsLink ?? null}
              title={route.nome}
              openLabel={t("routes.detail.openInMaps")}
              emptyLabel={t("routes.detail.mapPlaceholder")}
            />
            {layout?.dicas?.items?.length ? (
              <RoteiroInfoCard
                title={layout.dicas.titulo || t("routes.detail.tipsTitle")}
                columns={1}
                items={layout.dicas.items.map((d) => ({
                  icon: resolveIcon(d.icon),
                  title: d.titulo,
                  description: d.descricao,
                }))}
              />
            ) : null}
          </div>
        </section>

        {layout?.bottomCta?.titulo ? (
          <BottomCTAStrip
            title={layout.bottomCta.titulo}
            description={layout.bottomCta.descricao}
            primaryCta={{ label: layout.bottomCta.label ?? t("routes.detail.otherRoutes"), icon: ArrowRight, href: "/roteiros" }}
            watermark={<Map size={120} strokeWidth={0.6} aria-hidden style={{ opacity: 0.4 }} />}
          />
        ) : null}
      </div>
    </div>
  );
}
