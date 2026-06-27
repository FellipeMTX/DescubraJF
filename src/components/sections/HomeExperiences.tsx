import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectImage } from "@/components/ui/AspectImage";
import { useFeaturedExperiences } from "@/hooks/useExperiences";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IMAGE_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HomeExperiences() {
  const { t } = useTranslation();
  const { data: experiences, isLoading } = useFeaturedExperiences();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>(0.12);
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section className="px-14 py-16">
      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef}
          className={cn(
            "reveal mb-12 grid items-center gap-10 md:grid-cols-2",
            headerVisible && "in"
          )}
        >
          <div>
            <div className="bl-kicker mb-5">
              <span className="bl-num">01.</span> {t("home.experiences.kicker")}
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              {t("home.experiences.title")} <span className="bl-em block">{t("home.experiences.titleHighlight")}</span>
            </h2>
          </div>
          <div>
            <p
              className="mb-4 text-base leading-[1.7]"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {t("home.experiences.description")}
            </p>
            <Link to="/atrativos" className="bl-btn-soft">
              {t("home.experiences.cta")} <ArrowRight size={14} />
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
          <div
            ref={gridRef}
            className={cn(
              "reveal-stagger grid gap-5 sm:grid-cols-2 md:grid-cols-3",
              gridVisible && "in"
            )}
          >
            {experiences?.slice(0, 6).map((exp, i) => (
              <Link
                key={exp.id}
                to={`/atrativos?slug=${exp.slug}`}
                className="bl-card bl-card-pop block"
              >
                <AspectImage
                  src={exp.imagem_destaque}
                  alt={exp.nome}
                  ratio={IMAGE_RATIOS.cardPortrait}
                  placeholder={<span>{exp.nome}</span>}
                >
                  {exp.categorias.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {exp.categorias.map((cat) => (
                        <div
                          key={cat.id}
                          className="bl-kicker"
                          style={{
                            background: "var(--color-bl-accent2)",
                            color: "var(--color-bl-ink)",
                          }}
                        >
                          {cat.nome}
                        </div>
                      ))}
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
                </AspectImage>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
