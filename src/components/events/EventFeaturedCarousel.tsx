import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { formatDateShort, parseLocalDate } from "@/lib/utils";
import type { Evento } from "@/types/database";

type Props = {
  events: Evento[];
  intervalMs?: number;
};

function dayOf(s: string) {
  return String(parseLocalDate(s).getDate()).padStart(2, "0");
}

export function EventFeaturedCarousel({ events, intervalMs = 6000 }: Props) {
  const { t } = useTranslation();
  const [rawIdx, setIdx] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % events.length), intervalMs);
    return () => clearInterval(id);
  }, [events.length, intervalMs]);

  if (!events.length) return null;
  const idx = rawIdx % events.length;

  function monthShort(s: string) {
    const m = parseLocalDate(s).getMonth() + 1;
    return t(`events.months.${m}`).slice(0, 3);
  }

  return (
    <section className="mt-10">
      <div
        className="relative overflow-hidden rounded-[32px]"
        style={{ background: "var(--color-bl-card)" }}
      >
        <div className="relative min-h-[420px]">
          {events.map((ev, i) => {
            const active = i === idx;
            const endsLabel =
              ev.data_fim && ev.data_fim !== ev.data_inicio
                ? `${dayOf(ev.data_fim)} ${monthShort(ev.data_fim)}`
                : null;
            return (
              <div
                key={ev.id}
                className="absolute inset-0 grid grid-cols-1 transition-opacity duration-700 ease-out lg:grid-cols-[1.1fr_1fr]"
                style={{ opacity: active ? 1 : 0, visibility: active ? "visible" : "hidden" }}
                aria-hidden={!active}
              >
                <div
                  className="relative min-h-[280px] bg-cover bg-center"
                  style={{ backgroundImage: ev.imagem_destaque ? `url(${ev.imagem_destaque})` : undefined }}
                >
                  {!ev.imagem_destaque && (
                    <div className="flex h-full w-full items-center justify-center bg-bl-card">
                      <CalendarDays size={64} style={{ color: "var(--color-bl-muted)" }} />
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(36,21,16,0.05), rgba(36,21,16,0.28))",
                    }}
                  />
                  <span
                    className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-widest backdrop-blur"
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-bl-ink)" }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 animate-[pulse_1.6s_infinite] rounded-full"
                      style={{ background: "var(--color-bl-accent)" }}
                    />
                    {t("events.list.featured")}
                  </span>
                  <div
                    className="absolute bottom-6 right-6 z-10 rounded-2xl px-4 py-3 text-center shadow-lg"
                    style={{
                      background: "var(--color-bl-accent2)",
                      color: "var(--color-bl-ink)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <span className="block text-3xl font-medium leading-none">{dayOf(ev.data_inicio)}</span>
                    <span className="mt-1 block text-[11px] uppercase tracking-widest">
                      {monthShort(ev.data_inicio)}
                    </span>
                    {endsLabel && (
                      <span className="mt-1 block text-[10px] italic opacity-75">
                        {t("events.card.until")} {endsLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-7 p-10 pb-16 max-lg:p-7 max-lg:pb-14">
                  <div>
                    {ev.categoria && (
                      <span
                        className="text-[11px] font-semibold uppercase tracking-widest"
                        style={{ color: "var(--color-bl-accent)" }}
                      >
                        {ev.categoria}
                      </span>
                    )}
                    <h2
                      className="bl-display mb-4 mt-3"
                      style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
                    >
                      {ev.titulo}
                    </h2>
                    {ev.descricao_curta && (
                      <p
                        className="m-0 text-[15px] leading-[1.7] opacity-85"
                        style={{ color: "var(--color-bl-ink)" }}
                      >
                        {ev.descricao_curta}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm" style={{ color: "var(--color-bl-muted)" }}>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={14} className="shrink-0" />
                      <strong style={{ color: "var(--color-bl-ink)", fontWeight: 500 }}>
                        {formatDateShort(ev.data_inicio)}
                        {ev.data_fim && ev.data_fim !== ev.data_inicio && (
                          <>{" "}{t("events.card.until")} {formatDateShort(ev.data_fim)}</>
                        )}
                      </strong>
                    </span>
                    {ev.local_nome && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={14} className="shrink-0" />
                        {ev.local_nome}
                      </span>
                    )}
                    {ev.gratuito && (
                      <span
                        className="inline-flex items-center gap-2 font-medium"
                        style={{ color: "var(--color-bl-accent)" }}
                      >
                        {t("events.card.freeEntry")}
                      </span>
                    )}
                  </div>

                  {ev.link_externo && (
                    <a
                      href={ev.link_externo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-max items-center gap-2 border-b pb-1 text-[15px] font-medium transition-[gap]"
                      style={{
                        color: "var(--color-bl-ink)",
                        borderColor: "var(--color-bl-ink)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {t("events.list.viewEvent")}
                      <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {events.length > 1 && (
          <div className="absolute bottom-5 left-7 z-10 flex gap-2 max-lg:left-1/2 max-lg:-translate-x-1/2">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-1 cursor-pointer rounded-sm border-0 p-0 transition-all"
                style={{
                  width: i === idx ? 44 : 28,
                  background: i === idx ? "var(--color-bl-accent)" : "rgba(0,0,0,0.18)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
