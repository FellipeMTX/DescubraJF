import { useState } from "react";
import { Link } from "react-router";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };

export function Header() {
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
            alt={SITE_NAME}
            className="absolute left-0 h-24 w-auto"
          />
        </Link>

        {/* Desktop Nav (centered) */}
        <nav className="hidden flex-none items-center justify-center gap-7 text-[14px] lg:flex">
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

        {/* Right CTA + mobile menu */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            to="/roteiros"
            className="bl-btn-soft hidden md:inline-flex px-4.5! py-2.5! text-[13px]!"
          >
            Planejar viagem <ArrowRight size={12} />
          </Link>
          <button
            aria-label="Menu"
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
  item: { label: string; children: ReadonlyArray<{ label: string; href: string }> };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="bl-navlink flex cursor-pointer items-center gap-1">
        {item.label}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-full pt-3">
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
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
