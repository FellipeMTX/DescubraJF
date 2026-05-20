import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "group relative flex cursor-pointer overflow-hidden rounded-3xl border text-left transition-all",
        isList ? "flex-row max-sm:flex-col" : "flex-col"
      )}
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
        className={cn(
          "relative overflow-hidden",
          isList ? "shrink-0 basis-[38%] max-sm:aspect-[4/3] max-sm:basis-auto" : "aspect-[4/3]"
        )}
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

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="bl-display m-0 font-medium" style={{ fontSize: 22, lineHeight: 1.15 }}>
            {title}
          </h3>
          {badge && <span className="mt-0.5 shrink-0">{badge}</span>}
        </div>

        {subtitle && (
          <span
            className="inline-flex items-center gap-1.5 text-[13px]"
            style={{ color: "var(--color-bl-muted)", fontFamily: "var(--font-display)" }}
          >
            <MapPin size={13} />
            {subtitle}
          </span>
        )}

        {description && (
          <p
            className="m-0 flex-1 text-[13px] italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
              lineHeight: 1.55,
            }}
          >
            {description}
          </p>
        )}

        <div
          className="mt-auto flex items-center justify-between pt-3.5"
          style={{
            borderTop: "1px dashed rgba(36,21,16,0.12)",
            fontFamily: "var(--font-display)",
          }}
        >
          <span className="text-[13px] font-medium" style={{ color: "var(--color-bl-ink)" }}>
            {t("listing.viewDetails")}
          </span>
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all group-hover:translate-x-1"
            style={{
              background: isHovered ? "var(--color-bl-ink)" : "var(--color-bl-card)",
              color: isHovered ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
            }}
          >
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}
