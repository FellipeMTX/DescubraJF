import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryGridPage } from "@/components/ui/CategoryGridPage";
import { useServiceCategories, useServices } from "@/hooks/useServices";

export default function ServiceList() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");

  const { data: categories, isLoading: loadingCats } = useServiceCategories("servicos");
  const { data: items, isLoading: loadingItems } = useServices("servicos", selected);

  return (
    <CategoryGridPage
      title={t("services.title")}
      subtitle={t("services.subtitle")}
      categories={categories}
      items={items}
      isLoadingCategories={loadingCats}
      isLoadingItems={loadingItems}
      selected={selected}
      onSelect={setSelected}
      emptyMessage={t("services.empty")}
    />
  );
}
