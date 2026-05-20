import { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  BedDouble,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AspectImage } from "@/components/ui/AspectImage";
import { PageHeader } from "@/components/ui/PageHeader";
import { DetailModal, ModalContactLink, ModalInfoRow } from "@/components/ui/ListPageLayout";
import { FilterChips, FilterDropdown, ViewToggle } from "@/components/listing/Filters";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingHead, StatsStrip, CategoriesCallout, EmptyState } from "@/components/listing/Sections";
import { ListingMap } from "@/components/listing/ListingMap";
import { IMAGE_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLodgingEstablishments, useLodgingBySlug } from "@/hooks/useLodging";

const TYPE_VALUES = ["todos", "hotel", "pousada", "hostel", "flat"] as const;
type TypeValue = (typeof TYPE_VALUES)[number];
const TYPE_KEY_MAP: Record<TypeValue, string> = {
  todos: "lodging.types.all",
  hotel: "lodging.types.hotel",
  pousada: "lodging.types.pousada",
  hostel: "lodging.types.hostel",
  flat: "lodging.types.flat",
};

export default function LodgingList() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<TypeValue>("todos");
  const [selectedHood, setSelectedHood] = useState<string>("todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const listingHeadRef = useRef<HTMLDivElement>(null);

  const { data: allLodgings, isLoading } = useLodgingEstablishments();

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: allLodgings?.length ?? 0 };
    for (const l of allLodgings ?? []) counts[l.tipo] = (counts[l.tipo] ?? 0) + 1;
    return counts;
  }, [allLodgings]);

  const bairros = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of allLodgings ?? []) {
      if (l.bairro) map.set(l.bairro, (map.get(l.bairro) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [allLodgings]);

  const filtered = useMemo(() => {
    return (allLodgings ?? []).filter((l) => {
      if (selectedType !== "todos" && l.tipo !== selectedType) return false;
      if (selectedHood !== "todos" && l.bairro !== selectedHood) return false;
      return true;
    });
  }, [allLodgings, selectedType, selectedHood]);

  const stats = useMemo(() => {
    if (!allLodgings?.length) return null;
    const types = new Set(allLodgings.map((l) => l.tipo));
    const hoods = new Set(allLodgings.filter((l) => l.bairro).map((l) => l.bairro));
    return { total: allLodgings.length, types: types.size, bairros: hoods.size };
  }, [allLodgings]);

  function handleFilterByHood(name: string) {
    setSelectedHood(name);
    setTimeout(() => listingHeadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function clearFilters() {
    setSelectedType("todos");
    setSelectedHood("todos");
  }

  const filterOptions = TYPE_VALUES.map((value) => ({
    value,
    label: t(TYPE_KEY_MAP[value]),
    count: typeCounts[value] ?? 0,
  }));

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12 max-md:px-6 max-md:py-8">
        <PageHeader
          kicker={t("lodging.list.kicker")}
          title={t("lodging.list.title")}
          highlight={t("lodging.list.titleHighlight")}
          subtitle={t("lodging.list.subtitle")}
        />

        {stats && (
          <StatsStrip
            items={[
              { value: <em>{stats.total}</em>, label: t("lodging.list.stats.total") },
              {
                value: (<>{stats.types} <em>{t("lodging.list.stats.typesEm")}</em></>),
                label: t("lodging.list.stats.typesLabel"),
              },
              {
                value: (<>{stats.bairros} <em>{t("lodging.list.stats.hoodsEm")}</em></>),
                label: t("lodging.list.stats.hoodsLabel"),
              },
            ]}
          />
        )}

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterChips options={filterOptions} selected={selectedType} onSelect={(v) => setSelectedType(v as TypeValue)} />
          <div className="flex flex-wrap items-center gap-2.5">
            <FilterDropdown
              items={bairros}
              selected={selectedHood}
              allLabel={t("lodging.list.allHoods")}
              onSelect={setSelectedHood}
            />
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        <ListingHead
          ref={listingHeadRef}
          title={t("lodging.list.allLodgings")}
          highlight={t("lodging.list.lodgingsHighlight")}
          count={filtered.length}
          resultsLabel={t("lodging.list.results")}
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
              icon={<BedDouble size={36} style={{ color: "var(--color-bl-accent)" }} />}
              message={t("lodging.empty")}
              actionLabel={t("lodging.list.clearFilters")}
              onAction={clearFilters}
            />
          ) : (
            <div
              className={cn(
                "grid gap-5",
                view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {filtered.map((lodging) => (
                <ListingCard
                  key={lodging.id}
                  imageUrl={lodging.imagem_destaque}
                  title={lodging.nome}
                  subtitle={lodging.bairro}
                  description={lodging.descricao_curta}
                  view={view}
                  isHovered={hoveredId === lodging.id}
                  onHover={() => setHoveredId(lodging.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedSlug(lodging.slug)}
                  placeholderIcon={<BedDouble size={36} style={{ color: "var(--color-bl-muted)" }} />}
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
                ctaLabel={t("lodging.list.viewDetails")}
              />
            </div>
          </aside>
        </div>

        <CategoriesCallout
          title={t("lodging.list.hoodsCalloutTitle")}
          highlight={t("lodging.list.hoodsCalloutHighlight")}
          description={t("lodging.list.hoodsCalloutDesc")}
          optionsLabel={t("lodging.list.hoodsOptions")}
          items={bairros}
          onSelect={handleFilterByHood}
        />
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => setSelectedSlug(null)}>
        {selectedSlug && <LodgingModalContent slug={selectedSlug} />}
      </DetailModal>
    </div>
  );
}

function LodgingModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: lodging, isLoading } = useLodgingBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!lodging) return <p className="text-[var(--color-bl-muted)]">{t("lodging.notFound")}</p>;

  const hasContact = lodging.contato && Object.values(lodging.contato).some(Boolean);

  return (
    <>
      {lodging.imagem_destaque && (
        <AspectImage
          src={lodging.imagem_destaque}
          alt={lodging.nome}
          ratio={IMAGE_RATIOS.postCover}
          className="-mx-5 -mt-5 rounded-t-2xl"
        />
      )}
      <DialogHeader className="gap-1.5">
        <Badge className="w-fit bg-primary-700 text-accent-50 capitalize">{lodging.tipo}</Badge>
        <DialogTitle className="text-lg font-bold text-primary-800">{lodging.nome}</DialogTitle>
      </DialogHeader>
      {lodging.imagens && lodging.imagens.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5">
          {lodging.imagens.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt={`${lodging.nome} - ${i + 1}`} className="aspect-square w-full rounded-md object-cover" />
          ))}
        </div>
      )}
      {lodging.descricao && (
        <p className="text-sm leading-relaxed text-primary-700">{lodging.descricao}</p>
      )}
      <div className="space-y-2.5 border-t border-primary-100 pt-3">
        {lodging.endereco && (
          <ModalInfoRow icon={<MapPin size={14} />}>
            {lodging.endereco}{lodging.bairro && ` - ${lodging.bairro}`}
          </ModalInfoRow>
        )}
        {hasContact && (
          <div className="space-y-1">
            {lodging.contato?.telefone && <ModalContactLink href={`tel:${lodging.contato.telefone}`} icon={<Phone size={14} />}>{lodging.contato.telefone}</ModalContactLink>}
            {lodging.contato?.email && <ModalContactLink href={`mailto:${lodging.contato.email}`} icon={<Mail size={14} />}>{lodging.contato.email}</ModalContactLink>}
            {lodging.contato?.site && <ModalContactLink href={lodging.contato.site} icon={<Globe size={14} />} external>{t("lodging.links.website")}</ModalContactLink>}
            {lodging.contato?.booking_url && (
              <a href={lodging.contato.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600">
                <ExternalLink size={14} /> {t("lodging.links.booking")}
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
