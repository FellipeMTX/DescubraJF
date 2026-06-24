import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Lista de páginas a exibir, com reticências para intervalos longos. */
function getPageItems(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < pageCount - 1) items.push("ellipsis");
  items.push(pageCount);
  return items;
}

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const { t } = useTranslation();
  if (pageCount <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return;
    onPageChange(p);
  };

  return (
    <nav
      aria-label={t("common.pagination.label")}
      className={cn("mt-12 flex items-center justify-center gap-1.5", className)}
    >
      <ArrowButton
        ariaLabel={t("common.pagination.previous")}
        disabled={page === 1}
        onClick={() => go(page - 1)}
      >
        <ChevronLeft size={18} />
      </ArrowButton>

      {getPageItems(page, pageCount).map((item, i) =>
        item === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="px-2 text-sm select-none"
            style={{ color: "var(--color-bl-muted)" }}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => go(item)}
            aria-label={t("common.pagination.goToPage", { page: item })}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "h-9 min-w-9 rounded-full px-3 text-sm font-medium transition-colors",
              item === page ? "text-white" : "hover:opacity-80"
            )}
            style={
              item === page
                ? { background: "var(--color-bl-accent)" }
                : { color: "var(--color-bl-ink)", border: "1px solid rgba(0,0,0,0.12)" }
            }
          >
            {item}
          </button>
        )
      )}

      <ArrowButton
        ariaLabel={t("common.pagination.next")}
        disabled={page === pageCount}
        onClick={() => go(page + 1)}
      >
        <ChevronRight size={18} />
      </ArrowButton>
    </nav>
  );
}

function ArrowButton({
  children,
  ariaLabel,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:opacity-80"
      style={{ color: "var(--color-bl-ink)", border: "1px solid rgba(0,0,0,0.12)" }}
    >
      {children}
    </button>
  );
}
