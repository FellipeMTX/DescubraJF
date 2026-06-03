import { MapPin, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PlaceItem = {
  image?: ReactNode;
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Linha opcional de localização (ex.: "Centro"), exibida com um pin. */
  location?: string;
};

type Props = {
  items: PlaceItem[];
  /** Slot opcional renderizado como ultimo card da grade (ex.: "Fique por dentro"). */
  extra?: ReactNode;
  /** Default 4. Use 5/3/2 conforme necessário. */
  columns?: 2 | 3 | 4 | 5;
};

const COL_CLASS: Record<2 | 3 | 4 | 5, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

export function PlaceCards({ items, extra, columns = 4 }: Props) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${COL_CLASS[columns]} md:gap-4`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <article
            key={i}
            className="flex flex-col overflow-hidden rounded-[14px]"
            style={{
              background: "var(--color-bl-prog-card)",
              border: "1px solid var(--color-bl-prog-line)",
            }}
          >
            <div
              className="relative aspect-[5/4] w-full"
              style={{ background: "var(--color-bl-prog-soft)" }}
            >
              {item.image}
              {Icon && (
                <span
                  className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full shadow"
                  style={{
                    background: "var(--color-bl-prog-soft)",
                    color: "var(--color-bl-prog-ink)",
                    border: "1px solid var(--color-bl-prog-line)",
                  }}
                >
                  <Icon size={18} />
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5 p-4">
              <p
                className="bl-prog-display m-0 text-[15px] font-bold leading-tight"
                style={{ color: "var(--color-bl-prog-ink)" }}
              >
                {item.title}
              </p>
              {item.description && (
                <p
                  className="m-0 text-[12.5px] leading-snug"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {item.description}
                </p>
              )}
              {item.location && (
                <p
                  className="m-0 mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium"
                  style={{ color: "var(--color-bl-prog-accent)" }}
                >
                  <MapPin size={13} /> {item.location}
                </p>
              )}
            </div>
          </article>
        );
      })}
      {extra}
    </div>
  );
}
