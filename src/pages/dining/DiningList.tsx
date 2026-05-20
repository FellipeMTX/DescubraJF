import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Car,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AspectImage } from "@/components/ui/AspectImage";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  DetailModal,
  ModalPill,
  ModalInfoRow,
  ModalContactLink,
  ModalScheduleList,
} from "@/components/ui/ListPageLayout";
import { FeaturedHero } from "@/components/listing/FeaturedHero";
import { FilterChips, FilterDropdown, ViewToggle } from "@/components/listing/Filters";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingHead, StatsStrip, CategoriesCallout, EmptyState } from "@/components/listing/Sections";
import { ListingMap } from "@/components/listing/ListingMap";
import { IMAGE_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useDiningEstablishments, useDiningCategories, useDiningBySlug } from "@/hooks/useDining";

export default function DiningList() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoria") ?? "todos");
  const [selectedHood, setSelectedHood] = useState("todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const listingHeadRef = useRef<HTMLDivElement>(null);

  const { data: allEstablishments, isLoading } = useDiningEstablishments();
  const { data: categories } = useDiningCategories();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: allEstablishments?.length ?? 0 };
    for (const e of allEstablishments ?? []) {
      for (const c of e.categorias ?? []) {
        counts[c.slug] = (counts[c.slug] ?? 0) + 1;
      }
    }
    return counts;
  }, [allEstablishments]);

  const bairros = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of allEstablishments ?? []) {
      if (e.bairro) map.set(e.bairro, (map.get(e.bairro) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [allEstablishments]);

  const filtered = useMemo(() => {
    return (allEstablishments ?? []).filter((e) => {
      if (selectedCategory !== "todos" && !e.categorias?.some((c) => c.slug === selectedCategory)) return false;
      if (selectedHood !== "todos" && e.bairro !== selectedHood) return false;
      return true;
    });
  }, [allEstablishments, selectedCategory, selectedHood]);

  const featured = useMemo(() => {
    if (!allEstablishments?.length) return null;
    return allEstablishments[0];
  }, [allEstablishments]);

  const stats = useMemo(() => {
    if (!allEstablishments?.length) return null;
    const cats = new Set(
      (allEstablishments ?? []).flatMap((e) => e.categorias?.map((c) => c.slug) ?? [])
    );
    return { total: allEstablishments.length, cats: cats.size };
  }, [allEstablishments]);

  const categoryItems = useMemo(
    () => (categories ?? []).map((c) => ({ name: c.nome, count: categoryCounts[c.slug] ?? 0 })),
    [categories, categoryCounts]
  );

  function handleFilterByCategoryName(name: string) {
    const cat = (categories ?? []).find((c) => c.nome === name);
    if (cat) setSelectedCategory(cat.slug);
    setTimeout(() => listingHeadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function clearFilters() {
    setSelectedCategory("todos");
    setSelectedHood("todos");
  }

  const filterOptions = [
    { value: "todos", label: t("common.all"), count: categoryCounts.todos ?? 0 },
    ...(categories ?? []).map((c) => ({
      value: c.slug,
      label: c.nome,
      count: categoryCounts[c.slug] ?? 0,
    })),
  ];

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12 max-md:px-6 max-md:py-8">
        <PageHeader
          kicker={t("dining.list.kicker")}
          title={t("dining.list.title")}
          highlight={t("dining.list.titleHighlight")}
          subtitle={t("dining.list.subtitle")}
        />

        {stats && (
          <StatsStrip
            items={[
              { value: <em>{stats.total}</em>, label: t("dining.list.stats.total") },
              {
                value: (<>{stats.cats} <em>{t("dining.list.stats.catsEm")}</em></>),
                label: t("dining.list.stats.catsLabel"),
              },
              {
                value: <em>{t("dining.list.stats.extras")}</em>,
                label: "",
              },
            ]}
          />
        )}

        {featured && (
          <FeaturedHero
            imageUrl={featured.imagem_destaque}
            badge={t("dining.list.featured")}
            title={featured.nome}
            accent={featured.categorias?.[0]?.nome ?? null}
            ctaLabel={t("dining.list.viewDining")}
            onOpen={() => setSelectedSlug(featured.slug)}
            meta={
              featured.bairro ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} />
                  {featured.bairro}
                </span>
              ) : null
            }
          />
        )}

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterChips options={filterOptions} selected={selectedCategory} onSelect={setSelectedCategory} />
          <div className="flex flex-wrap items-center gap-2.5">
            {bairros.length > 0 && (
              <FilterDropdown
                items={bairros}
                selected={selectedHood}
                allLabel={t("dining.list.allCategories")}
                onSelect={setSelectedHood}
              />
            )}
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        <ListingHead
          ref={listingHeadRef}
          title={t("dining.list.allDining")}
          highlight={t("dining.list.diningHighlight")}
          count={filtered.length}
          resultsLabel={t("dining.list.results")}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px]">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-3xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<UtensilsCrossed size={36} style={{ color: "var(--color-bl-accent)" }} />}
              message={t("dining.empty")}
              actionLabel={t("dining.list.clearFilters")}
              onAction={clearFilters}
            />
          ) : (
            <div
              className={cn(
                "grid gap-5",
                view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {filtered.map((est) => (
                <ListingCard
                  key={est.id}
                  imageUrl={est.imagem_destaque}
                  title={est.nome}
                  subtitle={est.bairro}
                  description={est.descricao_curta}
                  view={view}
                  isHovered={hoveredId === est.id}
                  onHover={() => setHoveredId(est.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedSlug(est.slug)}
                  placeholderIcon={<UtensilsCrossed size={36} style={{ color: "var(--color-bl-muted)" }} />}
                  badge={
                    est.categorias?.[0] ? (
                      <Badge className="bg-primary-700 text-accent-50">{est.categorias[0].nome}</Badge>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}

          <aside className="hidden lg:block">
            <div
              className="sticky top-24 overflow-hidden rounded-[28px] border"
              style={{
                background: "var(--color-bl-card)",
                borderColor: "rgba(36,21,16,0.08)",
                height: "calc(100vh - 120px)",
                maxHeight: 760,
              }}
            >
              <ListingMap
                items={filtered}
                activeId={hoveredId}
                onMarkerHover={setHoveredId}
                onMarkerClick={setSelectedSlug}
                ctaLabel={t("dining.list.viewDining")}
              />
            </div>
          </aside>
        </div>

        <CategoriesCallout
          title={t("dining.list.catsCalloutTitle")}
          highlight={t("dining.list.catsCalloutHighlight")}
          description={t("dining.list.catsCalloutDesc")}
          optionsLabel={t("dining.list.catsOptions")}
          items={categoryItems}
          onSelect={handleFilterByCategoryName}
        />
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => setSelectedSlug(null)}>
        {selectedSlug && <DiningModalContent slug={selectedSlug} />}
      </DetailModal>
    </div>
  );
}

function DiningModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: est, isLoading } = useDiningBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!est) return <p className="text-[var(--color-bl-muted)]">{t("dining.notFound")}</p>;

  const hasContact = est.contato && Object.values(est.contato).some(Boolean);
  const hasSchedule = est.horario_funcionamento && Object.keys(est.horario_funcionamento).length > 0;

  return (
    <>
      {est.imagem_destaque && (
        <AspectImage
          src={est.imagem_destaque}
          alt={est.nome}
          ratio={IMAGE_RATIOS.postCover}
          className="-mx-5 -mt-5 rounded-t-2xl"
        />
      )}
      <DialogHeader className="gap-1.5">
        {est.categorias && est.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {est.categorias.map((cat) => (
              <Badge key={cat.id} className="bg-primary-700 text-accent-50">{cat.nome}</Badge>
            ))}
          </div>
        )}
        <DialogTitle className="text-lg font-bold text-primary-800">{est.nome}</DialogTitle>
      </DialogHeader>
      {est.estacionamento && (
        <div className="flex flex-wrap gap-1.5">
          <ModalPill icon={<Car size={12} />}>{t("dining.amenities.parking")}</ModalPill>
        </div>
      )}
      {est.descricao && (
        <p className="text-sm leading-relaxed text-primary-700">{est.descricao}</p>
      )}
      <div className="space-y-2.5 border-t border-primary-100 pt-3">
        {hasSchedule && (
          <ModalInfoRow icon={<Clock size={14} />}>
            <ModalScheduleList schedule={est.horario_funcionamento!} />
          </ModalInfoRow>
        )}
        {est.endereco && (
          <ModalInfoRow icon={<MapPin size={14} />}>
            {est.endereco}{est.bairro && ` - ${est.bairro}`}
          </ModalInfoRow>
        )}
        {hasContact && (
          <div className="space-y-1">
            {est.contato?.telefone && <ModalContactLink href={`tel:${est.contato.telefone}`} icon={<Phone size={14} />}>{est.contato.telefone}</ModalContactLink>}
            {est.contato?.email && <ModalContactLink href={`mailto:${est.contato.email}`} icon={<Mail size={14} />}>{est.contato.email}</ModalContactLink>}
            {est.contato?.site && <ModalContactLink href={est.contato.site} icon={<Globe size={14} />} external>{t("dining.links.website")}</ModalContactLink>}
            {est.contato?.instagram && <ModalContactLink href={est.contato.instagram} icon={<ExternalLink size={14} />} external>{t("dining.links.instagram")}</ModalContactLink>}
          </div>
        )}
      </div>
    </>
  );
}
