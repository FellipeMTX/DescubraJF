import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";

const CALENDAR_PDF_PATH = "/CalendarioOficialJF.pdf";
const CALENDAR_PDF_FILENAME = "CalendarioOficialJF.pdf";

export function OfficialCalendarDownload() {
  const { t } = useTranslation();

  return (
    <a
      href={CALENDAR_PDF_PATH}
      download={CALENDAR_PDF_FILENAME}
      className="flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/30"
      style={{ color: "var(--color-bl-ink)" }}
    >
      <Download size={14} aria-hidden="true" />
      {t("events.export.cta")}
    </a>
  );
}
