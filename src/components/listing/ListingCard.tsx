import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin } from "lucide-react";

type ListingCardProps = {
  imageUrl?: string | null;
  title: string;
  badge?: ReactNode;
  subtitle?: string | null;
  description?: string | null;
  view: "grid" | "list";
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  placeholderIcon: ReactNode;
};

export function ListingCard({
  imageUrl,
  title,
  badge,
  subtitle,
  description,
  view,
  isHovered,
  onHover,
  onLeave,
  onClick,
  placeholderIcon,
}: ListingCardProps) {
  const { t } = useTranslation();
  const isList = view === "list";

  if (isList) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border px-5 py-3 text-left transition-all"
        style={{
          background: "var(--color-bl-bg)",
          borderColor: isHovered ? "var(--color-bl-accent)" : "rgba(36,21,16,0.06)",
          boxShadow: isHovered
            ? "0 0 0 2px var(--color-bl-accent)"
            : undefined,
        }}
      >
        <div className="min-w-0 flex-1">
          <h3
            className="bl-display m-0 truncate font-medium"
            style={{ fontSize: 15, lineHeight: 1.3 }}
          >
            {title}
          </h3>
          {subtitle && (
            <span
              className="inline-flex items-center gap-1 text-[12px]"
              style={{ color: "var(--color-bl-muted)", fontFamily: "var(--font-display)" }}
            >
              <MapPin size={11} />
              {subtitle}
            </span>
          )}
        </div>

        {badge && <span className="shrink-0">{badge}</span>}

        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all group-hover:translate-x-1"
          style={{
            background: isHovered ? "var(--color-bl-ink)" : "var(--color-bl-card)",
            color: isHovered ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
          }}
        >
          <ArrowRight size={12} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border text-left transition-all"
      style={{
        background: "var(--color-bl-bg)",
        borderColor: isHovered ? "var(--color-bl-accent)" : "rgba(36,21,16,0.06)",
        boxShadow: isHovered
          ? "0 0 0 2px var(--color-bl-accent), 0 20px 48px -16px rgba(36,21,16,0.18)"
          : undefined,
        transform: isHovered ? "translateY(-4px)" : undefined,
      }}
    >
      <div
        className="relative aspect-3/2 overflow-hidden"
        style={{ background: "var(--color-bl-card)" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">{placeholderIcon}</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5">
          <h3
            className="bl-display m-0 min-w-0 font-medium"
            style={{ fontSize: 18, lineHeight: 1.2 }}
          >
            {title}
          </h3>
          {badge && <span className="mt-0.5 max-w-full shrink-0">{badge}</span>}
        </div>

        {subtitle && (
          <span
            className="inline-flex items-center gap-1.5 text-[12px]"
            style={{ color: "var(--color-bl-muted)", fontFamily: "var(--font-display)" }}
          >
            <MapPin size={12} />
            {subtitle}
          </span>
        )}

        {description && (
          <p
            className="m-0 flex-1 text-[12px] italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}

        <div
          className="mt-auto flex items-center justify-between pt-2.5"
          style={{
            borderTop: "1px dashed rgba(36,21,16,0.12)",
            fontFamily: "var(--font-display)",
          }}
        >
          <span className="text-[12px] font-medium" style={{ color: "var(--color-bl-ink)" }}>
            {t("listing.viewDetails")}
          </span>
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-all group-hover:translate-x-1"
            style={{
              background: isHovered ? "var(--color-bl-ink)" : "var(--color-bl-card)",
              color: isHovered ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
            }}
          >
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </button>
  );
}
