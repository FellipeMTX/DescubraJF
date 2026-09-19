import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Download } from "lucide-react";
import { AgendaExportDialog } from "@/components/events/AgendaExportDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Evento } from "@/types/database";

const CALENDAR_PDF_PATH = "/CalendarioOficialJF.pdf";

export function AgendaDownloadMenu({ events }: { events: Evento[] }) {
  const { t } = useTranslation();
  const [exportOpen, setExportOpen] = useState(false);
  return <><DropdownMenu><DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/30" style={{ color: "var(--color-bl-ink)" }}><Download size={14} aria-hidden="true" />{t("events.export.menuCta")}</DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64"><DropdownMenuItem render={<a href={CALENDAR_PDF_PATH} download="CalendarioOficialJF.pdf" />}><Download aria-hidden="true" />{t("events.export.officialOption")}</DropdownMenuItem><DropdownMenuItem onClick={() => setExportOpen(true)}><CalendarDays aria-hidden="true" />{t("events.export.customOption")}</DropdownMenuItem></DropdownMenuContent></DropdownMenu><AgendaExportDialog events={events} open={exportOpen} onOpenChange={setExportOpen} /></>;
}
