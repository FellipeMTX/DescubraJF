import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedLodgings } from "@/hooks/useLodging";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function HomeLodging() {
  const { data: lodgings, isLoading } = useFeaturedLodgings(4);
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>(0.12);
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section
      className="px-14 py-16"
      style={{ background: "var(--color-bl-card)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef}
          className={cn(
            "reveal mb-12 grid items-center gap-10 md:grid-cols-2",
            headerVisible && "in"
          )}
        >
          <div>
            <div
              className="bl-kicker mb-5"
              style={{ background: "var(--color-bl-bg)" }}
            >
              <span className="bl-num">02.</span> Onde ficar
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              Estadias <span className="bl-em">memoráveis</span>.
            </h2>
          </div>
          <div>
            <p
              className="mb-4 text-base leading-[1.7]"
              style={{ color: "var(--color-bl-muted)" }}
            >
              De pousadas charmosas a hotéis premium, encontre o lugar
              perfeito para descansar e aproveitar a cidade.
            </p>
            <Link to="/onde-ficar" className="bl-btn-soft-light">
              Ver todos os hotéis <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-[28px]" />
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className={cn(
              "reveal-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
              gridVisible && "in"
            )}
          >
            {lodgings?.map((h, i) => (
              <Link
                key={h.id}
                to="/onde-ficar"
                className="bl-card bl-card-pop block"
                style={{ background: "var(--color-bl-bg)" }}
              >
                <div className="relative aspect-3/4 overflow-hidden">
                  {h.imagem_destaque ? (
                    <img
                      src={h.imagem_destaque}
                      alt={h.nome}
                      loading="lazy"
                    />
                  ) : (
                    <div className="bl-ph h-full w-full">
                      <span>{h.nome}</span>
                    </div>
                  )}
                  <div
                    className="bl-kicker absolute top-3 left-3 text-[10px]"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {h.tipo || "Hotel"}
                  </div>
                </div>
                <div className="p-[18px]">
                  {h.estrelas ? (
                    <div className="mb-1.5 flex gap-px">
                      {Array.from({ length: h.estrelas }).map((_, j) => (
                        <span key={j} style={{ color: "var(--color-bl-accent2)" }}>
                          ★
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="bl-display text-xl">{h.nome}</div>
                  <div
                    className="mt-1 text-xs italic"
                    style={{
                      color: "var(--color-bl-muted)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {h.descricao_curta || `Hospedagem ${i + 1}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
