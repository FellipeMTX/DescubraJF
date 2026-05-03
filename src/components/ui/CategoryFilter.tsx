import { useTranslation } from "react-i18next";
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

function pillStyle(active: boolean) {
  return active
    ? { background: "var(--color-bl-card)", color: "var(--color-bl-ink)", borderColor: "transparent" }
    : { color: "var(--color-bl-ink)" };
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onSelect("todos")}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/30",
          selected === "todos" && "border-transparent"
        )}
        style={pillStyle(selected === "todos")}
      >
        {t("common.all")}
      </button>

      {categories.map((cat) => {
        const Icon = cat.icone ? ICON_MAP[cat.icone] : null;
        const isActive = selected === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/30",
              isActive && "border-transparent"
            )}
            style={pillStyle(isActive)}
          >
            {Icon && <Icon size={16} />}
            {cat.nome}
          </button>
        );
      })}
    </div>
  );
}
