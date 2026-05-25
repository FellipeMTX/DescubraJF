import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toIsoDay } from "@/lib/utils";
import type { Evento } from "@/types/database";

type Props = {
  events: Evento[];
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isoDay(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function defaultRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: isoDay(first), end: isoDay(last) };
}

function formatLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c
  );
}

function buildHtml(
  events: Evento[],
  labels: { title: string; range: string; empty: string }
) {
  const rows = events
    .map((e) => {
      const dStart = formatLong(toIsoDay(e.data_inicio));
      const dEnd = e.data_fim && toIsoDay(e.data_fim) !== toIsoDay(e.data_inicio)
        ? ` — ${formatLong(toIsoDay(e.data_fim))}`
        : "";
      const local = e.local_nome
        ? `<div class="meta">${escapeHtml(e.local_nome)}${e.local_endereco ? " · " + escapeHtml(e.local_endereco) : ""}</div>`
        : "";
      const desc = e.descricao_curta
        ? `<div class="desc">${escapeHtml(e.descricao_curta)}</div>`
        : "";
      const cat = e.categoria
        ? `<span class="tag">${escapeHtml(e.categoria)}</span>`
        : "";
      const free = e.gratuito ? `<span class="tag free">Gratuito</span>` : "";
      return `<article class="event">
        <div class="date">${dStart}${dEnd}</div>
        <h2 class="title">${escapeHtml(e.titulo)}</h2>
        <div class="tags">${cat}${free}</div>
        ${local}${desc}
      </article>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(labels.title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #241510; margin: 0; padding: 32px; }
  header { border-bottom: 2px solid #241510; padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font-size: 26px; margin: 0 0 4px; letter-spacing: -0.02em; }
  .range { color: #8c7058; font-size: 13px; }
  .event { padding: 14px 0; border-bottom: 1px dashed rgba(36,21,16,0.18); page-break-inside: avoid; }
  .date { font-size: 11px; color: #b8482e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px; }
  .title { font-size: 16px; font-weight: 600; margin: 2px 0 6px; }
  .tags { margin-bottom: 6px; }
  .tag { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 999px; background: #ecdcc4; color: #241510; margin-right: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
  .tag.free { background: #b8482e; color: #fff; }
  .meta { font-size: 12px; color: #555; margin-bottom: 4px; }
  .desc { font-size: 12px; color: #444; line-height: 1.5; }
  .empty { text-align: center; padding: 48px 0; color: #8c7058; font-style: italic; }
  @media print { @page { margin: 1.5cm; } body { padding: 0; } }
</style></head>
<body>
  <header>
    <h1>${escapeHtml(labels.title)}</h1>
    <div class="range">${escapeHtml(labels.range)}</div>
  </header>
  ${rows || `<div class="empty">${escapeHtml(labels.empty)}</div>`}
  ${"<script>"}window.addEventListener("load", () => setTimeout(() => window.print(), 200));${"</script>"}
</body></html>`;
}

export function AgendaExportDialog({ events }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const def = useMemo(() => defaultRange(), []);
  const [start, setStart] = useState(def.start);
  const [end, setEnd] = useState(def.end);

  const filteredCount = useMemo(() => {
    if (start > end) return 0;
    return events.filter((e) => {
      const eStart = toIsoDay(e.data_inicio);
      const eEnd = toIsoDay(e.data_fim || e.data_inicio);
      return eEnd >= start && eStart <= end;
    }).length;
  }, [events, start, end]);

  function handleExport() {
    if (start > end) return;
    const filtered = events
      .filter((e) => {
        const eStart = toIsoDay(e.data_inicio);
        const eEnd = toIsoDay(e.data_fim || e.data_inicio);
        return eEnd >= start && eStart <= end;
      })
      .sort((a, b) => a.data_inicio.localeCompare(b.data_inicio));

    const html = buildHtml(filtered, {
      title: t("events.export.docTitle"),
      range: `${formatLong(start)} — ${formatLong(end)}`,
      empty: t("events.export.empty"),
    });

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-black/30"
        style={{ color: "var(--color-bl-ink)" }}
      >
        <Download size={14} />
        {t("events.export.cta")}
      </button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("events.export.title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[var(--color-bl-muted)]">
          {t("events.export.subtitle")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-bl-muted)]">
              {t("events.export.from")}
            </span>
            <Input
              type="date"
              value={start}
              max={end}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-bl-muted)]">
              {t("events.export.to")}
            </span>
            <Input
              type="date"
              value={end}
              min={start}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1 text-xs text-[var(--color-bl-muted)]">
          <span>
            {t("events.export.count", { count: filteredCount })}
          </span>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("events.export.cancel")}
          </Button>
          <Button onClick={handleExport} disabled={start > end || filteredCount === 0}>
            <Download size={14} /> {t("events.export.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
