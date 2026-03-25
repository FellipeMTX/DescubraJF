import { useState } from "react";
import { Link } from "react-router";
import { Search, Menu, ChevronDown } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "../../lib/constants";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary-700">
          {SITE_NAME}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {(NAV_ITEMS as readonly NavItem[]).map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : item.href ? (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
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
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            <Search size={20} />
          </button>

          {/* Language selector placeholder */}
          <div className="hidden items-center gap-1 text-xs font-medium text-gray-400 sm:flex">
            <span className="rounded bg-primary-600 px-1.5 py-0.5 text-white">
              PT
            </span>
            <span className="cursor-not-allowed px-1.5 py-0.5">EN</span>
            <span className="cursor-not-allowed px-1.5 py-0.5">ES</span>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Menu"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
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
      <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700">
        {item.label}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
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
