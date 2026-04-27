import { CalendarDays, MapPin } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { Evento } from "@/types/database";

type EventCardProps = {
  event: Evento;
  onClick?: () => void;
};

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bl-card text-left"
      style={{ background: "var(--color-bl-bg)" }}
    >
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: "var(--color-bl-card)" }}
      >
        {event.imagem_destaque ? (
          <img
            src={event.imagem_destaque}
            alt={event.titulo}
            loading="lazy"
          />
        ) : (
          <div className="bl-ph h-full w-full">
            <CalendarDays size={44} style={{ color: "var(--color-bl-muted)" }} />
          </div>
        )}

        {event.gratuito && (
          <span
            className="absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              background: "var(--color-bl-accent2)",
              color: "var(--color-bl-ink)",
            }}
          >
            Gratuito
          </span>
        )}

        <div
          className="absolute left-3 top-3 rounded-xl px-3 py-1.5 text-center"
          style={{
            background: "var(--color-bl-accent2)",
            color: "var(--color-bl-ink)",
            fontFamily: "var(--font-display)",
          }}
        >
          <span className="text-xs font-medium">
            {formatDateShort(event.data_inicio)}
          </span>
          {event.data_fim && event.data_fim !== event.data_inicio && (
            <span className="block text-[10px] italic opacity-80">
              até {formatDateShort(event.data_fim)}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {event.categoria && (
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-bl-accent)" }}
          >
            {event.categoria}
          </span>
        )}
        <h3 className="bl-display mt-1 text-xl">{event.titulo}</h3>
        {event.local_nome && (
          <p
            className="mt-2 flex items-center gap-1.5 text-sm"
            style={{ color: "var(--color-bl-muted)" }}
          >
            <MapPin size={14} className="shrink-0" />
            {event.local_nome}
          </p>
        )}
      </div>
    </button>
  );
}
