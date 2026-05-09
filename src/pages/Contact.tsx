import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          kicker={t("contact.kicker")}
          title={t("contact.title")}
          highlight={t("contact.titleHighlight")}
          subtitle={t("contact.subtitle")}
        />
      </div>
    </div>
  );
}
