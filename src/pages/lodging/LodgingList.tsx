import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BedDouble,
  ChevronDown,
  ExternalLink,
  Globe,
  LayoutGrid,
  LayoutList,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AspectImage } from "@/components/ui/AspectImage";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  DetailModal,
  ModalContactLink,
  ModalInfoRow,
} from "@/components/ui/ListPageLayout";
import { LodgingMap } from "@/components/lodging/LodgingMap";
import { IMAGE_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLodgingEstablishments, useLodgingBySlug } from "@/hooks/useLodging";
import type { Hospedagem } from "@/types/database";

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

  const featured = useMemo(() => {
    if (!allLodgings?.length) return null;
    return allLodgings.find((l) => l.destaque) ?? allLodgings[0];
  }, [allLodgings]);

  const stats = useMemo(() => {
    if (!allLodgings?.length) return null;
    const types = new Set(allLodgings.map((l) => l.tipo));
    const hoods = new Set(allLodgings.filter((l) => l.bairro).map((l) => l.bairro));
    const maxStars = Math.max(0, ...allLodgings.map((l) => l.estrelas ?? 0));
    return { total: allLodgings.length, types: types.size, bairros: hoods.size, maxStars };
  }, [allLodgings]);

  function handleFilterByHood(name: string) {
    setSelectedHood(name);
    setTimeout(() => listingHeadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function clearFilters() {
    setSelectedType("todos");
    setSelectedHood("todos");
  }

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12 max-md:px-6 max-md:py-8">
        <PageHeader
          kicker={t("lodging.list.kicker")}
          title={t("lodging.list.title")}
          highlight={t("lodging.list.titleHighlight")}
          subtitle={t("lodging.list.subtitle")}
        />

        {stats && <StatsStrip stats={stats} />}

        {featured && <FeaturedHero lodging={featured} onOpen={() => setSelectedSlug(featured.slug)} />}

        {/* Filters */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {TYPE_VALUES.map((value) => {
              const active = value === selectedType;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedType(value)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                    active ? "border-transparent" : "border-black/12 hover:border-bl-ink"
                  )}
                  style={{
                    background: active ? "var(--color-bl-ink)" : "transparent",
                    color: active ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t(TYPE_KEY_MAP[value])}
                  <span className="ml-1.5 text-[11px] opacity-60">{typeCounts[value] ?? 0}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <BairroDropdown
              bairros={bairros}
              selected={selectedHood}
              onSelect={setSelectedHood}
            />
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        {/* Listing head */}
        <div ref={listingHeadRef} className="mb-6 mt-14 flex items-baseline justify-between gap-4">
          <h2
            className="bl-display m-0 font-normal"
            style={{ fontSize: "clamp(24px, 2.4vw, 32px)" }}
          >
            {t("lodging.list.allLodgings")}{" "}
            <span className="bl-em">{t("lodging.list.lodgingsHighlight")}</span>
          </h2>
          <span
            className="text-sm"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bl-muted)" }}
          >
            <em
              style={{
                color: "var(--color-bl-ink)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              {filtered.length}
            </em>{" "}
            {t("lodging.list.results")}
          </span>
        </div>

        {/* Map + listing */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px]">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-3xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center"
              style={{ background: "var(--color-bl-card)", color: "var(--color-bl-muted)" }}
            >
              <BedDouble size={36} style={{ color: "var(--color-bl-accent)" }} />
              <p
                className="m-0"
                style={{ fontFamily: "var(--font-display)", fontSize: 18 }}
              >
                {t("lodging.empty")}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-bl-ink hover:text-bl-bg"
                style={{ borderColor: "rgba(0,0,0,0.18)", color: "var(--color-bl-ink)" }}
              >
                {t("lodging.list.clearFilters")}
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "lodging-grid grid gap-5",
                view === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {filtered.map((lodging) => (
                <LodgeCard
                  key={lodging.id}
                  lodging={lodging}
                  view={view}
                  isHovered={hoveredId === lodging.id}
                  onHover={() => setHoveredId(lodging.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedSlug(lodging.slug)}
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
              <LodgingMap
                items={filtered}
                activeId={hoveredId}
                onMarkerHover={setHoveredId}
                onMarkerClick={setSelectedSlug}
              />
            </div>
          </aside>
        </div>

        {/* Neighborhoods callout */}
        {bairros.length > 0 && (
          <NeighborhoodsCallout
            bairros={bairros}
            onSelect={handleFilterByHood}
          />
        )}
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => setSelectedSlug(null)}>
        {selectedSlug && <LodgingModalContent slug={selectedSlug} />}
      </DetailModal>
    </div>
  );
}

function StatsStrip({ stats }: { stats: { total: number; types: number; bairros: number; maxStars: number } }) {
  const { t } = useTranslation();
  const items = [
    { value: <em>{stats.total}</em>, label: t("lodging.list.stats.total") },
    {
      value: (
        <>
          {stats.types} <em>{t("lodging.list.stats.typesEm")}</em>
        </>
      ),
      label: t("lodging.list.stats.typesLabel"),
    },
    {
      value: (
        <>
          {stats.bairros} <em>{t("lodging.list.stats.hoodsEm")}</em>
        </>
      ),
      label: t("lodging.list.stats.hoodsLabel"),
    },
    {
      value: <em>{"★".repeat(Math.max(1, stats.maxStars))}</em>,
      label: t("lodging.list.stats.stars"),
    },
  ];
  return (
    <div
      className="mt-9 grid grid-cols-2 overflow-hidden rounded-3xl md:grid-cols-4"
      style={{ background: "var(--color-bl-card)", border: "1px solid rgba(36,21,16,0.08)" }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className="p-6 max-md:p-5"
          style={{
            borderRight: i === items.length - 1 ? undefined : "1px solid rgba(36,21,16,0.08)",
            borderBottom: i < 2 ? "1px solid rgba(36,21,16,0.08)" : undefined,
          }}
        >
          <div
            className="bl-display leading-none"
            style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
          >
            <span className="[&_em]:bl-em [&_em]:font-normal">{it.value}</span>
          </div>
          <div
            className="mt-2 text-[11px] font-semibold uppercase"
            style={{ letterSpacing: "0.16em", color: "var(--color-bl-muted)" }}
          >
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedHero({ lodging, onOpen }: { lodging: Hospedagem; onOpen: () => void }) {
  const { t } = useTranslation();
  return (
    <section
      className="relative mt-10 overflow-hidden rounded-[32px]"
      style={{ background: "var(--color-bl-card)", minHeight: 480 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: lodging.imagem_destaque ? `url(${lodging.imagem_destaque})` : undefined }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(36,21,16,0.05) 0%, rgba(36,21,16,0.18) 50%, rgba(36,21,16,0.85) 100%)",
        }}
      />
      <div
        className="relative z-10 flex flex-col justify-end gap-6 p-12 text-white max-md:p-7"
        style={{ minHeight: 480 }}
      >
        <span
          className="mr-auto inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-widest"
          style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-bl-ink)" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-bl-accent)" }}
          />
          {t("lodging.list.featured")}
        </span>
        <h2
          className="bl-display m-0 max-w-[18ch]"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          {lodging.nome}
          {lodging.bairro && (
            <>
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-bl-accent2)" }}>
                {lodging.bairro}
              </em>
            </>
          )}
        </h2>
        <div className="flex flex-wrap gap-5 text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>
          {lodging.estrelas && (
            <span
              className="inline-flex items-center gap-2"
              style={{ color: "var(--color-bl-accent2)", letterSpacing: 1 }}
            >
              {"★".repeat(lodging.estrelas)}
            </span>
          )}
          {lodging.bairro && (
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} />
              {lodging.bairro}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:-translate-y-px"
            style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)", fontFamily: "var(--font-display)" }}
          >
            {t("lodging.list.viewLodging")}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

function ViewToggle({ value, onChange }: { value: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  const { t } = useTranslation();
  const items: { v: "grid" | "list"; icon: typeof LayoutGrid; label: string }[] = [
    { v: "grid", icon: LayoutGrid, label: t("lodging.list.viewGrid") },
    { v: "list", icon: LayoutList, label: t("lodging.list.viewList") },
  ];
  return (
    <div
      className="inline-flex rounded-full p-1"
      style={{ background: "var(--color-bl-card)" }}
    >
      {items.map(({ v, icon: Icon, label }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
            style={{
              background: active ? "var(--color-bl-bg)" : "transparent",
              color: active ? "var(--color-bl-ink)" : "var(--color-bl-muted)",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : undefined,
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function BairroDropdown({
  bairros,
  selected,
  onSelect,
}: {
  bairros: { name: string; count: number }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = selected === "todos" ? t("lodging.list.allHoods") : selected;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const hasValue = selected !== "todos";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-medium transition-colors",
          hasValue ? "border-transparent" : "border-black/12 hover:border-bl-ink"
        )}
        style={{
          background: hasValue ? "var(--color-bl-card)" : "transparent",
          color: "var(--color-bl-ink)",
        }}
      >
        {hasValue && (
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-bl-accent)" }}
          />
        )}
        <MapPin size={14} />
        <span>{label}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute right-0 z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-2xl border border-black/10 p-1 shadow-xl"
          style={{ background: "var(--color-bl-bg)" }}
        >
          <button
            type="button"
            onClick={() => { onSelect("todos"); setOpen(false); }}
            className="block w-full cursor-pointer rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors"
            style={{
              background: selected === "todos" ? "var(--color-bl-card)" : "transparent",
              color: "var(--color-bl-ink)",
            }}
          >
            {t("lodging.list.allHoods")}
          </button>
          {bairros.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => { onSelect(b.name); setOpen(false); }}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors"
              style={{
                background: selected === b.name ? "var(--color-bl-card)" : "transparent",
                color: "var(--color-bl-ink)",
              }}
            >
              <span>{b.name}</span>
              <span className="text-xs" style={{ color: "var(--color-bl-muted)" }}>
                {b.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LodgeCard({
  lodging,
  view,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  lodging: Hospedagem;
  view: "grid" | "list";
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const isList = view === "list";
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "lodge-card group relative flex cursor-pointer overflow-hidden rounded-3xl border text-left transition-all",
        isList ? "flex-row max-sm:flex-col" : "flex-col",
        isHovered && "lodge-card-active"
      )}
      style={{
        background: "var(--color-bl-bg)",
        borderColor: isHovered ? "var(--color-bl-accent)" : "rgba(36,21,16,0.06)",
        boxShadow: isHovered ? "0 0 0 2px var(--color-bl-accent), 0 20px 48px -16px rgba(36,21,16,0.18)" : undefined,
        transform: isHovered ? "translateY(-4px)" : undefined,
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isList ? "shrink-0 basis-[38%] max-sm:aspect-[4/3] max-sm:basis-auto" : "aspect-[4/3]"
        )}
        style={{ background: "var(--color-bl-card)" }}
      >
        {lodging.imagem_destaque ? (
          <img
            src={lodging.imagem_destaque}
            alt={lodging.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BedDouble size={36} style={{ color: "var(--color-bl-muted)" }} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="bl-display m-0 font-medium"
            style={{ fontSize: 22, lineHeight: 1.15 }}
          >
            {lodging.nome}
          </h3>
          {lodging.estrelas && (
            <span
              className="mt-0.5 inline-flex shrink-0 gap-px text-[13px]"
              style={{ color: "var(--color-bl-accent2)", letterSpacing: 1 }}
            >
              {Array.from({ length: lodging.estrelas }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" stroke="none" />
              ))}
            </span>
          )}
        </div>

        {lodging.bairro && (
          <span
            className="inline-flex items-center gap-1.5 text-[13px]"
            style={{ color: "var(--color-bl-muted)", fontFamily: "var(--font-display)" }}
          >
            <MapPin size={13} />
            {lodging.bairro}
          </span>
        )}

        {lodging.descricao_curta && (
          <p
            className="m-0 flex-1 text-[13px] italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
              lineHeight: 1.55,
            }}
          >
            {lodging.descricao_curta}
          </p>
        )}

        <div
          className="mt-auto flex items-center justify-between pt-3.5"
          style={{
            borderTop: "1px dashed rgba(36,21,16,0.12)",
            fontFamily: "var(--font-display)",
          }}
        >
          <span className="text-[13px] font-medium" style={{ color: "var(--color-bl-ink)" }}>
            {t("lodging.list.viewDetails")}
          </span>
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all group-hover:translate-x-1"
            style={{
              background: isHovered ? "var(--color-bl-ink)" : "var(--color-bl-card)",
              color: isHovered ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
            }}
          >
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}

function NeighborhoodsCallout({
  bairros,
  onSelect,
}: {
  bairros: { name: string; count: number }[];
  onSelect: (name: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <section
      className="relative mt-20 overflow-hidden rounded-3xl px-12 py-14 max-md:px-7 max-md:py-10"
      style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }}
    >
      <h2
        className="bl-display m-0 mb-3 max-w-[18ch]"
        style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
      >
        {t("lodging.list.hoodsCalloutTitle")}{" "}
        <em style={{ fontStyle: "italic", color: "var(--color-bl-accent2)" }}>
          {t("lodging.list.hoodsCalloutHighlight")}
        </em>
      </h2>
      <p
        className="m-0 mb-9 max-w-[50ch] leading-[1.7]"
        style={{ color: "rgba(247,238,226,0.7)" }}
      >
        {t("lodging.list.hoodsCalloutDesc")}
      </p>
      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {bairros.map((b) => (
          <button
            key={b.name}
            type="button"
            onClick={() => onSelect(b.name)}
            className="cursor-pointer rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(247,238,226,0.06)",
              borderColor: "rgba(247,238,226,0.1)",
            }}
          >
            <div
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.018em" }}
            >
              {b.name}
            </div>
            <div
              className="mt-1.5 flex gap-3 text-xs"
              style={{ color: "rgba(247,238,226,0.55)", fontFamily: "var(--font-display)" }}
            >
              <span>
                <strong
                  style={{
                    color: "var(--color-bl-accent2)",
                    fontWeight: 500,
                    fontStyle: "italic",
                  }}
                >
                  {b.count}
                </strong>{" "}
                {t("lodging.list.hoodsOptions")}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
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
        {lodging.estrelas && (
          <StarRating value={lodging.estrelas} size={14} className="text-primary-400" />
        )}
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
