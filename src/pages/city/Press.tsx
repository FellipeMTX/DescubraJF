import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Press() {
  const { t } = useTranslation();
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          kicker={t("city.press.kicker")}
          title={t("city.press.title")}
          highlight={t("city.press.titleHighlight")}
          subtitle={t("city.press.subtitle")}
        />
      </div>
    </div>
  );
}
