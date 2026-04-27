import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedExperiences } from "@/hooks/useExperiences";

export function HomeExperiences() {
  const { data: experiences, isLoading } = useFeaturedExperiences();

  return (
    <section className="px-14 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid items-end gap-10 md:grid-cols-2">
          <div>
            <div className="bl-kicker mb-5">
              <span className="bl-num">01.</span> O que fazer
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              Tem tudo em <span className="bl-em">Juiz de Fora</span>
            </h2>
          </div>
          <div>
            <p
              className="mb-4 text-base leading-[1.7]"
              style={{ color: "var(--color-bl-muted)" }}
            >
              Dos parques históricos aos mirantes mais celebrados, viva
              experiências inesquecíveis em cada esquina.
            </p>
            <Link to="/atrativos" className="bl-btn-ghost">
              Ver todos os atrativos <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-4/5 rounded-[28px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {experiences?.slice(0, 6).map((exp, i) => (
              <Link
                key={exp.id}
                to="/atrativos"
                className="bl-card aspect-4/5 block"
              >
                {exp.imagem_destaque ? (
                  <img
                    src={exp.imagem_destaque}
                    alt={exp.nome}
                    loading="lazy"
                  />
                ) : (
                  <div className="bl-ph h-full w-full">
                    <span>{exp.nome}</span>
                  </div>
                )}
                {exp.categoria && (
                  <div
                    className="bl-kicker absolute top-4 left-4"
                    style={{
                      background: "var(--color-bl-accent2)",
                      color: "var(--color-bl-ink)",
                    }}
                  >
                    {exp.categoria.nome}
                  </div>
                )}
                <div className="bl-card-overlay">
                  <div
                    className="text-[13px] italic opacity-85"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="bl-display mt-1 text-2xl">{exp.nome}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
