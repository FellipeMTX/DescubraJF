import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Menu, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import type { NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div
        className="flex items-center gap-4 border-b border-black/5 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl md:px-10"
        style={{ background: "rgba(251,242,232,0.85)" }}
      >
        {/* Logo */}
        <Link to="/" className="relative flex h-16 flex-1 items-center">
          <img
            src="/DescubraHorizontalPreto.png"
            alt={t("common.siteName")}
            className="absolute left-0 h-24 w-auto"
          />
        </Link>

        {/* Desktop Nav (centered) */}
        <nav className="hidden flex-none items-center justify-center gap-7 text-[14px] lg:flex">
          {(NAV_ITEMS as readonly NavItem[]).map((item) =>
            item.children ? (
              <NavDropdown key={item.labelKey} item={item} />
            ) : item.href ? (
              <Link key={item.labelKey} to={item.href} className="bl-navlink">
                {t(item.labelKey)}
              </Link>
            ) : null
          )}
        </nav>

        {/* Right: language + mobile menu */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <LanguageSelector variant="header" />
          <button
            aria-label={t("common.menu")}
            className="p-2 lg:hidden"
            style={{ color: "var(--color-bl-ink)" }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function NavDropdown({
  item,
}: {
  item: { labelKey: string; children: ReadonlyArray<{ labelKey: string; href: string }> };
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="bl-navlink flex cursor-pointer items-center gap-1">
        {t(item.labelKey)}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full z-50 pt-3 -translate-x-1/2 left-1/2" style={{ minWidth: "200px" }}>
          <div
            className="overflow-hidden rounded-2xl border border-black/5 p-1.5 shadow-xl"
            style={{ background: "var(--color-bl-bg)" }}
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className="bl-navlink block px-4 py-2.5 text-center text-sm"
                onClick={() => setOpen(false)}
              >
                {t(child.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
