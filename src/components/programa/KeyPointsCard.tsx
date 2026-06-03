import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Props = {
  items: Item[];
};

export function KeyPointsCard({ items }: Props) {
  return (
    <div
      className="rounded-[18px] p-6 md:p-7"
      style={{
        background: "var(--color-bl-prog-card)",
        border: "1px solid var(--color-bl-prog-line)",
      }}
    >
      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i} className="flex items-start gap-3.5">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                style={{ background: "var(--color-bl-prog-soft)", color: "var(--color-bl-prog-ink)" }}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="bl-prog-display m-0 text-[14.5px] font-bold leading-tight"
                  style={{ color: "var(--color-bl-prog-ink)" }}
                >
                  {item.title}
                </p>
                <p
                  className="m-0 mt-1 text-[13px] leading-snug"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
