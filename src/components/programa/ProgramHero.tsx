import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type CtaProps = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

type MetaItem = {
  icon: LucideIcon;
  label: string;
};

type Props = {
  title: string;
  description?: string;
  meta?: MetaItem[];
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
  image?: ReactNode;
  /** Default `var(--color-bl-prog-accent)`. Pass another token (ex.: ink) para titulos escuros (Caminhando pela Historia). */
  titleColor?: string;
  /** Slot opcional posicionado absolutamente sobre a imagem (ex.: HeroQuoteOverlay). */
  quoteOverlay?: ReactNode;
};

function CtaButton({ cta, variant }: { cta: CtaProps; variant: "primary" | "secondary" }) {
  const Icon = cta.icon;
  const baseStyle =
    variant === "primary"
      ? { background: "var(--color-bl-prog-cta-bg)", color: "#fff", border: "1px solid transparent" }
      : {
          background: "var(--color-bl-prog-bg)",
          color: "var(--color-bl-prog-ink)",
          border: "1px solid var(--color-bl-prog-line)",
        };
  const inner = (
    <>
      {Icon && <Icon size={16} />}
      <span>{cta.label}</span>
    </>
  );
  const className =
    "inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13.5px] font-semibold no-underline transition-opacity hover:opacity-90";
  if (cta.href) {
    return (
      <a href={cta.href} className={className} style={baseStyle}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={cta.onClick} className={className} style={baseStyle}>
      {inner}
    </button>
  );
}

export function ProgramHero({
  title,
  description,
  meta,
  primaryCta,
  secondaryCta,
  image,
  titleColor,
  quoteOverlay,
}: Props) {
  return (
    <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_1.1fr] md:gap-12">
      <div className="flex flex-col">
        <h1
          className="bl-prog-display m-0 leading-[1.05]"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
            color: titleColor ?? "var(--color-bl-prog-accent)",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="m-0 mt-5 text-[15px] leading-relaxed"
            style={{ color: "var(--color-bl-prog-ink)", maxWidth: "32ch" }}
          >
            {description}
          </p>
        )}

        {meta && meta.length > 0 && (
          <div
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]"
            style={{ color: "var(--color-bl-prog-ink)" }}
          >
            {meta.map((m, i) => {
              const Icon = m.icon;
              return (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <Icon size={14} style={{ color: "var(--color-bl-prog-accent)" }} />
                  {m.label}
                </span>
              );
            })}
          </div>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {primaryCta && <CtaButton cta={primaryCta} variant="primary" />}
            {secondaryCta && <CtaButton cta={secondaryCta} variant="secondary" />}
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-[18px]"
        style={{ background: "var(--color-bl-prog-soft)", aspectRatio: "5 / 4" }}
      >
        {image}
        {quoteOverlay}
      </div>
    </section>
  );
}
