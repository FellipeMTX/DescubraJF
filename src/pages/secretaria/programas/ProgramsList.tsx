import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AspectImage } from "@/components/ui/AspectImage";
import { IMAGE_RATIOS } from "@/lib/constants";

/** Programas e Projetos são páginas hardcoded (detalhe em `./*.tsx`). Esta lista é estática
 * — nome e subtítulo vêm do i18n `programas.*`, capas de `public/programas/`. */
const PROGRAMS = [
  { slug: "praca-cervejeira", i18n: "pracaCervejeira", image: "/programas/praca-cervejeira.png" },
  { slug: "edital-de-fomento-ao-turismo", i18n: "editalFomento", image: null },
  { slug: "caminhando-pela-historia", i18n: "caminhandoHistoria", image: "/programas/caminhando-pela-historia.png" },
  { slug: "educatur", i18n: "educatur", image: "/programas/educatur.webp" },
] as const;

export default function ProgramsList() {
  const { t } = useTranslation();

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12">
        <PageHeader
          kicker={t("posts.programs.kicker")}
          title={t("posts.programs.list.title")}
          highlight={t("posts.programs.list.titleHighlight")}
          subtitle={t("posts.programs.list.subtitle")}
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {PROGRAMS.map((program) => (
            <Link
              key={program.slug}
              to={`/secretaria/programas-e-projetos/${program.slug}`}
              className="bl-card block"
              style={{ background: "var(--color-bl-bg)" }}
            >
              <AspectImage
                src={program.image}
                alt={t(`programas.${program.i18n}.title`)}
                ratio={IMAGE_RATIOS.cardLandscape}
                placeholder={
                  <FolderKanban size={40} style={{ color: "var(--color-bl-muted)" }} />
                }
              />
              <div className="p-5">
                <h3 className="bl-display text-xl">
                  {t(`programas.${program.i18n}.title`)}
                </h3>
                <p
                  className="mt-1 line-clamp-2 text-sm"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  {t(`programas.${program.i18n}.description`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
