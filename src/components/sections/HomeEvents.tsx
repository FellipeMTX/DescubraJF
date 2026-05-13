import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectImage } from "@/components/ui/AspectImage";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IMAGE_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Evento } from "@/types/database";

function formatDate(iso: string, locale: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short" }).replace(".", "");
}

export function HomeEvents() {
  const { t } = useTranslation();
  const { data: events, isLoading } = useUpcomingEvents(6);
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>(0.12);
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section
      className="relative overflow-hidden px-14 py-16"
      style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }}
    >
      <div
        className="bl-blob bl-float"
        style={{
          width: 360,
          height: 360,
          background: "var(--color-bl-accent)",
          top: "-10%",
          right: "-5%",
          opacity: 0.35,
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          ref={headerRef}
          className={cn(
            "reveal mb-12 grid items-center gap-10 md:grid-cols-2",
            headerVisible && "in"
          )}
        >
          <div>
            <div
              className="bl-kicker mb-5"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "var(--color-bl-bg)",
              }}
            >
              <span
                className="italic"
                style={{
                  color: "var(--color-bl-accent2)",
                  fontFamily: "var(--font-display)",
                }}
              >
                04.
              </span>{" "}
              {t("home.events.kicker")}
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              {t("home.events.title")}{" "}
              <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
                {t("home.events.titleHighlight")}
              </span>
              <br />
              {t("home.events.titleSuffix")}
            </h2>
          </div>
          <div className="text-right">
            <Link
              to="/agenda"
              className="bl-btn-ghost"
              style={{
                color: "var(--color-bl-bg)",
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              {t("home.events.cta")} <Calendar size={14} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-[28px] bg-white/10" />
            ))}
          </div>
        ) : events?.length ? (
          <div
            ref={gridRef}
            className={cn(
              "reveal-stagger grid gap-6 sm:grid-cols-2 md:grid-cols-3",
              gridVisible && "in"
            )}
          >
            {events.map((event) => (
              <EventHomeCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p
            className="text-center"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {t("home.events.empty")}
          </p>
        )}
      </div>
    </section>
  );
}

function EventHomeCard({ event }: { event: Evento }) {
  const { i18n } = useTranslation();
  const inner = (
    <>
      <AspectImage
        src={event.imagem_destaque}
        alt={event.titulo}
        ratio={IMAGE_RATIOS.cardLandscape}
        placeholder={
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{event.titulo}</span>
        }
      >
        <div
          className="absolute top-4 left-4 rounded-xl px-3.5 py-2"
          style={{
            background: "var(--color-bl-accent2)",
            color: "var(--color-bl-ink)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          {formatDate(event.data_inicio, i18n.language)}
        </div>
      </AspectImage>
      <div className="p-5">
        {event.categoria && (
          <div
            className="mb-2 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-bl-accent2)" }}
          >
            {event.categoria}
          </div>
        )}
        <div className="bl-display mb-2 text-[22px]">
          {event.titulo}
        </div>
        {event.local_nome && (
          <div
            className="flex items-center gap-1.5 text-[13px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <MapPin size={12} /> {event.local_nome}
          </div>
        )}
      </div>
    </>
  );

  if (event.link_externo) {
    return (
      <a
        href={event.link_externo}
        target="_blank"
        rel="noopener noreferrer"
        className="bl-card bl-card-pop block cursor-pointer text-left"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="bl-card bl-card-pop block text-left"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {inner}
    </div>
  );
}
