import { Link } from "react-router";
import { UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const DINING_CATEGORIES = [
  { name: "Cozinha Mineira", slug: "cozinha-mineira", emoji: "🍳" },
  { name: "Bares e Botecos", slug: "bares-e-botecos", emoji: "🍺" },
  { name: "Cafés e Confeitarias", slug: "cafes-e-confeitarias", emoji: "☕" },
  { name: "Pizzarias e Massas", slug: "pizzarias-e-massas", emoji: "🍕" },
  { name: "Cervejarias", slug: "cervejarias-e-drinks", emoji: "🍷" },
  { name: "Bar na Rua", slug: "bar-na-rua", emoji: "🎉" },
];

export function HomeDining() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.05);

  return (
    <section ref={ref} className="bg-primary-800 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <SectionHeader
            icon={<UtensilsCrossed size={24} className="text-primary-200" />}
            title="Onde Comer e Beber"
            subtitle="Experimente tudo que nossa gastronomia oferece"
            dark
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {DINING_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/onde-comer?categoria=${cat.slug}`}
              className={cn(
                "group flex items-center gap-4 rounded-xl bg-primary-700 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-600 hover:shadow-lg",
                "ease-out",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              )}
              style={{
                transitionDuration: `${500 + i * 80}ms`,
                transitionDelay: `${200 + i * 80}ms`,
              }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <h3 className="font-bold text-accent-50">{cat.name}</h3>
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
            to="/onde-comer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-primary-400 px-8 text-primary-200 hover:bg-primary-400 hover:text-accent-50"
            )}
          >
            Ver todos os estabelecimentos
          </Link>
        </div>
      </div>
    </section>
  );
}
