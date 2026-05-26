import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, LayoutGrid, LayoutList, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type ChipOption = { value: string; label: string; count?: number };

export function FilterChips({
  options,
  selected,
  onSelect,
}: {
  options: ChipOption[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              active ? "border-transparent" : "border-black/12 hover:border-bl-ink"
            )}
            style={{
              background: active ? "var(--color-bl-ink)" : "transparent",
              color: active ? "var(--color-bl-bg)" : "var(--color-bl-ink)",
              fontFamily: "var(--font-display)",
            }}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className="ml-1.5 text-[11px] opacity-60">{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function FilterDropdown({
  items,
  selected,
  allLabel,
  onSelect,
  className,
}: {
  items: { name: string; count: number }[];
  selected: string;
  allLabel: string;
  onSelect: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = selected === "todos" ? allLabel : selected;
  const hasValue = selected !== "todos";

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-medium transition-colors",
          hasValue ? "border-transparent" : "border-black/12 hover:border-bl-ink"
        )}
        style={{
          background: hasValue ? "var(--color-bl-card)" : "transparent",
          color: "var(--color-bl-ink)",
        }}
      >
        {hasValue && (
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-bl-accent)" }}
          />
        )}
        <MapPin size={14} className="max-sm:hidden" />
        <span>{label}</span>
        <ChevronDown size={12} className={cn("max-sm:hidden transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute left-1/2 z-20 mt-2 max-h-72 w-56 -translate-x-1/2 overflow-y-auto rounded-2xl border border-black/10 p-1 shadow-xl [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/15"
          style={{ background: "var(--color-bl-bg)" }}
        >
          <button
            type="button"
            onClick={() => { onSelect("todos"); setOpen(false); }}
            className="block w-full cursor-pointer rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors"
            style={{
              background: selected === "todos" ? "var(--color-bl-card)" : "transparent",
              color: "var(--color-bl-ink)",
            }}
          >
            {allLabel}
          </button>
          {items.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => { onSelect(b.name); setOpen(false); }}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors"
              style={{
                background: selected === b.name ? "var(--color-bl-card)" : "transparent",
                color: "var(--color-bl-ink)",
              }}
            >
              <span>{b.name}</span>
              <span className="text-xs" style={{ color: "var(--color-bl-muted)" }}>
                {b.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ViewToggle({
  value,
  onChange,
  className,
}: {
  value: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const items: { v: "grid" | "list"; icon: typeof LayoutGrid; label: string }[] = [
    { v: "grid", icon: LayoutGrid, label: t("listing.viewGrid") },
    { v: "list", icon: LayoutList, label: t("listing.viewList") },
  ];
  return (
    <div className={cn("flex rounded-full p-1", className)} style={{ background: "var(--color-bl-card)" }}>
      {items.map(({ v, icon: Icon, label }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all [&>svg]:max-sm:hidden"
            style={{
              background: active ? "var(--color-bl-bg)" : "transparent",
              color: active ? "var(--color-bl-ink)" : "var(--color-bl-muted)",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : undefined,
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
