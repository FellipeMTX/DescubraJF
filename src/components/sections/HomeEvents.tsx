import { Link } from "react-router";
import { CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EventCard } from "@/components/ui/EventCard";
import { useUpcomingEvents } from "@/hooks/useEvents";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
                <EventCard event={event} />
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
