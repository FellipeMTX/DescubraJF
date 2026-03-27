import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import type { Evento } from "@/types/database";

export function EventCard({ event }: { event: Evento }) {
  return (
    <Card className="group h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden bg-primary-100">
        {event.imagem_destaque ? (
          <img
            src={event.imagem_destaque}
            alt={event.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <CalendarDays size={44} className="text-primary-400" />
          </div>
        )}

        {event.gratuito && (
          <Badge className="absolute right-3 top-3 bg-primary-400 text-accent-50">
            Gratuito
          </Badge>
        )}

        <div className="absolute left-3 top-3 rounded-lg bg-accent-50 px-3 py-1.5 text-center shadow-md">
          <span className="text-xs font-bold text-primary-800">
            {formatDateShort(event.data_inicio)}
          </span>
          {event.data_fim && (
            <span className="block text-[10px] text-accent-400">
              até {formatDateShort(event.data_fim)}
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        {event.categoria && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-500">
            {event.categoria}
          </span>
        )}
        <h3 className="mt-1 text-lg font-bold text-primary-800 group-hover:text-primary-600">
          {event.titulo}
        </h3>
        {event.local_nome && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-accent-500">
            <MapPin size={14} className="shrink-0" />
            {event.local_nome}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
