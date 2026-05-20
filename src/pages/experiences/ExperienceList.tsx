import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accessibility,
  Clock,
  Dog,
  DollarSign,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useExperiences, useExperienceCategories, useExperienceBySlug } from "@/hooks/useExperiences";

export default function ExperienceList() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedHood, setSelectedHood] = useState("todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const listingHeadRef = useRef<HTMLDivElement>(null);

  const { data: allExperiences, isLoading } = useExperiences();
  const { data: categories } = useExperienceCategories();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: allExperiences?.length ?? 0 };
    for (const e of allExperiences ?? []) {
      if (e.categoria?.slug) counts[e.categoria.slug] = (counts[e.categoria.slug] ?? 0) + 1;
    }
    return counts;
  }, [allExperiences]);

  const bairros = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of allExperiences ?? []) {
      if (e.bairro) map.set(e.bairro, (map.get(e.bairro) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [allExperiences]);

  const filtered = useMemo(() => {
    return (allExperiences ?? []).filter((e) => {
      if (selectedCategory !== "todos" && e.categoria?.slug !== selectedCategory) return false;
      if (selectedHood !== "todos" && e.bairro !== selectedHood) return false;
      return true;
    });
  }, [allExperiences, selectedCategory, selectedHood]);

  const featured = useMemo(() => {
    if (!allExperiences?.length) return null;
    return allExperiences.find((e) => e.destaque) ?? allExperiences[0];
  }, [allExperiences]);

  const stats = useMemo(() => {
    if (!allExperiences?.length) return null;
    const cats = new Set(allExperiences.map((e) => e.categoria?.slug).filter(Boolean));
    const free = allExperiences.filter((e) => e.gratuito).length;
    return { total: allExperiences.length, cats: cats.size, free };
  }, [allExperiences]);

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
          kicker={t("experiences.list.kicker")}
          title={t("experiences.list.title")}
          highlight={t("experiences.list.titleHighlight")}
          subtitle={t("experiences.list.subtitle")}
        />

        {stats && (
          <StatsStrip
            items={[
              { value: <em>{stats.total}</em>, label: t("experiences.list.stats.total") },
              {
                value: (<>{stats.cats} <em>{t("experiences.list.stats.catsEm")}</em></>),
                label: t("experiences.list.stats.catsLabel"),
              },
              {
                value: (<>{stats.free} <em>{t("experiences.list.stats.freeEm")}</em></>),
                label: t("experiences.list.stats.freeLabel"),
              },
              {
                value: <em>{t("experiences.list.stats.features")}</em>,
                label: "",
              },
            ]}
          />
        )}

        {featured && (
          <FeaturedHero
            imageUrl={featured.imagem_destaque}
            badge={t("experiences.list.featured")}
            title={featured.nome}
            accent={featured.categoria?.nome ?? null}
            ctaLabel={t("experiences.list.viewExperience")}
            onOpen={() => setSelectedSlug(featured.slug)}
            meta={
              <>
                {featured.gratuito && (
                  <span className="inline-flex items-center gap-2">
                    <DollarSign size={14} />
                    {t("experiences.badges.free")}
                  </span>
                )}
                {featured.bairro && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} />
                    {featured.bairro}
                  </span>
                )}
              </>
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
                allLabel={t("experiences.list.allCategories")}
                onSelect={setSelectedHood}
              />
            )}
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        <ListingHead
          ref={listingHeadRef}
          title={t("experiences.list.allExperiences")}
          highlight={t("experiences.list.experiencesHighlight")}
          count={filtered.length}
          resultsLabel={t("experiences.list.results")}
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
              icon={<MapPin size={36} style={{ color: "var(--color-bl-accent)" }} />}
              message={t("experiences.empty")}
              actionLabel={t("experiences.list.clearFilters")}
              onAction={clearFilters}
            />
          ) : (
            <div
              className={cn(
                "grid gap-5",
                view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {filtered.map((exp) => (
                <ListingCard
                  key={exp.id}
                  imageUrl={exp.imagem_destaque}
                  title={exp.nome}
                  subtitle={exp.bairro}
                  description={exp.descricao_curta}
                  view={view}
                  isHovered={hoveredId === exp.id}
                  onHover={() => setHoveredId(exp.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedSlug(exp.slug)}
                  placeholderIcon={<MapPin size={36} style={{ color: "var(--color-bl-muted)" }} />}
                  badge={
                    exp.categoria ? (
                      <Badge
                        className="text-accent-50"
                        style={{ backgroundColor: exp.categoria.cor ?? "var(--color-primary-400)" }}
                      >
                        {exp.categoria.nome}
                      </Badge>
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
                ctaLabel={t("experiences.list.viewExperience")}
              />
            </div>
          </aside>
        </div>

        <CategoriesCallout
          title={t("experiences.list.catsCalloutTitle")}
          highlight={t("experiences.list.catsCalloutHighlight")}
          description={t("experiences.list.catsCalloutDesc")}
          optionsLabel={t("experiences.list.catsOptions")}
          items={categoryItems}
          onSelect={handleFilterByCategoryName}
        />
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => setSelectedSlug(null)}>
        {selectedSlug && <ExperienceModalContent slug={selectedSlug} />}
      </DetailModal>
    </div>
  );
}

function ExperienceModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: exp, isLoading } = useExperienceBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!exp) return <p className="text-[var(--color-bl-muted)]">{t("experiences.notFound")}</p>;

  const hasContact = exp.contato && Object.values(exp.contato).some(Boolean);
  const hasSchedule = exp.horario_funcionamento && Object.keys(exp.horario_funcionamento).length > 0;

  return (
    <>
      {exp.imagem_destaque && (
        <AspectImage
          src={exp.imagem_destaque}
          alt={exp.nome}
          ratio={IMAGE_RATIOS.postCover}
          className="-mx-5 -mt-5 rounded-t-2xl"
        />
      )}
      <DialogHeader className="gap-1.5">
        {exp.categoria && (
          <Badge
            className="w-fit text-accent-50"
            style={{ backgroundColor: exp.categoria.cor ?? "var(--color-primary-400)" }}
          >
            {exp.categoria.nome}
          </Badge>
        )}
        <DialogTitle className="text-lg font-bold text-primary-800">{exp.nome}</DialogTitle>
      </DialogHeader>
      {(exp.gratuito || exp.acessibilidade || exp.pet_friendly) && (
        <div className="flex flex-wrap gap-1.5">
          {exp.gratuito && <ModalPill icon={<DollarSign size={12} />}>{t("experiences.badges.free")}</ModalPill>}
          {exp.acessibilidade && <ModalPill icon={<Accessibility size={12} />}>{t("experiences.badges.accessible")}</ModalPill>}
          {exp.pet_friendly && <ModalPill icon={<Dog size={12} />}>{t("experiences.badges.petFriendly")}</ModalPill>}
        </div>
      )}
      {exp.descricao && (
        <p className="text-sm leading-relaxed text-primary-700">{exp.descricao}</p>
      )}
      <div className="space-y-2.5 border-t border-primary-100 pt-3">
        {hasSchedule && (
          <ModalInfoRow icon={<Clock size={14} />}>
            <ModalScheduleList schedule={exp.horario_funcionamento!} />
          </ModalInfoRow>
        )}
        {exp.endereco && (
          <ModalInfoRow icon={<MapPin size={14} />}>
            {exp.endereco}{exp.bairro && ` - ${exp.bairro}`}
          </ModalInfoRow>
        )}
        {hasContact && (
          <div className="space-y-1">
            {exp.contato?.telefone && <ModalContactLink href={`tel:${exp.contato.telefone}`} icon={<Phone size={14} />}>{exp.contato.telefone}</ModalContactLink>}
            {exp.contato?.email && <ModalContactLink href={`mailto:${exp.contato.email}`} icon={<Mail size={14} />}>{exp.contato.email}</ModalContactLink>}
            {exp.contato?.site && <ModalContactLink href={exp.contato.site} icon={<Globe size={14} />} external>{t("experiences.links.website")}</ModalContactLink>}
            {exp.contato?.instagram && <ModalContactLink href={exp.contato.instagram} icon={<ExternalLink size={14} />} external>{t("experiences.links.instagram")}</ModalContactLink>}
          </div>
        )}
      </div>
      {exp.contato?.maps_link && (
        <a href={exp.contato.maps_link} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <MapPin size={14} /> {t("experiences.links.googleMaps")}
          </Button>
        </a>
      )}
    </>
  );
}
