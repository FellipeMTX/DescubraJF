import { CalendarDays, MapPin, ExternalLink, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Evento } from "@/types/database";

type EventDetailDialogProps = {
  event: Evento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EventDetailDialog({ event, open, onOpenChange }: EventDetailDialogProps) {
  if (!event) return null;

  const hasDateRange = event.data_fim && event.data_fim !== event.data_inicio;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        {/* Image */}
        <div className="-mx-4 -mt-4 h-52 overflow-hidden rounded-t-xl bg-primary-100">
          {event.imagem_destaque ? (
            <img
              src={event.imagem_destaque}
              alt={event.titulo}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <CalendarDays size={48} className="text-primary-400" />
            </div>
          )}
        </div>

        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            {event.categoria && (
              <Badge variant="secondary" className="gap-1">
                <Tag size={12} />
                {event.categoria}
              </Badge>
            )}
            {event.gratuito && (
              <Badge className="bg-primary-400 text-accent-50">Gratuito</Badge>
            )}
          </div>
          <DialogTitle className="text-xl">{event.titulo}</DialogTitle>
        </DialogHeader>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-primary-700">
          <CalendarDays size={16} className="shrink-0 text-primary-500" />
          <span>
            {formatDate(event.data_inicio)}
            {hasDateRange && ` — ${formatDate(event.data_fim!)}`}
          </span>
        </div>

        {/* Location */}
        {(event.local_nome || event.local_endereco) && (
          <div className="flex items-start gap-2 text-sm text-primary-700">
            <MapPin size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <div>
              {event.local_nome && <span className="font-medium">{event.local_nome}</span>}
              {event.local_endereco && (
                <p className="text-accent-500">{event.local_endereco}</p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {event.descricao && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-accent-500">
            {event.descricao}
          </p>
        )}
        {!event.descricao && event.descricao_curta && (
          <p className="text-sm leading-relaxed text-accent-500">
            {event.descricao_curta}
          </p>
        )}

        {/* External link */}
        {event.link_externo && (
          <a href={event.link_externo} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ExternalLink size={14} />
              Saiba mais
            </Button>
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
