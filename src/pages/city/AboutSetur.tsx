import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AboutSetur() {
  const { t } = useTranslation();
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          title={t("city.setur.title")}
          highlight={t("city.setur.titleHighlight")}
          subtitle={t("city.setur.subtitle")}
        />
      </div>
    </div>
  );
}
