import type { LucideIcon } from "lucide-react";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Props = {
  items: Item[];
};

export function HighlightsBar({ items }: Props) {
  return (
    <section
      className="rounded-[14px] p-6 md:px-8 md:py-7"
      style={{ background: "var(--color-bl-prog-card)", border: "1px solid var(--color-bl-prog-line)" }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3.5">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                style={{ background: "var(--color-bl-prog-soft)", color: "var(--color-bl-prog-ink)" }}
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="bl-prog-display m-0 text-[14px] font-bold leading-tight"
                  style={{ color: "var(--color-bl-prog-ink)", letterSpacing: "-0.005em" }}
                >
                  {item.title}
                </p>
                <p
                  className="m-0 mt-1 text-[12.5px] leading-snug"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
