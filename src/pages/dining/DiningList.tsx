import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DescriptionText } from "@/components/ui/DescriptionText";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AspectImage } from "@/components/ui/AspectImage";
import {
  DetailModal,
  ModalPill,
  ModalInfoRow,
  ModalContactLink,
  ModalScheduleList,
} from "@/components/ui/ListPageLayout";
import { FilterDropdown, ViewToggle } from "@/components/listing/Filters";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingHead, CategoriesCallout, EmptyState } from "@/components/listing/Sections";
import { ListingMap } from "@/components/listing/ListingMap";
import { getIconByName } from "@/components/ui/IconPicker";
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
  const catsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const stats = useMemo(() => {
    if (!allEstablishments?.length) return null;
    const cats = new Set(
      (allEstablishments ?? []).flatMap((e) => e.categorias?.map((c) => c.slug) ?? [])
    );
    const hoods = new Set((allEstablishments ?? []).filter((e) => e.bairro).map((e) => e.bairro));
    return { total: allEstablishments.length, cats: cats.size, hoods: hoods.size };
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

  function scrollToListing() {
    listingHeadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollChips(dir: "left" | "right") {
    const el = catsScrollRef.current;
    if (!el) return;
    const amount = Math.max(240, el.clientWidth * 0.8);
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  useEffect(() => {
    const el = catsScrollRef.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < maxScroll - 4);
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [categories]);

  return (
    <div className="bl-app min-h-screen">
      {/* Hero banner — full bleed com stats overlay */}
      <div className="relative w-full">
        <div className="overflow-hidden">
          <img
            src="/ondeComerBanner2.png"
            alt={t("dining.list.title")}
            className="block h-auto w-full"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247,238,226,0) 0%, rgba(247,238,226,0.6) 60%, var(--color-bl-bg) 100%)",
          }}
        />

        {stats && (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 px-6 max-md:bottom-5 max-md:px-4">
            <div className="pointer-events-auto mx-auto max-w-4xl">
              <div
                className="grid grid-cols-3 overflow-hidden rounded-2xl border shadow-[0_20px_50px_-18px_rgba(0,0,0,0.32)] backdrop-blur-md"
                style={{
                  background: "rgba(36,21,16,0.18)",
                  borderColor: "rgba(255,255,255,0.22)",
                }}
              >
                <HeroStat
                  icon={<UtensilsCrossed size={22} />}
                  value={stats.total}
                  label={t("dining.list.stats.total")}
                  sublabel={t("dining.list.stats.extras")}
                />
                <HeroStat
                  icon={<Layers size={22} />}
                  value={stats.cats}
                  label={t("dining.list.stats.catsEm")}
                  sublabel={t("dining.list.stats.catsLabel")}
                  divider
                />
                <HeroStat
                  icon={<MapPin size={22} />}
                  value={stats.hoods}
                  label={t("dining.list.stats.hoodsEm")}
                  sublabel={t("dining.list.stats.hoodsLabel")}
                  divider
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-14 pt-6 pb-12 max-md:px-6 max-md:pt-4 max-md:pb-8 max-sm:pt-3 max-sm:pb-6">
        {/* Categorias — chips horizontais */}
        {(categories ?? []).length > 0 && (
          <section className="relative">
            <div
              ref={catsScrollRef}
              className="-mx-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex gap-3 px-2">
                <CategoryChip
                  active={selectedCategory === "todos"}
                  label={t("common.all")}
                  count={categoryCounts.todos ?? 0}
                  icon={<Sparkles size={22} />}
                  onClick={() => {
                    setSelectedCategory("todos");
                    scrollToListing();
                  }}
                />
                {(categories ?? []).map((cat) => {
                  const Icon = getIconByName(cat.icone);
                  return (
                    <CategoryChip
                      key={cat.id}
                      active={selectedCategory === cat.slug}
                      label={cat.nome}
                      count={categoryCounts[cat.slug] ?? 0}
                      icon={Icon ? <Icon size={22} /> : <UtensilsCrossed size={22} />}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        scrollToListing();
                      }}
                    />
                  );
                })}
              </div>
            </div>
            {/* Botões de scroll */}
            <ScrollArrow
              direction="left"
              visible={canScrollLeft}
              onClick={() => scrollChips("left")}
            />
            <ScrollArrow
              direction="right"
              visible={canScrollRight}
              onClick={() => scrollChips("right")}
            />
          </section>
        )}

        {/* Filtros de bairro + view toggle */}
        <div className="mt-16 grid grid-cols-2 gap-2.5 lg:flex lg:items-center lg:justify-between">
          {bairros.length > 0 ? (
            <FilterDropdown
              items={bairros}
              selected={selectedHood}
              allLabel={t("dining.list.allHoods")}
              onSelect={setSelectedHood}
            />
          ) : (
            <span />
          )}
          <ViewToggle value={view} onChange={setView} />
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

function ScrollArrow({
  direction,
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Categorias anteriores" : "Próximas categorias"}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-bl-bg text-bl-ink shadow-md transition-all duration-200",
        "hover:scale-105 hover:bg-bl-accent hover:text-white",
        "max-md:h-9 max-md:w-9",
        direction === "left" ? "left-1 max-md:-left-1" : "right-1 max-md:-right-1",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      style={{ borderColor: "rgba(36,21,16,0.12)" }}
    >
      {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}

function HeroStat({
  icon,
  value,
  label,
  sublabel,
  divider,
}: {
  icon?: React.ReactNode;
  value: number;
  label: string;
  sublabel?: string;
  divider?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 p-5 max-md:gap-2.5 max-md:p-3.5 max-sm:gap-2 max-sm:p-2.5"
      style={{
        borderLeft: divider ? "1px solid rgba(255,255,255,0.14)" : undefined,
      }}
    >
      {icon && (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl max-md:h-9 max-md:w-9 max-sm:hidden"
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "rgba(247,238,226,0.95)",
          }}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div
          className="bl-display leading-none"
          style={{ fontSize: "clamp(17px, 2.55vw, 31px)", color: "rgba(247,238,226,0.98)" }}
        >
          {value}
        </div>
        <div
          className="mt-1 font-semibold uppercase"
          style={{ fontSize: "clamp(7px, 0.9vw, 9.5px)", letterSpacing: "0.18em", color: "rgba(247,238,226,0.88)" }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            className="mt-0.5 font-medium uppercase max-sm:hidden"
            style={{ fontSize: "clamp(7px, 0.77vw, 8.5px)", letterSpacing: "0.14em", color: "rgba(247,238,226,0.55)" }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  label,
  count,
  icon,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  icon: React.ReactNode;
  color?: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className={cn(
        "group/chip flex min-w-30 shrink-0 cursor-pointer flex-col items-center gap-2 rounded-2xl border px-4 py-3 text-center transition-all duration-300 max-md:min-w-27 max-md:px-3 max-md:py-2.5 max-sm:min-w-24 max-sm:gap-1.5 max-sm:px-2.5 max-sm:py-2",
        "hover:-translate-y-0.5 hover:shadow-md",
        "data-[active=false]:hover:bg-bl-accent! data-[active=false]:hover:text-white! data-[active=false]:hover:border-bl-accent!"
      )}
      style={{
        background: active ? "var(--color-bl-ink)" : "var(--color-bl-card)",
        borderColor: active ? "var(--color-bl-ink)" : "rgba(36,21,16,0.06)",
        color: active ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
      }}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300",
          "group-hover/chip:bg-white/15 group-hover/chip:text-white"
        )}
        style={{
          background: active ? "rgba(247,238,226,0.1)" : "var(--color-bl-bg)",
          color: active ? "var(--color-bl-bg)" : color ?? "var(--color-bl-accent)",
        }}
      >
        {icon}
      </span>
      <span
        className="text-[13px] font-medium leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-xs italic transition-colors duration-300",
          "group-hover/chip:text-white/85"
        )}
        style={{
          fontFamily: "var(--font-display)",
          color: active ? "var(--color-bl-accent2)" : "var(--color-bl-muted)",
        }}
      >
        {count}
      </span>
    </button>
  );
}

function DiningModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: est, isLoading } = useDiningBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!est) return <p className="text-bl-muted">{t("dining.notFound")}</p>;

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
      <DescriptionText text={est.descricao} />
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
