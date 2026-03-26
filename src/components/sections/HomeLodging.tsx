import { Link } from "react-router";
import { BedDouble, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const LODGING_TYPES = [
  {
    name: "Hotéis",
    slug: "hotel",
    description: "Conforto e serviço completo",
    stars: 5,
  },
  {
    name: "Pousadas",
    slug: "pousada",
    description: "Charme e aconchego",
    stars: 4,
  },
  {
    name: "Hostels",
    slug: "hostel",
    description: "Economia e convivência",
    stars: 3,
  },
  {
    name: "Flats",
    slug: "flat",
    description: "Praticidade e autonomia",
    stars: 4,
  },
];

export function HomeLodging() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.05);

  return (
    <section ref={ref} className="bg-primary-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <SectionHeader
            icon={<BedDouble size={24} className="text-primary-600" />}
            title="Onde Ficar"
            subtitle="Lugares para tornar sua estadia memorável"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LODGING_TYPES.map((type, i) => (
            <Link
              key={type.slug}
              to={`/onde-ficar?tipo=${type.slug}`}
              className={cn(
                "group overflow-hidden rounded-2xl bg-accent-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                "ease-out",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              )}
              style={{
                transitionDuration: `${500 + i * 100}ms`,
                transitionDelay: `${200 + i * 100}ms`,
              }}
            >
              {/* Color bar */}
              <div className="h-2 bg-primary-400 transition-all group-hover:h-3" />

              <div className="p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: type.stars }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className="fill-primary-400 text-primary-400"
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-primary-800">
                  {type.name}
                </h3>
                <p className="mt-1 text-sm text-accent-500">
                  {type.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div
          className={cn(
            "mt-10 text-center transition-all duration-700 ease-out delay-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <Link
            to="/onde-ficar"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-primary-400 px-8 text-primary-700 hover:bg-primary-400 hover:text-accent-50"
            )}
          >
            Ver todas as hospedagens
          </Link>
        </div>
      </div>
    </section>
  );
}
