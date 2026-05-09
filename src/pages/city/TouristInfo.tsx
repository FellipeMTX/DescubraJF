import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/PageHeader";

export default function TouristInfo() {
  const { t } = useTranslation();
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          title={t("city.touristInfo.title")}
          highlight={t("city.touristInfo.titleHighlight")}
          subtitle={t("city.touristInfo.subtitle")}
        />
      </div>
    </div>
  );
}
