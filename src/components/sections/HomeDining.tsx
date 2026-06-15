import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectImage } from "@/components/ui/AspectImage";
import { useDiningEstablishments } from "@/hooks/useDining";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IMAGE_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { EstabelecimentoGastronomia } from "@/types/database";

// Multi-unit brands (e.g. "Aceite Forneria Independência" / "Aceite Forneria Jardim Norte")
// would repeat on the teaser. Key by the first two words of the name to keep one per brand.
function brandKey(nome: string): string {
  return nome
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");
}

function pickDistinctBrands(list: EstabelecimentoGastronomia[], limit: number) {
  const seen = new Set<string>();
  const out: EstabelecimentoGastronomia[] = [];
  for (const est of list) {
    const key = brandKey(est.nome);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(est);
    if (out.length === limit) break;
  }
  return out;
}

export function HomeDining() {
  const { t } = useTranslation();
  const { data: establishments, isLoading } = useDiningEstablishments();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>(0.12);
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>(0.1);

  const featured = pickDistinctBrands(establishments ?? [], 3);

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
              <span className="bl-num">03.</span> {t("home.dining.kicker")}
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              {t("home.dining.title")} <span className="bl-em">{t("home.dining.titleHighlight")}</span>{t("home.dining.titleSuffix")}
            </h2>
          </div>
          <div>
            <p
              className="mb-4 text-base leading-[1.7]"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {t("home.dining.description")}
            </p>
            <Link to="/onde-comer" className="bl-btn-soft">
              {t("home.dining.cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-[28px]" />
            ))}
          </div>
        ) : featured.length ? (
          <div
            ref={gridRef}
            className={cn(
              "reveal-stagger grid gap-5 sm:grid-cols-2 md:grid-cols-3",
              gridVisible && "in"
            )}
          >
            {featured.map((est, i) => (
              <Link
                key={est.id}
                to="/onde-comer"
                className="bl-card bl-card-pop block"
                style={{ background: "var(--color-bl-card)" }}
              >
                <AspectImage
                  src={est.imagem_destaque}
                  alt={est.nome}
                  ratio={IMAGE_RATIOS.cardSquare}
                  placeholder={<span>{est.nome}</span>}
                >
                  {est.categorias?.[0] && (
                    <div
                      className="bl-kicker absolute top-4 left-4"
                      style={{
                        background: "var(--color-bl-accent2)",
                        color: "var(--color-bl-ink)",
                      }}
                    >
                      {est.categorias[0].nome}
                    </div>
                  )}
                </AspectImage>
                <div className="p-5">
                  <div
                    className="text-[13px] italic opacity-70"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-bl-muted)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="bl-display mt-1 text-2xl">{est.nome}</div>
                  {est.bairro && (
                    <div
                      className="mt-2 flex items-center gap-1.5 text-[13px]"
                      style={{ color: "var(--color-bl-muted)" }}
                    >
                      <MapPin size={12} /> {est.bairro}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p
            className="text-sm italic"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {t("home.dining.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
