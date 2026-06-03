import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Cta = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

type Props = {
  eyebrow?: string;
  titulo: string;
  tituloAccent?: string;
  subtitulo?: string;
  descricao?: string;
  image?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

function CtaButton({ cta, variant }: { cta: Cta; variant: "primary" | "secondary" }) {
  const Icon = cta.icon;
  const baseStyle =
    variant === "primary"
      ? { background: "var(--color-bl-prog-cta-bg)", color: "#fff", border: "1px solid transparent" }
      : {
          background: "transparent",
          color: "var(--color-bl-prog-ink)",
          border: "1px solid var(--color-bl-prog-line)",
        };
  const className =
    "inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-[13.5px] font-semibold no-underline transition-opacity hover:opacity-90";
  const inner = (
    <>
      {Icon && <Icon size={16} />}
      <span>{cta.label}</span>
    </>
  );
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

export function RoteiroHero({
  eyebrow,
  titulo,
  tituloAccent,
  subtitulo,
  descricao,
  image,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.02fr_1.1fr] md:gap-14">
      <div className="flex flex-col">
        {eyebrow && (
          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-bl-prog-accent)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-bl-prog-accent)" }}
            />
            {eyebrow}
          </span>
        )}

        <h1
          className="bl-rot-title m-0 mt-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--color-bl-prog-ink)" }}
        >
          {titulo}
          {tituloAccent && (
            <>
              {" "}
              <em>{tituloAccent}</em>
            </>
          )}
        </h1>

        {subtitulo && (
          <p
            className="m-0 mt-5 text-[17px] font-medium leading-snug"
            style={{ color: "var(--color-bl-prog-accent)", maxWidth: "34ch" }}
          >
            {subtitulo}
          </p>
        )}

        {descricao && (
          <p
            className="m-0 mt-4 text-[14.5px] leading-relaxed"
            style={{ color: "var(--color-bl-prog-muted)", maxWidth: "46ch" }}
          >
            {descricao}
          </p>
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
        style={{ background: "var(--color-bl-prog-soft)", aspectRatio: "4 / 3" }}
      >
        {image}
      </div>
    </section>
  );
}
