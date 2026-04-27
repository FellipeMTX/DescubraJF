import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  dark?: boolean;
};

export function SectionHeader({ title, subtitle, dark }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <div
        className="bl-kicker mb-4"
        style={
          dark
            ? { background: "rgba(255,255,255,0.1)", color: "var(--color-bl-bg)" }
            : undefined
        }
      >
        <span className="dot" />
      </div>
      <h2
        className="bl-display m-0"
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          color: dark ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-3 text-base leading-[1.7]"
          style={{
            color: dark ? "rgba(255,255,255,0.7)" : "var(--color-bl-muted)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
