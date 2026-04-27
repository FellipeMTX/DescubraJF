import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveMap, type MapItem } from "@/components/ui/InteractiveMap";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const JF_CENTER: [number, number] = [-21.7612, -43.3496];

type FilterOption = { label: string; value: string };

export function FilterBar({
  options,
  selected,
  onSelect,
  isLoading,
}: {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            selected === opt.value
              ? "border-transparent text-white"
              : "border-black/15 hover:border-black/30"
          )}
          style={
            selected === opt.value
              ? { background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }
              : { color: "var(--color-bl-ink)" }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function MapSection({
  items,
  activeId,
  isLoading,
}: {
  items: MapItem[];
  activeId: string | null;
  isLoading: boolean;
}) {
  return (
    <div className="relative z-0 mt-8">
      {items.length > 0 ? (
        <InteractiveMap
          items={items}
          activeId={activeId}
          center={JF_CENTER}
          zoom={13}
          className="h-72 w-full rounded-[28px] shadow-lg md:h-80"
        />
      ) : (
        <div
          className="flex h-72 items-center justify-center rounded-[28px] md:h-80"
          style={{ background: "var(--color-bl-card)", color: "var(--color-bl-muted)" }}
        >
          {isLoading ? "Carregando mapa..." : "Nenhum local com coordenadas"}
        </div>
      )}
    </div>
  );
}

export function ItemCard({
  imageUrl,
  placeholder,
  isHovered,
  onHover,
  onLeave,
  onClick,
  children,
}: {
  imageUrl?: string | null;
  placeholder?: ReactNode;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="w-80 shrink-0 cursor-pointer"
    >
      <div
        className={cn(
          "group flex h-full overflow-hidden rounded-[24px] shadow-sm transition-all duration-300",
          isHovered && "shadow-xl -translate-y-0.5"
        )}
        style={{
          background: "var(--color-bl-bg)",
          border: isHovered
            ? "1px solid var(--color-bl-accent)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="relative w-32 shrink-0 overflow-hidden sm:w-36"
          style={{ background: "var(--color-bl-card)" }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {placeholder}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-4">{children}</div>
      </div>
    </div>
  );
}

export function CardsGrid({
  isLoading,
  isEmpty,
  emptyMessage,
  children,
}: {
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-80 shrink-0 rounded-[24px]" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <p
        className="mt-12 text-center"
        style={{ color: "var(--color-bl-muted)" }}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="mt-8 grid max-h-[340px] auto-rows-[160px] grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-4">
      {children}
    </div>
  );
}

export function DetailModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-h-[85vh] max-w-2xl overflow-y-auto"
        style={{ background: "var(--color-bl-bg)", color: "var(--color-bl-ink)" }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function AttributePill({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-2xs font-medium"
      style={{
        background: "var(--color-bl-card)",
        color: "var(--color-bl-ink)",
      }}
    >
      {children}
    </span>
  );
}
