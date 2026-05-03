import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { NAV_ITEMS } from "../../lib/constants";
import { LanguageSelector } from "./LanguageSelector";

type NavItem =
  | { labelKey: string; href: string; children?: undefined }
  | { labelKey: string; children: ReadonlyArray<{ labelKey: string; href: string }>; href?: undefined };

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-72 shadow-xl"
        style={{ background: "var(--color-bl-bg)" }}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
          <span
            className="bl-display text-base"
            style={{ color: "var(--color-bl-ink)" }}
          >
            {t("common.siteName")}
          </span>
          <button
            aria-label={t("common.closeMenu")}
            onClick={onClose}
            className="rounded-md p-1 transition-colors hover:text-bl-ink"
            style={{ color: "var(--color-bl-muted)" }}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          {(NAV_ITEMS as readonly NavItem[]).map((item) =>
            item.children ? (
              <MobileDropdown key={item.labelKey} item={item} onClose={onClose} />
            ) : item.href ? (
              <Link
                key={item.labelKey}
                to={item.href}
                onClick={onClose}
                className="px-4 py-3 text-sm font-medium transition-colors hover:bg-bl-card"
                style={{ color: "var(--color-bl-ink)" }}
              >
                {t(item.labelKey)}
              </Link>
            ) : null
          )}

          <div className="border-t border-black/5 px-2 py-2">
            <LanguageSelector variant="mobile" />
          </div>
        </nav>
      </div>
    </>
  );
}

function MobileDropdown({
  item,
  onClose,
}: {
  item: { labelKey: string; children: ReadonlyArray<{ labelKey: string; href: string }> };
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-bl-card"
        style={{ color: "var(--color-bl-ink)" }}
        onClick={() => setExpanded(!expanded)}
      >
        {t(item.labelKey)}
        <span style={{ color: "var(--color-bl-muted)" }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div style={{ background: "var(--color-bl-bg)" }}>
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={onClose}
              className="block py-2.5 pl-8 pr-4 text-sm transition-colors hover:text-bl-ink"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {t(child.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
