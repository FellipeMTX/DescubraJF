import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useLodgingEstablishments } from "@/hooks/useLodging";

export function HomeLodging() {
  const { data: lodgings, isLoading } = useLodgingEstablishments();

  return (
    <section
      className="px-14 py-24"
      style={{ background: "var(--color-bl-card)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <div
            className="bl-kicker mb-5"
            style={{ background: "var(--color-bl-bg)" }}
          >
            <span className="bl-num">02.</span> Onde ficar
          </div>
          <div className="flex items-end justify-between gap-10">
            <h2
              className="bl-display m-0 max-w-[12ch]"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              Estadias <span className="bl-em">memoráveis</span>.
            </h2>
            <Link
              to="/onde-ficar"
              className="border-b border-current pb-0.5 text-sm font-medium"
              style={{ color: "var(--color-bl-ink)" }}
            >
              Ver todos os hotéis →
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lodgings?.slice(0, 4).map((h, i) => (
              <Link
                key={h.id}
                to="/onde-ficar"
                className="bl-card block"
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
