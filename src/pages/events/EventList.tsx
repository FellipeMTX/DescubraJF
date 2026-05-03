import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/ui/EventCard";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { useEvents } from "@/hooks/useEvents";

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "border-transparent" : "border-black/15 hover:border-black/30"
      )}
      style={
        active
          ? { background: "var(--color-bl-card)", color: "var(--color-bl-ink)", borderColor: "transparent" }
          : { color: "var(--color-bl-ink)" }
      }
    >
      {children}
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

const CATEGORY_VALUES = ["todos", "cultural", "esportivo", "festivo", "show", "gastronomico"] as const;
const CATEGORY_KEY_MAP: Record<(typeof CATEGORY_VALUES)[number], string> = {
  todos: "events.filters.all",
  cultural: "events.filters.cultural",
  esportivo: "events.filters.sportive",
  festivo: "events.filters.festive",
  show: "events.filters.show",
  gastronomico: "events.filters.gastronomic",
};

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

export default function EventList() {
  const { t } = useTranslation();
  const [selectedCat, setSelectedCat] = useState("todos");
  const [selectedMonth, setSelectedMonth] = useState("todos");
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

  // Filter by category
  const filteredByCat = selectedCat === "todos"
    ? events
    : events?.filter((e) => e.categoria === selectedCat);

  // Available months from filtered events
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

  // Filter by month
  const filtered = selectedMonth === "todos"
    ? filteredByCat
    : filteredByCat?.filter((e) => getMonthKey(e.data_inicio) === selectedMonth);

  // Group by month
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
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, value]) => value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12">
        <PageHeader
          kicker={t("events.list.kicker")}
          title={t("events.list.title")}
          highlight={t("events.list.titleHighlight")}
          subtitle={t("events.list.subtitle")}
        />

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_VALUES.map((value) => (
              <FilterPill key={value} active={selectedCat === value} onClick={() => { setSelectedCat(value); setSelectedMonth("todos"); }}>
                {t(CATEGORY_KEY_MAP[value])}
              </FilterPill>
            ))}
          </div>
          {availableMonths.length > 0 && (
            <MonthDropdown
              options={monthOptions}
              selected={selectedMonth}
              onSelect={setSelectedMonth}
            />
          )}
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : grouped.length > 0 ? (
          <div className="mt-8 space-y-10">
            {grouped.map((group) => (
              <div key={group.label}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-black/15" />
                  <h2 className="bl-display shrink-0 text-2xl">{group.label}</h2>
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
          <p
            className="mt-12 text-center"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {t("events.list.empty")}
          </p>
        )}
      </div>
    </div>
  );
}
