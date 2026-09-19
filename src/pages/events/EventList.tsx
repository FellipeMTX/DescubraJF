import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Check, ChevronDown, LayoutList, SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/ui/EventCard";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { useEvents } from "@/hooks/useEvents";
import { EventFeaturedCarousel } from "@/components/events/EventFeaturedCarousel";
import { EventCalendar } from "@/components/events/EventCalendar";
import { AgendaDownloadMenu } from "@/components/events/AgendaDownloadMenu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SelectedCategoryPill({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
      style={{ background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }}
    >
      {children}
      <X size={14} aria-hidden="true" />
    </button>
  );
}

function MonthDropdown({ options, selected, onSelect }: { options: { label: string; value: string }[]; selected: string; onSelect: (v: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? t("events.list.allMonths");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          selected !== "todos" ? "border-transparent" : "border-black/15 hover:border-black/30"
        )}
        style={
          selected !== "todos"
            ? { background: "var(--color-bl-card)", color: "var(--color-bl-ink)", borderColor: "transparent" }
            : { color: "var(--color-bl-ink)" }
        }
      >
        {selectedLabel}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 p-1 shadow-xl"
          style={{ background: "var(--color-bl-bg)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className="block w-full cursor-pointer rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-bl-card"
              style={
                selected === opt.value
                  ? { background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }
                  : { color: "var(--color-bl-ink)" }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type ViewMode = "list" | "calendar";

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const { t } = useTranslation();
  const items: { value: ViewMode; icon: typeof LayoutList; label: string }[] = [
    { value: "list", icon: LayoutList, label: t("events.list.viewList") },
    { value: "calendar", icon: CalendarDays, label: t("events.list.viewCalendar") },
  ];
  return (
    <div
      className="inline-flex gap-0.5 rounded-full border p-1"
      style={{ background: "var(--color-bl-card)", borderColor: "rgba(0,0,0,0.06)" }}
    >
      {items.map(({ value: v, icon: Icon, label }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.75 text-sm font-medium transition-colors"
            style={{
              background: active ? "var(--color-bl-bg)" : "transparent",
              color: active ? "var(--color-bl-ink)" : "var(--color-bl-muted)",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : undefined,
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

const CATEGORY_VALUES = ["todos", "cultural", "esportivo", "festivo", "show", "gastronomico"] as const;
const CATEGORY_KEY_MAP: Record<(typeof CATEGORY_VALUES)[number], string> = {
  todos: "events.filters.all",
  cultural: "events.filters.cultural",
  esportivo: "events.filters.sportive",
  festivo: "events.filters.festive",
  show: "events.filters.show",
  gastronomico: "events.filters.gastronomic",
};

type EventCategory = Exclude<(typeof CATEGORY_VALUES)[number], "todos">;

function CategoryMultiSelect({ selected, onChange }: { selected: EventCategory[]; onChange: (categories: EventCategory[]) => void }) {
  const { t } = useTranslation();
  const toggle = (category: EventCategory) => onChange(selected.includes(category) ? selected.filter((value) => value !== category) : [...selected, category]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/30"
        style={{ color: "var(--color-bl-ink)" }}
      >
        <SlidersHorizontal size={14} aria-hidden="true" />
        {selected.length ? t("events.filters.categoriesSelected", { count: selected.length }) : t("events.filters.all")}
        <ChevronDown size={14} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 rounded-2xl border border-black/10 bg-bl-bg! p-1.5 shadow-xl">
        <DropdownMenuItem
          onClick={() => onChange([])}
          className="cursor-pointer rounded-xl px-3 py-2.5 hover:bg-black/5! focus:bg-black/5!"
          style={{ color: "var(--color-bl-ink)" }}
        >
          <span className="flex-1">{t("events.filters.all")}</span>
          {selected.length === 0 && <Check size={14} aria-hidden="true" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-black/10" />
        {CATEGORY_VALUES.filter((value): value is EventCategory => value !== "todos").map((category) => (
          <DropdownMenuCheckboxItem
            key={category}
            checked={selected.includes(category)}
            onCheckedChange={() => toggle(category)}
            closeOnClick={false}
            className="cursor-pointer rounded-xl px-3 py-2.5 hover:bg-black/5! focus:bg-black/5!"
            style={{ color: "var(--color-bl-ink)" }}
          >
            {t(CATEGORY_KEY_MAP[category])}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

export default function EventList() {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("todos");
  const [view, setView] = useState<ViewMode>("list");
  const { data: events, isLoading } = useEvents();

  function getMonthLabel(dateStr: string): string {
    const d = new Date(dateStr);
    return `${t(`events.months.${d.getMonth() + 1}`)} ${d.getFullYear()}`;
  }

  function getShortMonthLabel(key: string): string {
    const [year, month] = key.split("-");
    const monthIdx = parseInt(month);
    return `${t(`events.months.${monthIdx + 1}`).slice(0, 3)} ${year}`;
  }

  const featured = useMemo(() => {
    if (!events?.length) return [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString().slice(0, 10);
    return [...events]
      .filter((e) => (e.data_fim || e.data_inicio) >= yesterdayIso)
      .sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
      .slice(0, 5);
  }, [events]);

  const filteredByCat = selectedCategories.length === 0
    ? events
    : events?.filter((event) => selectedCategories.includes(event.categoria as EventCategory));

  const availableMonths = useMemo(() => {
    if (!filteredByCat?.length) return [];
    const set = new Set<string>();
    for (const e of filteredByCat) set.add(getMonthKey(e.data_inicio));
    return Array.from(set).sort();
  }, [filteredByCat]);

  const monthOptions = [
    { label: t("events.list.allMonths"), value: "todos" },
    ...availableMonths.map((key) => ({ label: getShortMonthLabel(key), value: key })),
  ];

  const filtered = selectedMonth === "todos"
    ? filteredByCat
    : filteredByCat?.filter((e) => getMonthKey(e.data_inicio) === selectedMonth);

  const grouped = useMemo(() => {
    if (!filtered?.length) return [];

    const map = new Map<string, { label: string; events: typeof filtered }>();

    for (const event of filtered) {
      const key = getMonthKey(event.data_inicio);
      if (!map.has(key)) {
        map.set(key, { label: getMonthLabel(event.data_inicio), events: [] });
      }
      map.get(key)!.events.push(event);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12 max-md:px-6 max-md:py-8">
        <PageHeader
          kicker={t("events.list.kicker")}
          title={t("events.list.title")}
          highlight={t("events.list.titleHighlight")}
          subtitle={t("events.list.subtitle")}
        />

        {!isLoading && featured.length > 0 && (
          <EventFeaturedCarousel events={featured} />
        )}

        {/* Filters */}
        <div className="mt-14 flex items-center justify-between gap-3 overflow-x-auto pb-2 lg:flex-nowrap">
          <div className="flex min-w-0 items-center gap-2">
            <CategoryMultiSelect
              selected={selectedCategories}
              onChange={(categories) => { setSelectedCategories(categories); setSelectedMonth("todos"); }}
            />
            {selectedCategories.length > 0 && (
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                {selectedCategories.map((category) => (
                  <SelectedCategoryPill key={category} onRemove={() => { setSelectedCategories((current) => current.filter((value) => value !== category)); setSelectedMonth("todos"); }}>
                    {t(CATEGORY_KEY_MAP[category])}
                  </SelectedCategoryPill>
                ))}
              </div>
            )}
            {view === "list" && availableMonths.length > 0 && (
              <MonthDropdown
                options={monthOptions}
                selected={selectedMonth}
                onSelect={setSelectedMonth}
              />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <AgendaDownloadMenu events={events ?? []} />
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : view === "calendar" ? (
          <EventCalendar events={filteredByCat ?? []} />
        ) : grouped.length > 0 ? (
          <div className="mt-10 space-y-14">
            {grouped.map((group) => (
              <div key={group.label}>
                <div className="mb-8 flex items-center gap-6">
                  <div className="h-px flex-1 bg-black/15" />
                  <h2 className="bl-display shrink-0 text-2xl">
                    {group.label}
                    <span
                      className="ml-2 italic"
                      style={{
                        color: "var(--color-bl-accent)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.7em",
                      }}
                    >
                      {group.events.length}
                    </span>
                  </h2>
                  <div className="h-px flex-1 bg-black/15" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mt-16 rounded-3xl px-6 py-16 text-center"
            style={{ background: "var(--color-bl-card)", color: "var(--color-bl-muted)" }}
          >
            <CalendarDays size={36} className="mx-auto mb-3" style={{ color: "var(--color-bl-accent)" }} />
            <p className="m-0 text-[15px]">{t("events.list.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
