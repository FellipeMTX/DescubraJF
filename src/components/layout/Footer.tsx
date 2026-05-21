import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const FOOTER_COLUMNS: ReadonlyArray<{
  titleKey: string;
  links: ReadonlyArray<{ labelKey: string; href: string }>;
}> = [
  {
    titleKey: "footer.columns.history",
    links: [{ labelKey: "footer.links.history", href: "/juiz-de-fora/historia" }],
  },
  {
    titleKey: "footer.columns.whatToDo",
    links: [
      { labelKey: "footer.links.attractions", href: "/atrativos" },
      { labelKey: "footer.links.routes", href: "/roteiros" },
      { labelKey: "footer.links.events", href: "/agenda" },
    ],
  },
  {
    titleKey: "footer.columns.whereToEat",
    links: [{ labelKey: "footer.links.establishments", href: "/onde-comer" }],
  },
  {
    titleKey: "footer.columns.whereToStay",
    links: [{ labelKey: "footer.links.lodging", href: "/onde-ficar" }],
  },
  {
    titleKey: "footer.columns.services",
    links: [{ labelKey: "footer.links.institutional", href: "/servicos" }],
  },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="px-14 pt-20 pb-10"
      style={{ background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-black/10 pb-14 md:grid-cols-5">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.titleKey}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest">
                {t(col.titleKey)}
              </div>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="mb-2 block text-[13px] transition-colors hover:text-[var(--color-bl-ink)]"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center pt-12">
          <a
            href="https://www.pjf.mg.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/LogoSeturColor.png"
              alt={t("common.tourismLogoAlt")}
              className="h-20 object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
