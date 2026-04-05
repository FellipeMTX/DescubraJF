import { useState } from "react";
import { CategoryGridPage } from "@/components/ui/CategoryGridPage";
import { useServiceCategories, useServices } from "@/hooks/useServices";

export default function ServiceList() {
  const [selected, setSelected] = useState("");

  const { data: categories, isLoading: loadingCats } = useServiceCategories("servicos");
  const { data: items, isLoading: loadingItems } = useServices("servicos", selected);

  return (
    <CategoryGridPage
      title="Serviços"
      subtitle="Serviços úteis para sua estadia em Juiz de Fora"
      categories={categories}
      items={items}
      isLoadingCategories={loadingCats}
      isLoadingItems={loadingItems}
      selected={selected}
      onSelect={setSelected}
      emptyMessage="Nenhum serviço encontrado nesta categoria."
    />
  );
}
