import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/ui/EventCard";
import { EventDetailDialog } from "@/components/ui/EventDetailDialog";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";
import type { Evento } from "@/types/database";

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary-400 bg-primary-400 text-accent-50"
          : "border-primary-200 text-primary-700 hover:border-primary-400"
      )}
    >
      {children}
    </button>
  );
}

function MonthDropdown({ options, selected, onSelect }: { options: { label: string; value: string }[]; selected: string; onSelect: (v: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? t("pages.events.allMonths");

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
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          selected !== "todos"
            ? "border-primary-400 bg-primary-400 text-accent-50"
            : "border-primary-200 text-primary-700 hover:border-primary-400"
        )}
      >
        {selectedLabel}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-primary-200 bg-accent-50 p-1 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className={cn(
                "block w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors",
                selected === opt.value
                  ? "bg-primary-400 text-accent-50"
                  : "text-primary-700 hover:bg-primary-100"
              )}
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

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

function getMonthLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString(locale, { month: "long" });
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${d.getFullYear()}`;
}

function getShortMonthLabel(key: string, locale: string): string {
  const [year, month] = key.split("-");
  const d = new Date(parseInt(year), parseInt(month), 1);
  const monthShort = d.toLocaleDateString(locale, { month: "short" });
  return `${monthShort.charAt(0).toUpperCase() + monthShort.slice(1)} ${year}`;
}

const LOCALE_MAP: Record<string, string> = {
  pt: "pt-BR",
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
};

export default function EventList() {
  const { t, i18n } = useTranslation();
  const locale = LOCALE_MAP[i18n.language] ?? "pt-BR";
  const [selectedCat, setSelectedCat] = useState("todos");
  const [selectedMonth, setSelectedMonth] = useState("todos");
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const { data: events, isLoading } = useEvents();

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
    { label: t("pages.events.allMonths"), value: "todos" },
    ...availableMonths.map((key) => ({ label: getShortMonthLabel(key, locale), value: key })),
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
        map.set(key, { label: getMonthLabel(event.data_inicio, locale), events: [] });
      }
      map.get(key)!.events.push(event);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [filtered, locale]);

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">{t("pages.events.title")}</h1>
        <p className="mt-2 text-accent-500">{t("pages.events.subtitle")}</p>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_VALUES.map((value) => (
              <FilterPill key={value} active={selectedCat === value} onClick={() => { setSelectedCat(value); setSelectedMonth("todos"); }}>
                {value === "todos" ? t("common.all") : t(`pages.events.categories.${value}`)}
              </FilterPill>
            ))}
          </div>
          {availableMonths.length > 1 && (
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
                  <div className="h-px flex-1 bg-primary-300" />
                  <h2 className="shrink-0 text-lg font-bold text-primary-700">{group.label}</h2>
                  <div className="h-px flex-1 bg-primary-300" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-accent-500">
            {t("pages.events.empty")}
          </p>
        )}
      </div>

      <EventDetailDialog
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </div>
  );
}
