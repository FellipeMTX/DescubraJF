import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/ui/EventCard";
import { cn } from "@/lib/utils";
import { useEvents } from "@/hooks/useEvents";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? "Todos os meses";

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

const CATEGORIES = [
  { label: "Todos", value: "todos" },
  { label: "Cultural", value: "cultural" },
  { label: "Esportivo", value: "esportivo" },
  { label: "Festivo", value: "festivo" },
  { label: "Show", value: "show" },
  { label: "Gastronômico", value: "gastronomico" },
];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function getShortMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  return `${MONTH_NAMES[parseInt(month)].slice(0, 3)} ${year}`;
}

export default function EventList() {
  const [selectedCat, setSelectedCat] = useState("todos");
  const [selectedMonth, setSelectedMonth] = useState("todos");
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
    { label: "Todos os meses", value: "todos" },
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
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [filtered]);

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">Acontece em JF</h1>
        <p className="mt-2 text-accent-500">
          Fique por dentro de tudo o que está rolando na cidade
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((opt) => (
              <FilterPill key={opt.value} active={selectedCat === opt.value} onClick={() => { setSelectedCat(opt.value); setSelectedMonth("todos"); }}>
                {opt.label}
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
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-accent-500">
            Nenhum evento encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
