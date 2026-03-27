import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveMap, type MapItem } from "@/components/ui/InteractiveMap";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const JF_CENTER: [number, number] = [-21.7612, -43.3496];

/* ─── Filter Bar ─── */

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
              ? "border-primary-400 bg-primary-400 text-accent-50"
              : "border-primary-200 text-primary-700 hover:border-primary-400"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Map Section ─── */

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
    <div className="relative z-0 mt-6">
      {items.length > 0 ? (
        <InteractiveMap
          items={items}
          activeId={activeId}
          center={JF_CENTER}
          zoom={13}
          className="h-72 w-full rounded-xl shadow-lg md:h-80"
        />
      ) : (
        <div className="flex h-72 items-center justify-center rounded-xl bg-primary-100 text-primary-300 md:h-80">
          {isLoading ? "Carregando mapa..." : "Nenhum local com coordenadas"}
        </div>
      )}
    </div>
  );
}

/* ─── Item Card ─── */

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
    <div onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick} className="cursor-pointer">
      <div
        className={cn(
          "group flex h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-sm transition-all duration-200 hover:shadow-lg",
          isHovered && "ring-2 ring-primary-400 shadow-lg"
        )}
      >
        <div className="relative w-32 shrink-0 overflow-hidden bg-primary-100 sm:w-36">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              {placeholder}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-4">{children}</div>
      </div>
    </div>
  );
}

/* ─── Cards Grid ─── */

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
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return <p className="mt-12 text-center text-accent-500">{emptyMessage}</p>;
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

/* ─── Detail Modal ─── */

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
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto bg-accent-50">
        {children}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Attribute Pill ─── */

export function AttributePill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-600">
      {children}
    </span>
  );
}

/* ─── Helper: items to map items ─── */

export function toMapItems(
  items: Array<{ id: string; nome: string; latitude?: number | null; longitude?: number | null }>
): MapItem[] {
  return items
    .filter((i) => i.latitude && i.longitude)
    .map((i) => ({ id: i.id, name: i.nome, lat: i.latitude!, lng: i.longitude! }));
}
