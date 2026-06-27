import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Camera,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Award,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import type { NavItem } from "@/lib/constants";

const navItems = NAV_ITEMS as readonly NavItem[];

// Flat nav entries (no submenu) feed the "Explorar" column
const exploreLinks = navItems.filter(
  (item): item is Extract<NavItem, { href: string }> => item.children === undefined
);

function groupChildren(labelKey: string) {
  const item = navItems.find((i) => i.labelKey === labelKey);
  return item?.children ?? [];
}

const HEADING =
  "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-bl-ink";
const LINK = "block text-[13px] text-bl-muted transition-colors hover:text-bl-ink";
const BADGE =
  "flex size-12 shrink-0 items-center justify-center rounded-full bg-bl-card text-bl-ink";
const DIVIDER = "my-12 border-t border-bl-muted/20";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const navColumns = [
    { Icon: MapPin, heading: t("footer.explore"), links: exploreLinks },
    { Icon: Camera, heading: t("nav.whatToDo"), links: groupChildren("nav.whatToDo") },
    { Icon: Building2, heading: t("nav.tourismDept"), links: groupChildren("nav.tourismDept") },
  ];

  const contactItems = [
    { Icon: Phone, label: t("footer.phoneLabel"), lines: ["(32) 2104-8171"] },
    { Icon: Mail, label: t("footer.emailLabel"), lines: ["seturjf@gmail.com"] },
    {
      Icon: MapPin,
      label: t("footer.addressLabel"),
      lines: ["Avenida Brasil, 2001", "5º andar – Centro"],
    },
  ];

  return (
    <footer className="bg-bl-bg text-bl-ink">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-10 lg:px-14">
        {/* Brand + navigation */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <a
              href="https://www.pjf.mg.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="/LogoSeturColor.png"
                alt={t("common.tourismLogoAlt")}
                className="h-12 object-contain"
              />
            </a>
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-bl-muted">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 h-px w-40 bg-bl-muted/25" />
          </div>

          {navColumns.map(({ Icon, heading, links }) => (
            <div key={heading}>
              <div className={HEADING}>
                <Icon size={16} className="text-bl-accent2" />
                {heading}
              </div>
              <nav className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <Link key={link.href} to={link.href} className={LINK}>
                    {t(link.labelKey)}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className={DIVIDER} />

        {/* Contact */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems.map(({ Icon, label, lines }) => (
            <div key={label} className="flex items-center gap-4">
              <span className={BADGE}>
                <Icon size={20} />
              </span>
              <div>
                <div className={HEADING}>{label}</div>
                <div className="mt-1.5 space-y-0.5 text-[13px] text-bl-muted">
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* CADASTUR seal */}
          <div className="flex items-center gap-4">
            <span className={BADGE}>
              <Award size={20} />
            </span>
            {/* Logo oficial transparente; <img> w-auto fica do tamanho da logo */}
            <a
              href="https://cadastur.turismo.gov.br/hotsite/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cadastur"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <img src="/cadastur-logo.webp" alt="Cadastur" className="h-9 w-auto" />
            </a>
          </div>
        </div>

        <div className={DIVIDER} />

        {/* CADASTUR compliance notice */}
        <div className="flex items-center justify-center gap-2 text-center text-[12px] text-bl-muted">
          <ShieldCheck size={16} className="shrink-0 text-bl-accent2" />
          <span>{t("footer.cadastur")}</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-bl-ink">
        <p className="mx-auto max-w-7xl px-6 py-5 text-center text-[12px] text-bl-bg/70 sm:px-10 lg:px-14">
          {t("footer.rights", { year })}
        </p>
      </div>
    </footer>
  );
}
