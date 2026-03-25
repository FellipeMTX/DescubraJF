import { Link } from "react-router";
import { Globe, ExternalLink } from "lucide-react";
import { SITE_NAME, NAV_ITEMS, SOCIAL_LINKS } from "../../lib/constants";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Top section: logos placeholder */}
        <div className="mb-8 flex flex-wrap items-center gap-6">
          <div className="flex h-12 items-center rounded bg-gray-700 px-4 text-xs text-gray-400">
            Logo Prefeitura
          </div>
          <div className="flex h-12 items-center rounded bg-gray-700 px-4 text-xs text-gray-400">
            Logo Setur
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {(NAV_ITEMS as readonly NavItem[]).map((item) => (
            <div key={item.label}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                {item.label}
              </h3>
              {item.children ? (
                <ul className="space-y-2">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        to={child.href}
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Ir para {item.label}
                </Link>
              ) : null}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700" />

        {/* Bottom: social + copyright */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex gap-4">
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="text-gray-400 hover:text-white">
              <Globe size={20} />
            </a>
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook" className="text-gray-400 hover:text-white">
              <Globe size={20} />
            </a>
            <a href={SOCIAL_LINKS.youtube} aria-label="YouTube" className="text-gray-400 hover:text-white">
              <ExternalLink size={20} />
            </a>
            <a href={SOCIAL_LINKS.twitter} aria-label="Twitter" className="text-gray-400 hover:text-white">
              <ExternalLink size={20} />
            </a>
          </div>

          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME} - Secretaria de Turismo de Juiz de Fora
          </p>
        </div>
      </div>
    </footer>
  );
}
