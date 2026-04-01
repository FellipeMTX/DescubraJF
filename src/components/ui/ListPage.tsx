import { useState, type ReactNode } from "react";
import { FilterBar, MapSection, ItemCard, CardsGrid, DetailModal } from "@/components/ui/ListPageLayout";
import { toMapItems } from "@/lib/utils";
import type { MapItem } from "@/components/ui/InteractiveMap";

type ListPageItem = {
  id: string;
  slug: string;
  nome: string;
  latitude?: number | null;
  longitude?: number | null;
  imagem_destaque?: string | null;
};

type ListPageProps<T extends ListPageItem> = {
  title: string;
  subtitle: string;
  items: T[] | undefined;
  isLoading: boolean;
  emptyMessage: string;

  // Filters
  filters?: { options: { label: string; value: string }[]; selected: string; onSelect: (v: string) => void; isLoading?: boolean };
  filterSlot?: ReactNode;

  // Card
  placeholderIcon: ReactNode;
  renderCardContent: (item: T) => ReactNode;

  // Modal
  selectedSlug: string | null;
  onSelectSlug: (slug: string | null) => void;
  renderModalContent: (slug: string) => ReactNode;
};

export function ListPage<T extends ListPageItem>({
  title,
  subtitle,
  items,
  isLoading,
  emptyMessage,
  filters,
  filterSlot,
  placeholderIcon,
  renderCardContent,
  selectedSlug,
  onSelectSlug,
  renderModalContent,
}: ListPageProps<T>) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mapItems: MapItem[] = toMapItems(items ?? []);

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">{title}</h1>
        <p className="mt-2 text-accent-500">{subtitle}</p>

        {filterSlot ?? (filters && (
          <FilterBar
            options={filters.options}
            selected={filters.selected}
            onSelect={filters.onSelect}
            isLoading={filters.isLoading}
          />
        ))}

        <MapSection items={mapItems} activeId={hoveredId} isLoading={isLoading} />

        <CardsGrid isLoading={isLoading} isEmpty={!items?.length} emptyMessage={emptyMessage}>
          {items?.map((item) => (
            <ItemCard
              key={item.id}
              imageUrl={item.imagem_destaque}
              placeholder={placeholderIcon}
              isHovered={hoveredId === item.id}
              onHover={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => onSelectSlug(item.slug)}
            >
              {renderCardContent(item)}
            </ItemCard>
          ))}
        </CardsGrid>
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => onSelectSlug(null)}>
        {selectedSlug && renderModalContent(selectedSlug)}
      </DetailModal>
    </div>
  );
}
