import { useState } from "react";
import { CategoryGridPage } from "@/components/ui/CategoryGridPage";
import { useServiceCategories, useServices } from "@/hooks/useServices";

export default function PasseioList() {
  const [selected, setSelected] = useState("todos");

  const { data: categories, isLoading: loadingCats } = useServiceCategories("passeios");
  const { data: items, isLoading: loadingItems } = useServices("passeios", selected);

  return (
    <CategoryGridPage
      title="A Gente Se Vê Por Aí"
      subtitle="Descubra experiências e passeios pela cidade"
      categories={categories}
      items={items}
      isLoadingCategories={loadingCats}
      isLoadingItems={loadingItems}
      selected={selected}
      onSelect={setSelected}
      emptyMessage="Nenhum passeio encontrado nesta categoria."
    />
  );
}
