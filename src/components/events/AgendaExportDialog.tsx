import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toIsoDay } from "@/lib/utils";
import type { Evento } from "@/types/database";

type Props = { events: Evento[]; open: boolean; onOpenChange: (open: boolean) => void };

function pad(n: number) { return String(n).padStart(2, "0"); }
function isoDay(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function defaultRange() {
  const now = new Date();
  return { start: isoDay(new Date(now.getFullYear(), now.getMonth(), 1)), end: isoDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
}
function formatLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}
function monthKey(iso: string) { return iso.slice(0, 7); }
function monthLabel(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).replace(/^./, (char) => char.toUpperCase());
}
function renderEvent(event: Evento) {
  const start = formatLong(toIsoDay(event.data_inicio));
  const end = event.data_fim && toIsoDay(event.data_fim) !== toIsoDay(event.data_inicio) ? ` — ${formatLong(toIsoDay(event.data_fim))}` : "";
  const location = event.local_nome ? `<div class="meta">${escapeHtml(event.local_nome)}${event.local_endereco ? ` · ${escapeHtml(event.local_endereco)}` : ""}</div>` : "";
  const description = event.descricao_curta ? `<div class="desc">${escapeHtml(event.descricao_curta)}</div>` : "";
  const category = event.categoria ? `<span class="tag">${escapeHtml(event.categoria)}</span>` : "";
  const free = event.gratuito ? '<span class="tag free">Gratuito</span>' : "";
  return `<article class="event"><div class="date">${start}${end}</div><h2 class="title">${escapeHtml(event.titulo)}</h2><div class="tags">${category}${free}</div>${location}${description}</article>`;
}
function buildHtml(events: Evento[], labels: { title: string; range: string; empty: string }) {
  const groups = new Map<string, Evento[]>();
  for (const event of events) {
    const key = monthKey(toIsoDay(event.data_inicio));
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }
  const sections = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([key, group]) => `<section class="month"><h2 class="month-title">${escapeHtml(monthLabel(`${key}-01`))}<span class="month-count">${group.length}</span></h2>${group.map(renderEvent).join("")}</section>`).join("");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(labels.title)}</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;color:#241510;margin:0;padding:32px}header{border-bottom:2px solid #241510;padding-bottom:16px;margin-bottom:24px}h1{font-size:26px;margin:0 0 4px;letter-spacing:-.02em}.range{color:#8c7058;font-size:13px}.month{margin-bottom:28px}.month-title{font-size:18px;font-weight:600;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid rgba(36,21,16,.18);display:flex;align-items:baseline;justify-content:space-between;page-break-after:avoid}.month:first-of-type .month-title{margin-top:0}.month-count{font-size:12px;font-style:italic;color:#b8482e;font-weight:500}.event{padding:14px 0;border-bottom:1px dashed rgba(36,21,16,.18);page-break-inside:avoid}.event:last-child{border-bottom:none}.date{font-size:11px;color:#b8482e;font-weight:600;text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px}.title{font-size:16px;font-weight:600;margin:2px 0 6px}.tags{margin-bottom:6px}.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:999px;background:#ecdcc4;color:#241510;margin-right:4px;text-transform:uppercase;letter-spacing:.06em}.tag.free{background:#b8482e;color:#fff}.meta{font-size:12px;color:#555;margin-bottom:4px}.desc{font-size:12px;color:#444;line-height:1.5}.empty{text-align:center;padding:48px 0;color:#8c7058;font-style:italic}@media print{@page{margin:1.5cm}body{padding:0}}</style></head><body><header><h1>${escapeHtml(labels.title)}</h1><div class="range">${escapeHtml(labels.range)}</div></header>${sections || `<div class="empty">${escapeHtml(labels.empty)}</div>`}<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),200))</script></body></html>`;
}

export function AgendaExportDialog({ events, open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const defaultDates = useMemo(() => defaultRange(), []);
  const [start, setStart] = useState(defaultDates.start);
  const [end, setEnd] = useState(defaultDates.end);
  const eventsInRange = useMemo(() => start > end ? [] : events.filter((event) => toIsoDay(event.data_fim || event.data_inicio) >= start && toIsoDay(event.data_inicio) <= end), [events, start, end]);
  function handleExport() {
    if (start > end) return;
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;
    const html = buildHtml(eventsInRange.toSorted((a, b) => a.data_inicio.localeCompare(b.data_inicio)), { title: t("events.export.docTitle"), range: `${formatLong(start)} — ${formatLong(end)}`, empty: t("events.export.empty") });
    popup.document.write(html);
    popup.document.close();
    onOpenChange(false);
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>{t("events.export.title")}</DialogTitle></DialogHeader><p className="text-sm text-[var(--color-bl-muted)]">{t("events.export.subtitle")}</p><div className="grid grid-cols-2 gap-3"><label className="flex flex-col gap-1.5"><span className="text-xs font-medium uppercase tracking-wide text-[var(--color-bl-muted)]">{t("events.export.from")}</span><Input type="date" value={start} max={end} onChange={(event) => setStart(event.target.value)} /></label><label className="flex flex-col gap-1.5"><span className="text-xs font-medium uppercase tracking-wide text-[var(--color-bl-muted)]">{t("events.export.to")}</span><Input type="date" value={end} min={start} onChange={(event) => setEnd(event.target.value)} /></label></div><p className="text-xs text-[var(--color-bl-muted)]">{t("events.export.count", { count: eventsInRange.length })}</p><div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={() => onOpenChange(false)}>{t("events.export.cancel")}</Button><Button onClick={handleExport} disabled={start > end || eventsInRange.length === 0}><Download size={14} />{t("events.export.confirm")}</Button></div></DialogContent></Dialog>;
}
