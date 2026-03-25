import { useState } from "react";
import { Link } from "react-router";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "../../lib/constants";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-bold text-primary-700">{SITE_NAME}</span>
          <button
            aria-label="Fechar menu"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          {(NAV_ITEMS as readonly NavItem[]).map((item) =>
            item.children ? (
              <MobileDropdown key={item.label} item={item} onClose={onClose} />
            ) : item.href ? (
              <Link
                key={item.label}
                to={item.href}
                onClick={onClose}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {item.label}
              </Link>
            ) : null
          )}
        </nav>
      </div>
    </>
  );
}

function MobileDropdown({
  item,
  onClose,
}: {
  item: { label: string; children: ReadonlyArray<{ label: string; href: string }> };
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50"
        onClick={() => setExpanded(!expanded)}
      >
        {item.label}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="bg-gray-50">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={onClose}
              className="block py-2.5 pl-8 pr-4 text-sm text-gray-600 hover:text-primary-700"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
