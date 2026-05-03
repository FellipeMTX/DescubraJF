import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function EventDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <Link
          to="/agenda"
          className="mb-4 inline-flex items-center gap-1 text-sm hover:underline"
          style={{ color: "var(--color-bl-muted)" }}
        >
          <ChevronLeft size={16} /> {t("events.detail.back")}
        </Link>
        <PageHeader
          kicker={`${t("events.detail.titleHighlight")} · ${slug}`}
          title={t("events.detail.title")}
          highlight={t("events.detail.titleHighlight")}
          subtitle={t("events.detail.subtitle")}
        />
        <div
          className="mt-6 h-80 rounded-[28px]"
          style={{ background: "var(--color-bl-card)" }}
        />
      </div>
    </div>
  );
}
