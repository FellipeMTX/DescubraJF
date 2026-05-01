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
    <header className="sticky top-4 z-50 mx-4 mt-4 md:mx-6">
      <div
        className="flex items-center gap-4 rounded-full border border-black/5 px-4 py-3 pl-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl"
        style={{ background: "rgba(251,242,232,0.85)" }}
      >
        {/* Logo */}
        <Link to="/" className="flex flex-1 items-center">
          <img
            src="/DescubraHorizontalPreto.png"
            alt={SITE_NAME}
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Nav (centered) */}
        <nav className="hidden flex-none items-center justify-center gap-7 text-[13px] lg:flex">
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
            className="bl-btn-soft hidden md:inline-flex !px-[18px] !py-[10px] !text-[12px]"
          >
            Planejar viagem <ArrowRight size={12} />
          </Link>
          <button
            aria-label="Menu"
            className="rounded-full p-2 lg:hidden"
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
        <div className="absolute left-0 top-full z-50 pt-3">
          <div
            className="min-w-52 overflow-hidden rounded-2xl border border-black/5 p-1.5 shadow-xl"
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
        </div>
      )}
    </div>
  );
}
