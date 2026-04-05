import { Outlet, Link, useLocation } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/clerk-react";
import {
  MapPin, CalendarDays, Image, UtensilsCrossed, BedDouble, Route, ChevronLeft, Briefcase, Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Atrativos", href: "/admin", icon: MapPin },
  { label: "Gastronomia", href: "/admin/gastronomia", icon: UtensilsCrossed },
  { label: "Hospedagens", href: "/admin/hospedagens", icon: BedDouble },
  { label: "Roteiros", href: "/admin/roteiros", icon: Route },
  { label: "Serviços", href: "/admin/servicos", icon: Briefcase },
  { label: "Passeios", href: "/admin/passeios", icon: Compass },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Eventos", href: "/admin/eventos", icon: CalendarDays },
];

export default function AdminLayout() {
  return (
    <>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-muted">
          <div className="w-full max-w-md">
            <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
              Painel Administrativo
            </h1>
            <SignIn routing="hash" forceRedirectUrl="/admin" />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto bg-muted p-6">
            <Outlet />
          </main>
        </div>
      </SignedIn>
    </>
  );
}

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="flex w-64 flex-col border-r bg-white">
      {/* Header */}
      <div className="border-b p-4">
        <img src="/descubraLogo.png" alt={SITE_NAME} className="h-8" />
        <p className="mt-1 text-xs text-muted-foreground">Painel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  to={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <UserButton />
          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary-600"
          >
            <ChevronLeft size={14} /> Ver site
          </Link>
        </div>
      </div>
    </aside>
  );
}
