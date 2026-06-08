import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { NAV_ITEMS } from "@/lib/constants";
import type { NavItem } from "@/lib/constants";

const navItems = NAV_ITEMS as readonly NavItem[];

const COLUMN_HEADING = "mb-4 text-[11px] font-semibold uppercase tracking-widest";
const FOOTER_LINK = "mb-2 block text-[13px] transition-colors hover:text-bl-ink";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="px-14 pt-20 pb-10"
      style={{ background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-center sm:justify-center sm:gap-20">
          {/* Tourism Department / City Hall logo, alongside the link columns */}
          <a
            href="https://www.pjf.mg.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src="/LogoSeturColor.png"
              alt={t("common.tourismLogoAlt")}
              className="h-11.25 object-contain"
            />
          </a>

          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-16">
            {/* Standalone nav links grouped under one heading */}
            <div>
              <div className={COLUMN_HEADING}>{t("footer.explore")}</div>
              {navItems.map((item) =>
                item.children ? null : (
                  <Link
                    key={item.labelKey}
                    to={item.href}
                    className={FOOTER_LINK}
                    style={{ color: "var(--color-bl-muted)" }}
                  >
                    {t(item.labelKey)}
                  </Link>
                )
              )}
            </div>

            {/* Grouped nav items (one column each) */}
            {navItems.map((item) =>
              item.children ? (
                <div key={item.labelKey}>
                  <div className={COLUMN_HEADING}>{t(item.labelKey)}</div>
                  {item.children.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={FOOTER_LINK}
                      style={{ color: "var(--color-bl-muted)" }}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </div>
              ) : null
            )}
          </div>
        </div>

        <p
          className="mx-auto mt-12 max-w-md text-center text-[12px] leading-relaxed"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {t("footer.cadastur")}
        </p>
      </div>
    </footer>
  );
}
