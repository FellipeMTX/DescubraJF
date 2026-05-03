import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/PageHeader";

export default function HowToGetHere() {
  const { t } = useTranslation();
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          kicker={t("city.howToGetHere.kicker")}
          title={t("city.howToGetHere.title")}
          highlight={t("city.howToGetHere.titleHighlight")}
          subtitle={t("city.howToGetHere.subtitle")}
        />
      </div>
    </div>
  );
}
