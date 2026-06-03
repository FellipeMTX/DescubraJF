import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  /** Numero ou texto principal (ex.: "+150", "304", "Impacto em toda a cidade"). */
  value: string;
  /** Linha secundaria pequena (ex.: "projetos apoiados"). */
  label?: string;
  /** Descricao final em muted. */
  description?: string;
};

type Props = {
  items: Item[];
};

export function StatsRow({ items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        const hasNumber = /^[+\d]/.test(item.value);
        return (
          <div
            key={i}
            className="flex items-start gap-3.5 rounded-[14px] p-5"
            style={{
              background: "var(--color-bl-prog-card)",
              border: "1px solid var(--color-bl-prog-line)",
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
              style={{ background: "var(--color-bl-prog-soft)", color: "var(--color-bl-prog-ink)" }}
            >
              <Icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="bl-prog-display m-0 leading-none"
                style={{
                  color: "var(--color-bl-prog-ink)",
                  fontWeight: 700,
                  fontSize: hasNumber ? "clamp(1.5rem, 2.6vw, 1.875rem)" : "0.95rem",
                }}
              >
                {item.value}
              </p>
              {item.label && (
                <p
                  className="m-0 mt-1.5 text-[12.5px] font-semibold leading-tight"
                  style={{ color: "var(--color-bl-prog-ink)" }}
                >
                  {item.label}
                </p>
              )}
              {item.description && (
                <p
                  className="m-0 mt-1 text-[11.5px] leading-snug"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
