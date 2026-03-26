import {
  Globe, Trees, Mountain, ShoppingBag, Landmark,
  Baby, Eye, Music, Church
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoriaExperiencia } from "@/types/database";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  globe: Globe,
  trees: Trees,
  mountain: Mountain,
  "shopping-bag": ShoppingBag,
  landmark: Landmark,
  baby: Baby,
  eye: Eye,
  music: Music,
  church: Church,
};

type CategoryFilterProps = {
  categories: CategoriaExperiencia[];
  selected: string;
  onSelect: (slug: string) => void;
};

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect("todos")}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          selected === "todos"
            ? "border-primary-500 bg-primary-50 text-primary-700"
            : "border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600"
        )}
      >
        Todos
      </button>

      {categories.map((cat) => {
        const Icon = cat.icone ? ICON_MAP[cat.icone] : null;
        const isActive = selected === cat.slug;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600"
            )}
          >
            {Icon && <Icon size={16} />}
            {cat.nome}
          </button>
        );
      })}
    </div>
  );
}
