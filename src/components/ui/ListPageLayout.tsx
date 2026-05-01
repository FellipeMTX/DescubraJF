import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
            "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            selected === opt.value
              ? "border-transparent text-white"
              : "border-black/15 hover:border-black/30"
          )}
          style={
            selected === opt.value
              ? { background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }
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
      className="h-40 w-80 shrink-0 cursor-pointer justify-self-start"
    >
      <div
        className={cn(
          "group flex h-full overflow-hidden rounded-[24px] shadow-sm transition-all duration-300",
          isHovered && "shadow-xl"
        )}
        style={{
          background: "var(--color-bl-card)",
          border: isHovered
            ? "1px solid var(--color-bl-accent)"
            : "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="relative w-1/2 shrink-0 overflow-hidden"
          style={{ background: "var(--color-bl-bg)" }}
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
        <div className="flex w-1/2 flex-col justify-center p-4">{children}</div>
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
      <div className="scrollbar-hide mt-8 grid auto-cols-[320px] grid-flow-col grid-rows-[160px_160px] gap-4 overflow-x-auto overflow-y-hidden pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-full w-80 shrink-0 justify-self-start rounded-[24px]" />
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

  const count = Children.count(children);
  if (count <= 6) {
    return (
      <div className="mt-8 flex flex-wrap gap-4">
        {children}
      </div>
    );
  }

  return <CardsGridScroller>{children}</CardsGridScroller>;
}

function CardsGridScroller({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateButtons() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    const observer = new ResizeObserver(updateButtons);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      observer.disconnect();
    };
  }, [children]);

  function scrollBy(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (320 + 16) * 2, behavior: "smooth" });
  }

  return (
    <div className="relative mt-8">
      <div
        ref={scrollRef}
        className="scrollbar-hide grid auto-cols-[320px] grid-flow-col grid-rows-[160px_160px] gap-4 overflow-x-auto overflow-y-hidden pb-1"
      >
        {children}
      </div>
      {canScrollLeft && (
        <ScrollArrow direction="left" onClick={() => scrollBy(-1)} />
      )}
      {canScrollRight && (
        <ScrollArrow direction="right" onClick={() => scrollBy(1)} />
      )}
    </div>
  );
}

function ScrollArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      aria-label={direction === "left" ? "Anterior" : "Próximo"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 shadow-lg transition-transform hover:scale-105 active:scale-95",
        direction === "left" ? "-left-2 md:-left-5" : "-right-2 md:-right-5"
      )}
      style={{
        background: "var(--color-bl-bg)",
        color: "var(--color-bl-ink)",
      }}
    >
      <Icon size={22} />
    </button>
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
        className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
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
