import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  /** Rótulo pequeno no topo (ex.: "Espaços comerciais"). */
  label: string;
  /** Valor em destaque (ex.: "40+", "2h – 4h", "Caminhada"). */
  value: string;
  /** Descrição final em muted (ex.: "nesta rota"). */
  description?: string;
};

type Props = {
  items: Item[];
};

export function RoteiroStats({ items }: Props) {
  return (
    <div
      className="rounded-[16px] p-1 sm:p-2"
      style={{
        background: "var(--color-bl-prog-card)",
        border: "1px solid var(--color-bl-prog-line)",
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          const hasNumber = /^[+\d]/.test(item.value);
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-4 lg:border-l lg:first:border-l-0"
              style={{ borderColor: "var(--color-bl-prog-line)" }}
            >
              <Icon
                size={24}
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-bl-prog-ink)" }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className="m-0 text-[11.5px] font-medium leading-tight"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {item.label}
                </p>
                <p
                  className="bl-prog-display m-0 mt-0.5 leading-none"
                  style={{
                    color: "var(--color-bl-prog-ink)",
                    fontWeight: 700,
                    fontSize: hasNumber ? "1.4rem" : "1rem",
                  }}
                >
                  {item.value}
                </p>
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
    </div>
  );
}
