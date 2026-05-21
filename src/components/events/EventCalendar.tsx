import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, parseLocalDate, toIsoDay } from "@/lib/utils";
import type { Evento } from "@/types/database";

type Props = {
  events: Evento[];
  initialMonth?: Date;
};

const DOW_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const CATEGORIES = ["cultural", "esportivo", "festivo", "show", "gastronomico"] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function isoDay(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function eventCovers(ev: Evento, iso: string) {
  const start = toIsoDay(ev.data_inicio);
  const end = toIsoDay(ev.data_fim || ev.data_inicio);
  return iso >= start && iso <= end;
}
function eventStartsOn(ev: Evento, iso: string) {
  return toIsoDay(ev.data_inicio) === iso;
}
const LONG_EVENT_DAYS = 7;
function isLongEvent(ev: Evento) {
  if (!ev.data_fim) return false;
  const start = parseLocalDate(ev.data_inicio).getTime();
  const end = parseLocalDate(ev.data_fim).getTime();
  const days = Math.round((end - start) / 86_400_000) + 1;
  return days > LONG_EVENT_DAYS;
}

function categoryClass(cat: string | null | undefined) {
  if (!cat) return "";
  return `cat-${cat}`;
}

export function EventCalendar({ events, initialMonth }: Props) {
  const { t } = useTranslation();
  const today = isoDay(new Date());
  const [cursor, setCursor] = useState<Date>(() => {
    if (initialMonth) return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
    if (events[0]) {
      const d = parseLocalDate(events[0].data_inicio);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const monthLabel = useMemo(() => {
    const m = cursor.getMonth() + 1;
    return `${t(`events.months.${m}`)} ${cursor.getFullYear()}`;
  }, [cursor, t]);

  const eventsOn = (iso: string) => events.filter((ev) => eventCovers(ev, iso));

  const cells = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();

    const arr: { date: Date; outside: boolean }[] = [];
    for (let i = startDow - 1; i >= 0; i--) {
      arr.push({ date: new Date(y, m - 1, daysInPrev - i), outside: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ date: new Date(y, m, d), outside: false });
    }
    const total = arr.length;
    const trailing = (7 - (total % 7)) % 7;
    for (let d = 1; d <= trailing; d++) {
      arr.push({ date: new Date(y, m + 1, d), outside: true });
    }
    return arr;
  }, [cursor]);

  const panelEvents = selected ? eventsOn(selected) : [];

  return (
    <section className="mt-10">
      <div
        className="rounded-[28px] border p-7 max-md:p-5"
        style={{ background: "var(--color-bl-card)", borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="bl-display m-0 text-[26px] capitalize">{monthLabel}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={t("common.previous")}
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors hover:bg-bl-ink hover:text-bl-bg"
              style={{ background: "var(--color-bl-bg)", borderColor: "rgba(0,0,0,0.12)", color: "var(--color-bl-ink)" }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              aria-label={t("common.next")}
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors hover:bg-bl-ink hover:text-bl-bg"
              style={{ background: "var(--color-bl-bg)", borderColor: "rgba(0,0,0,0.12)", color: "var(--color-bl-ink)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DOW_KEYS.map((k) => (
            <div
              key={k}
              className="py-2 text-center text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {t(`events.calendar.dow.${k}`)}
            </div>
          ))}

          {cells.map(({ date, outside }) => {
            const iso = isoDay(date);
            const allCovering = eventsOn(iso);
            const evs = allCovering.filter(
              (ev) => !isLongEvent(ev) || eventStartsOn(ev, iso)
            );
            const ongoing = allCovering.filter(
              (ev) => isLongEvent(ev) && !eventStartsOn(ev, iso)
            );
            const isToday = iso === today;
            const isSelected = iso === selected;
            const cat = evs[0]?.categoria;

            return (
              <button
                key={iso + (outside ? "-o" : "")}
                type="button"
                onClick={() => setSelected(iso)}
                className={cn(
                  "calendar-day relative flex min-h-35 cursor-pointer flex-col overflow-hidden rounded-[14px] border p-2.5 text-left transition-all hover:-translate-y-px hover:border-black/20",
                  outside && "opacity-35",
                  isToday && !isSelected && "today",
                  isSelected && "selected"
                )}
                style={{
                  background: "var(--color-bl-bg)",
                  borderColor: isSelected
                    ? "var(--color-bl-ink)"
                    : isToday
                    ? "var(--color-bl-accent)"
                    : "transparent",
                  boxShadow: isSelected ? "0 0 0 2px var(--color-bl-ink)" : undefined,
                }}
              >
                <span
                  className="bl-display text-base font-medium leading-none"
                  style={{ color: isToday && !isSelected ? "var(--color-bl-accent)" : "var(--color-bl-ink)" }}
                >
                  {date.getDate()}
                </span>

                {evs.length === 1 && (
                  <>
                    <span
                      className={cn("absolute left-0 right-0 top-0 z-3 h-0.75", categoryClass(cat))}
                      style={{ background: categoryColor(cat) }}
                    />
                    <div className="relative mt-2 flex-1 overflow-hidden rounded-[10px]" style={{ background: "var(--color-bl-card)", minHeight: 70 }}>
                      {evs[0].imagem_destaque ? (
                        <>
                          <img
                            src={evs[0].imagem_destaque}
                            alt={evs[0].titulo}
                            loading="lazy"
                            className="block h-full w-full object-cover"
                          />
                          <span
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(36,21,16,0.7), rgba(36,21,16,0.05) 55%)",
                            }}
                          />
                          <span className="bl-display absolute bottom-1.5 left-2 right-2 z-2 line-clamp-2 text-[11px] font-medium leading-[1.15] text-white">
                            {evs[0].titulo}
                          </span>
                        </>
                      ) : (
                        <span className="bl-display block p-2 text-center text-[11px] font-medium leading-[1.15]" style={{ color: "var(--color-bl-ink)" }}>
                          {evs[0].titulo}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {evs.length > 1 && (
                  <div className="mt-1.5 flex min-h-0 flex-1 flex-col gap-1 max-sm:hidden">
                    {evs.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className={cn("relative flex items-center gap-1.5 overflow-hidden rounded-md py-0.5 pl-2 pr-1.5", categoryClass(ev.categoria))}
                        style={{ background: "var(--color-bl-card)" }}
                      >
                        <span
                          className="absolute bottom-0 left-0 top-0 w-0.75"
                          style={{ background: categoryColor(ev.categoria) }}
                        />
                        {ev.imagem_destaque ? (
                          <img src={ev.imagem_destaque} alt="" loading="lazy" className="block h-5.5 w-5.5 shrink-0 rounded object-cover" />
                        ) : (
                          <span className="block h-5.5 w-5.5 shrink-0 rounded" style={{ background: "var(--color-bl-bg)" }} />
                        )}
                        <span
                          className="line-clamp-2 text-[10.5px] font-medium leading-[1.2]"
                          style={{ color: "var(--color-bl-ink)" }}
                        >
                          {ev.titulo}
                        </span>
                      </div>
                    ))}
                    {evs.length > 3 && (
                      <span
                        className="bl-display pl-2 text-[10px] font-semibold"
                        style={{ color: "var(--color-bl-muted)" }}
                      >
                        +{evs.length - 3} {t("events.calendar.more")}
                      </span>
                    )}
                  </div>
                )}

                {evs.length === 0 && ongoing.length > 0 && (
                  <div className="mt-auto flex flex-col gap-1 max-sm:hidden">
                    {ongoing.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className="relative truncate rounded-md py-0.5 pl-2 pr-1.5 text-[10px] font-medium opacity-70"
                        style={{ background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }}
                      >
                        <span
                          className="absolute bottom-0 left-0 top-0 w-0.75"
                          style={{ background: categoryColor(ev.categoria) }}
                        />
                        <span className="block truncate pl-1">{ev.titulo}</span>
                      </div>
                    ))}
                    {ongoing.length > 3 && (
                      <span
                        className="bl-display pl-2 text-[10px] font-semibold"
                        style={{ color: "var(--color-bl-muted)" }}
                      >
                        +{ongoing.length - 3} {t("events.calendar.more")}
                      </span>
                    )}
                  </div>
                )}

                {allCovering.length > 0 && (
                  <span
                    className="pointer-events-none absolute bottom-2 left-1/2 hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full max-sm:block"
                    style={{ background: isSelected ? "var(--color-bl-accent2)" : "var(--color-bl-accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--color-bl-muted)" }}>
          {CATEGORIES.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: categoryColor(c) }} />
              {t(`events.filters.${legendKey(c)}`)}
            </span>
          ))}
        </div>
      </div>

      <div
        className="mt-6 rounded-[20px] border p-6"
        style={{ background: "var(--color-bl-bg)", borderColor: "rgba(0,0,0,0.08)" }}
      >
        {!selected ? (
          <p className="m-0 py-6 text-center text-sm" style={{ color: "var(--color-bl-muted)" }}>
            {t("events.calendar.selectDay")}
          </p>
        ) : (
          <CalendarPanel iso={selected} events={panelEvents} />
        )}
      </div>
    </section>
  );
}

function legendKey(cat: (typeof CATEGORIES)[number]) {
  switch (cat) {
    case "cultural":
      return "cultural";
    case "esportivo":
      return "sportive";
    case "festivo":
      return "festive";
    case "show":
      return "show";
    case "gastronomico":
      return "gastronomic";
  }
}

function categoryColor(cat: string | null | undefined): string {
  switch (cat) {
    case "esportivo":
      return "#9bbf8a";
    case "festivo":
      return "var(--color-bl-accent)";
    case "show":
      return "#c89bbf";
    case "gastronomico":
      return "#e0b884";
    case "cultural":
    default:
      return "var(--color-bl-accent2)";
  }
}

function CalendarPanel({ iso, events }: { iso: string; events: Evento[] }) {
  const { t } = useTranslation();
  const d = parseLocalDate(iso);
  const monthName = t(`events.months.${d.getMonth() + 1}`);
  const dayLabel = (
    <>
      {d.getDate()} {t("events.calendar.dayOf")} <em style={{ fontStyle: "italic", color: "var(--color-bl-accent)" }}>{monthName}</em>
    </>
  );

  if (!events.length) {
    return (
      <>
        <h3 className="bl-display m-0 mb-4 text-xl">{dayLabel}</h3>
        <p className="m-0 py-6 text-center text-sm" style={{ color: "var(--color-bl-muted)" }}>
          {t("events.calendar.noEventsDay")}
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="bl-display m-0 mb-4 text-xl">
        {dayLabel}{" "}
        <span
          style={{
            fontStyle: "italic",
            color: "var(--color-bl-accent)",
            fontSize: "0.78em",
          }}
        >
          {events.length} {events.length === 1 ? t("events.calendar.event") : t("events.calendar.events")}
        </span>
      </h3>
      <div className="flex flex-col gap-3">
        {events.map((ev) => {
          const inner = (
            <>
              <span
                className="block h-10 w-1 shrink-0 rounded-sm"
                style={{ background: categoryColor(ev.categoria) }}
              />
              <div className="min-w-0 flex-1">
                {ev.categoria && (
                  <div
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "var(--color-bl-accent)" }}
                  >
                    {ev.categoria}
                  </div>
                )}
                <div className="bl-display mt-0.5 truncate text-base">{ev.titulo}</div>
                {ev.local_nome && (
                  <div className="mt-0.5 text-xs" style={{ color: "var(--color-bl-muted)" }}>
                    {ev.local_nome}
                  </div>
                )}
              </div>
            </>
          );
          const className = "flex items-center gap-4 rounded-2xl p-3.5 transition-transform hover:translate-x-1";
          const style = { background: "var(--color-bl-card)" };
          return ev.link_externo ? (
            <a
              key={ev.id}
              href={ev.link_externo}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              style={style}
            >
              {inner}
            </a>
          ) : (
            <div key={ev.id} className={className} style={style}>
              {inner}
            </div>
          );
        })}
      </div>
    </>
  );
}
