import { useState } from "react";
import { Link } from "react-router";
import { Menu, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-4 mt-4 md:mx-6">
      <div
        className="flex items-center justify-between gap-4 rounded-full border border-black/5 px-4 py-3 pl-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl"
        style={{ background: "rgba(251,242,232,0.85)" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-base"
            style={{
              background: "var(--color-bl-ink)",
              color: "var(--color-bl-bg)",
              fontFamily: "var(--font-display)",
            }}
          >
            JF
          </div>
          <div className="leading-[1.05]">
            <div
              className="text-[9px] uppercase tracking-widest"
              style={{ color: "var(--color-bl-muted)" }}
            >
              descubra
            </div>
            <div className="bl-display text-[17px]">
              Juiz de <span className="bl-em">Fora</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 text-[13px] lg:flex">
          {(NAV_ITEMS as readonly NavItem[]).map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : item.href ? (
              <Link key={item.label} to={item.href} className="bl-navlink">
                {item.label}
              </Link>
            ) : null
          )}
        </nav>

        <button
          aria-label="Menu"
          className="rounded-full p-2 lg:hidden"
          style={{ color: "var(--color-bl-ink)" }}
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function NavDropdown({
  item,
}: {
  item: { label: string; children: ReadonlyArray<{ label: string; href: string }> };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="bl-navlink flex items-center gap-1">
        {item.label}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-3 min-w-52 overflow-hidden rounded-2xl border border-black/5 p-1.5 shadow-xl"
          style={{ background: "var(--color-bl-bg)" }}
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bl-card)]"
              style={{ color: "var(--color-bl-ink)" }}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
