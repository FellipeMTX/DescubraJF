import { Link } from "react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { formatDateShort } from "@/lib/utils";

export function HomeEvents() {
  const { data: events, isLoading } = useUpcomingEvents(6);
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.05);

  return (
    <section ref={sectionRef} className="bg-accent-100 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <SectionHeader
            icon={<CalendarDays size={24} className="text-primary-600" />}
            title="Acontece em JF"
            subtitle="Fique por dentro de tudo o que está rolando na cidade"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl bg-primary-200/50" />
            ))}
          </div>
        ) : events?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {events.map((event, i) => (
              <div
                key={event.id}
                className={cn(
                  "transition-all ease-out",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
                )}
                style={{
                  transitionDuration: `${600 + i * 100}ms`,
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                <Link to={`/agenda/${event.slug}`}>
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
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-accent-500">
            Nenhum evento próximo no momento.
          </p>
        )}

        <div
          className={cn(
            "mt-10 text-center transition-all duration-700 ease-out delay-500",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <Link
            to="/agenda"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-primary-400 px-8 text-primary-700 hover:bg-primary-400 hover:text-accent-50"
            )}
          >
            Agenda completa
          </Link>
        </div>
      </div>
    </section>
  );
}
