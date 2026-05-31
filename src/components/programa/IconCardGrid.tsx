import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

type Props = {
  items: Item[];
  /** Default 5 colunas no desktop (Praça Cervejeira). Use 4 ou 3 conforme necessário. */
  columns?: 3 | 4 | 5;
};

const COL_CLASS: Record<3 | 4 | 5, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

export function IconCardGrid({ items, columns = 5 }: Props) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${COL_CLASS[columns]} md:gap-4`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="flex flex-col items-start rounded-[14px] p-5"
            style={{
              background: "var(--color-bl-prog-card)",
              border: "1px solid var(--color-bl-prog-line)",
            }}
          >
            <Icon
              size={22}
              style={{ color: "var(--color-bl-prog-accent)" }}
              className="mb-3"
            />
            <p
              className="bl-prog-display m-0 text-[14px] font-bold"
              style={{ color: "var(--color-bl-prog-ink)" }}
            >
              {item.title}
            </p>
            {item.description && (
              <p
                className="m-0 mt-1.5 text-[12.5px] leading-snug"
                style={{ color: "var(--color-bl-prog-muted)" }}
              >
                {item.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
