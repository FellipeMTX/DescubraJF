import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useDiningCategories } from "@/hooks/useDining";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const FALLBACK = [
  { name: "Cozinha Mineira", slug: "cozinha-mineira", emoji: "🥘" },
  { name: "Bares e Botecos", slug: "bares-e-botecos", emoji: "🍺" },
  { name: "Cafés e Confeitarias", slug: "cafes-e-confeitarias", emoji: "☕" },
  { name: "Pizzarias e Massas", slug: "pizzarias-e-massas", emoji: "🍕" },
  { name: "Cervejarias", slug: "cervejarias-e-drinks", emoji: "🍷" },
  { name: "Bar na Rua", slug: "bar-na-rua", emoji: "🎉" },
];

export function HomeDining() {
  const { data: categories } = useDiningCategories();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>(0.12);
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.1);

  const cats = categories?.length
    ? categories.map((c) => ({
        name: c.nome,
        slug: c.slug,
        emoji: c.icone || "🍽️",
      }))
    : FALLBACK;

  return (
    <section className="px-14 py-16">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[1fr_1.6fr]">
        <div
          ref={headerRef}
          className={cn(
            "reveal self-start md:sticky md:top-28",
            headerVisible && "in"
          )}
        >
          <div className="bl-kicker mb-5">
            <span className="bl-num">03.</span> Onde comer e beber
          </div>
          <h2
            className="bl-display m-0 mb-6"
            style={{ fontSize: "clamp(40px, 4.4vw, 56px)" }}
          >
            Sabores das <span className="bl-em">Geraes</span>.
          </h2>
          <p
            className="mb-7 text-base leading-[1.7]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            Da cozinha mineira tradicional aos botecos de esquina, experimente
            tudo o que nossa gastronomia oferece.
          </p>
          <Link to="/onde-comer" className="bl-btn-soft">
            Ver estabelecimentos <ArrowRight size={14} />
          </Link>
        </div>
        <div
          ref={gridRef}
          className={cn(
            "reveal-stagger grid gap-3 sm:grid-cols-2",
            gridVisible && "in"
          )}
        >
          {cats.map((c) => (
            <Link
              key={c.slug}
              to={`/onde-comer?categoria=${c.slug}`}
              className="bl-food-tile bl-card-pop"
            >
              <span className="text-[28px] leading-none">{c.emoji}</span>
              <div className="flex-1">
                <div className="bl-display text-lg">{c.name}</div>
                <div
                  className="bl-food-tile-meta mt-0.5 text-[11px]"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  Estabelecimentos
                </div>
              </div>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
