import type { ReactNode } from "react";
import { forwardRef } from "react";

export const ListingHead = forwardRef<
  HTMLDivElement,
  { title: string; highlight: string; count: number; resultsLabel: string }
>(function ListingHead({ title, highlight, count, resultsLabel }, ref) {
  return (
    <div ref={ref} className="mb-6 mt-14 flex items-baseline justify-between gap-4">
      <h2
        className="bl-display m-0 font-normal"
        style={{ fontSize: "clamp(24px, 2.4vw, 32px)" }}
      >
        {title} <span className="bl-em">{highlight}</span>
      </h2>
      <span
        className="text-sm"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-bl-muted)" }}
      >
        <em
          style={{
            color: "var(--color-bl-ink)",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          {count}
        </em>{" "}
        {resultsLabel}
      </span>
    </div>
  );
});

type StatItem = { value: ReactNode; label: string };

export function StatsStrip({ items }: { items: StatItem[] }) {
  return (
    <div
      className="mt-9 grid grid-cols-2 overflow-hidden rounded-3xl md:grid-cols-4"
      style={{ background: "var(--color-bl-card)", border: "1px solid rgba(36,21,16,0.08)" }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className="p-6 max-md:p-5"
          style={{
            borderRight: i === items.length - 1 ? undefined : "1px solid rgba(36,21,16,0.08)",
            borderBottom: i < 2 ? "1px solid rgba(36,21,16,0.08)" : undefined,
          }}
        >
          <div className="bl-display leading-none" style={{ fontSize: "clamp(24px, 3vw, 38px)" }}>
            <span className="[&_em]:bl-em [&_em]:font-normal">{it.value}</span>
          </div>
          <div
            className="mt-2 text-[11px] font-semibold uppercase"
            style={{ letterSpacing: "0.16em", color: "var(--color-bl-muted)" }}
          >
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoriesCallout({
  title,
  highlight,
  description,
  optionsLabel,
  items,
  onSelect,
}: {
  title: string;
  highlight: string;
  description: string;
  optionsLabel: string;
  items: { name: string; count: number }[];
  onSelect: (name: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section
      className="relative mt-20 overflow-hidden rounded-3xl px-12 py-14 max-md:px-7 max-md:py-10"
      style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }}
    >
      <h2 className="bl-display m-0 mb-3 max-w-[18ch]" style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>
        {title}{" "}
        <em style={{ fontStyle: "italic", color: "var(--color-bl-accent2)" }}>{highlight}</em>
      </h2>
      <p className="m-0 mb-9 max-w-[50ch] leading-[1.7]" style={{ color: "rgba(247,238,226,0.7)" }}>
        {description}
      </p>
      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {items.map((b) => (
          <button
            key={b.name}
            type="button"
            onClick={() => onSelect(b.name)}
            className="cursor-pointer rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(247,238,226,0.06)",
              borderColor: "rgba(247,238,226,0.1)",
            }}
          >
            <div
              className="text-lg font-medium"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.018em" }}
            >
              {b.name}
            </div>
            <div
              className="mt-1.5 flex gap-3 text-xs"
              style={{ color: "rgba(247,238,226,0.55)", fontFamily: "var(--font-display)" }}
            >
              <span>
                <strong
                  style={{
                    color: "var(--color-bl-accent2)",
                    fontWeight: 500,
                    fontStyle: "italic",
                  }}
                >
                  {b.count}
                </strong>{" "}
                {optionsLabel}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center"
      style={{ background: "var(--color-bl-card)", color: "var(--color-bl-muted)" }}
    >
      {icon}
      <p className="m-0" style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-bl-ink hover:text-bl-bg"
        style={{ borderColor: "rgba(0,0,0,0.18)", color: "var(--color-bl-ink)" }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
