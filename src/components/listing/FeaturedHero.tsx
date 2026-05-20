import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

type FeaturedHeroProps = {
  imageUrl?: string | null;
  badge: string;
  title: string;
  accent?: string | null;
  meta?: ReactNode;
  ctaLabel: string;
  onOpen: () => void;
};

export function FeaturedHero({
  imageUrl,
  badge,
  title,
  accent,
  meta,
  ctaLabel,
  onOpen,
}: FeaturedHeroProps) {
  const { t } = useTranslation();
  return (
    <section
      className="relative mt-10 overflow-hidden rounded-[32px]"
      style={{ background: "var(--color-bl-card)", minHeight: 480 }}
    >
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(36,21,16,0.05) 0%, rgba(36,21,16,0.18) 50%, rgba(36,21,16,0.85) 100%)",
        }}
      />
      <div
        className="relative z-10 flex flex-col justify-end gap-6 p-12 text-white max-md:p-7"
        style={{ minHeight: 480 }}
      >
        <span
          className="mr-auto inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-widest"
          style={{ background: "rgba(255,255,255,0.92)", color: "var(--color-bl-ink)" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-bl-accent)" }}
          />
          {badge}
        </span>
        <h2 className="bl-display m-0 max-w-[18ch]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
          {title}
          {accent && (
            <>
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-bl-accent2)" }}>{accent}</em>
            </>
          )}
        </h2>
        {meta && (
          <div className="flex flex-wrap gap-5 text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>
            {meta}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:-translate-y-px"
            style={{
              background: "var(--color-bl-ink)",
              color: "var(--color-bl-bg)",
              fontFamily: "var(--font-display)",
            }}
          >
            {ctaLabel}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <span className="sr-only">{t("listing.featuredAria")}</span>
    </section>
  );
}
