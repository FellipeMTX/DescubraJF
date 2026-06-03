import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type CtaProps = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

type Props = {
  title: string;
  description?: string;
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
  /** Watermark opcional (silhueta da cidade etc.) — recebe um ReactNode posicionado a esquerda. */
  watermark?: ReactNode;
};

function CtaButton({ cta, variant }: { cta: CtaProps; variant: "yellow" | "outline" }) {
  const Icon = cta.icon;
  const baseStyle =
    variant === "yellow"
      ? {
          background: "var(--color-bl-prog-cta-yellow)",
          color: "var(--color-bl-prog-cta-bg)",
          border: "1px solid transparent",
        }
      : { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.45)" };
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

export function BottomCTAStrip({ title, description, primaryCta, secondaryCta, watermark }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-[18px] px-7 py-6 md:px-10 md:py-8"
      style={{ background: "var(--color-bl-prog-cta-bg)" }}
    >
      {watermark && (
        <div
          className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 opacity-30 md:block"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {watermark}
        </div>
      )}

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="md:pl-32">
          <h3
            className="bl-prog-display m-0 leading-tight"
            style={{
              fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="m-0 mt-2 text-[13.5px] leading-snug"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {description}
            </p>
          )}
        </div>

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap gap-3 md:shrink-0">
            {primaryCta && <CtaButton cta={primaryCta} variant="yellow" />}
            {secondaryCta && <CtaButton cta={secondaryCta} variant="outline" />}
          </div>
        )}
      </div>
    </section>
  );
}
