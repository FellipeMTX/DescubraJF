import type { LucideIcon } from "lucide-react";

type Bullet = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

type Props = {
  title?: string;
  intro?: string;
  items: Bullet[];
  /** 1 = lista vertical (Dicas). 2 = grade 2 colunas (card "Sobre"). */
  columns?: 1 | 2;
};

export function RoteiroInfoCard({ title, intro, items, columns = 1 }: Props) {
  const hasHeader = Boolean(title || intro);
  return (
    <div
      className="h-full rounded-[18px] p-6 md:p-7"
      style={{
        background: "var(--color-bl-prog-card)",
        border: "1px solid var(--color-bl-prog-line)",
      }}
    >
      {title && (
        <h3
          className="bl-prog-display m-0 text-[17px] font-bold leading-tight"
          style={{ color: "var(--color-bl-prog-ink)" }}
        >
          {title}
        </h3>
      )}
      {intro && (
        <p
          className="m-0 mt-2 text-justify text-[13.5px] leading-relaxed"
          style={{ color: "var(--color-bl-prog-muted)" }}
        >
          {intro}
        </p>
      )}

      <ul
        className={`m-0 grid list-none gap-5 p-0 ${columns === 2 ? "sm:grid-cols-2" : ""} ${
          hasHeader ? "mt-6 border-t pt-6" : ""
        }`}
        style={hasHeader ? { borderColor: "var(--color-bl-prog-line)" } : undefined}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i} className="flex items-start gap-3">
              <Icon
                size={20}
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-bl-prog-accent)" }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className="bl-prog-display m-0 text-[14px] font-bold leading-tight"
                  style={{ color: "var(--color-bl-prog-ink)" }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p
                    className={`m-0 mt-1 text-[12.5px] leading-snug ${columns === 1 ? "text-justify" : ""}`}
                    style={{ color: "var(--color-bl-prog-muted)" }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
