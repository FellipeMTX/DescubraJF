import { Outlet, Link, useLocation } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/clerk-react";
import {
  LayoutDashboard, MapPin, CalendarDays, Image,
  MessageSquare, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Experiências", href: "/admin/experiencias", icon: MapPin },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Eventos", href: "/admin/eventos", icon: CalendarDays },
  { label: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
];

export default function AdminLayout() {
  return (
    <>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 bg-gray-50 p-6">
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
        <h2 className="text-sm font-bold text-gray-900">{SITE_NAME}</h2>
        <p className="text-xs text-gray-500">Painel Admin</p>
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
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600"
          >
            <ChevronLeft size={14} /> Ver site
          </Link>
        </div>
      </div>
    </aside>
  );
}
