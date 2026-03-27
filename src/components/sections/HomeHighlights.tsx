import { Link } from "react-router";
import { Map, Footprints } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function HomeHighlights() {
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal<HTMLAnchorElement>(0.2);
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal<HTMLAnchorElement>(0.2);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          ref={leftRef}
          to="/atrativos"
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-primary-700 p-8 text-accent-100 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-2xl",
            leftVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          )}
        >
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary-400/20" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary-400/20" />
          <div className="relative flex items-center gap-5">
            <div className="rounded-xl bg-primary-400/25 p-4 transition-transform group-hover:scale-110">
              <Map size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-accent-50">Atrativos Turísticos</h2>
              <p className="mt-1 text-primary-200">Explore o melhor da cidade</p>
            </div>
          </div>
        </Link>

        <Link
          ref={rightRef}
          to="/roteiros"
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-accent-400 p-8 text-accent-50 transition-all duration-700 ease-out delay-150 hover:-translate-y-1 hover:shadow-2xl",
            rightVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
          )}
        >
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary-200/20" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary-200/20" />
          <div className="relative flex items-center gap-5">
            <div className="rounded-xl bg-primary-200/25 p-4 transition-transform group-hover:scale-110">
              <Footprints size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-accent-50">Roteiros de Juiz de Fora</h2>
              <p className="mt-1 text-primary-200">Um roteiro para cada experiência</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
