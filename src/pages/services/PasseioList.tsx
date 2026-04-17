import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryGridPage } from "@/components/ui/CategoryGridPage";
import { useServiceCategories, useServices } from "@/hooks/useServices";

export default function PasseioList() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");

  const { data: categories, isLoading: loadingCats } = useServiceCategories("passeios");
  const { data: items, isLoading: loadingItems } = useServices("passeios", selected);

  return (
    <CategoryGridPage
      title={t("pages.tours.title")}
      subtitle={t("pages.tours.subtitle")}
      categories={categories}
      items={items}
      isLoadingCategories={loadingCats}
      isLoadingItems={loadingItems}
      selected={selected}
      onSelect={setSelected}
      emptyMessage={t("pages.tours.empty")}
    />
  );
}
