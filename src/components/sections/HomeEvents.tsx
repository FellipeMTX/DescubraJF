import { Link } from "react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { formatDateShort } from "@/lib/utils";

export function HomeEvents() {
  const { data: events, isLoading } = useUpcomingEvents(5);

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Acontece em JF
        </h2>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-lg" />
            ))}
          </div>
        ) : events?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} to={`/agenda/${event.slug}`}>
                <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
                  {/* Image */}
                  <div className="relative h-40 bg-gray-200">
                    {event.imagem_destaque ? (
                      <img
                        src={event.imagem_destaque}
                        alt={event.titulo}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-accent-50 text-accent-500">
                        <CalendarDays size={40} />
                      </div>
                    )}

                    {event.gratuito && (
                      <Badge className="absolute right-3 top-3 bg-green-500">
                        Gratuito
                      </Badge>
                    )}

                    {/* Date badge */}
                    <div className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow">
                      {formatDateShort(event.data_inicio)}
                      {event.data_fim && (
                        <span className="text-gray-400">
                          {" → "}
                          {formatDateShort(event.data_fim)}
                        </span>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {event.categoria && (
                      <p className="text-xs font-medium uppercase tracking-wider text-primary-600">
                        {event.categoria}
                      </p>
                    )}
                    <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-primary-700">
                      {event.titulo}
                    </h3>
                    {event.local_nome && (
                      <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        {event.local_nome}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum evento próximo no momento.
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/agenda"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" })
            )}
          >
            Agenda completa
          </Link>
        </div>
      </div>
    </section>
  );
}
