import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Search, Menu, ChevronDown } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-primary-700/95 shadow-lg backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/descubraLogo.png"
            alt={SITE_NAME}
            className={cn(
              "transition-all duration-300",
              transparent ? "h-16" : "h-10"
            )}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {(NAV_ITEMS as readonly NavItem[]).map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : item.href ? (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ) : null
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Buscar"
            className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search size={20} />
          </button>

          {/* Language selector */}
          <div className="hidden items-center gap-1 text-xs font-medium sm:flex">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-white">
              PT
            </span>
            <span className="cursor-not-allowed px-2 py-0.5 text-white/40">EN</span>
            <span className="cursor-not-allowed px-2 py-0.5 text-white/40">ES</span>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Menu"
            className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
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
      <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white">
        {item.label}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-52 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-xl">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
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
