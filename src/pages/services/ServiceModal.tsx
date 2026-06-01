import { createElement } from "react";
import { MapPin, Phone, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getIconByName } from "@/components/ui/IconPicker";
import type { CategoriaServico, Servico } from "@/types/database";

type Props = {
  service: Servico | null;
  category: CategoriaServico | undefined;
  onClose: () => void;
};

const PANEL_BG = "#F7F1E6";
const LINE = "rgba(0,0,0,0.08)";

function mapsHref(addr: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

function formatUpdated(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" })
      .format(d)
      .replace(".", "")
      .toLowerCase();
  } catch {
    return null;
  }
}

export function ServiceModal({ service, category, onClose }: Props) {
  const open = service !== null;
  if (!service) return null;

  const Icon = getIconByName(category?.icone ?? null);
  const eyebrow = service.descricao_curta ?? category?.nome ?? "";
  const fullAddress = [service.endereco, service.bairro].filter(Boolean).join(" — ");
  const sourceUrl = service.link_externo ?? service.contato?.site ?? null;
  const sourceLabel = sourceUrl
    ? sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;
  const updated = formatUpdated(service.updated_at);
  const unitName = service.bairro ?? "Endereço principal";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="grid w-[min(720px,calc(100vw-3rem))] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-[22px] border-0 p-0 shadow-2xl ring-0"
        style={{ background: PANEL_BG, maxHeight: "calc(100vh - 4rem)" }}
      >
        {/* head */}
        <div
          className="flex shrink-0 items-center gap-4 px-6.5 py-5.5"
          style={{ background: "var(--color-bl-ink)", color: "#fff" }}
        >
          <span
            className="grid h-13.5 w-13.5 shrink-0 place-items-center rounded-[14px]"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
          >
            {Icon && createElement(Icon, { size: 24 })}
          </span>
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p
                className="m-0 text-[10.5px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "rgba(242,234,220,0.7)", marginBottom: 3 }}
              >
                {eyebrow}
              </p>
            )}
            <h2
              className="bl-display m-0 leading-tight"
              style={{
                fontSize: "clamp(20px, 2.4vw, 26px)",
                fontWeight: 400,
                color: "#fff",
              }}
            >
              {service.nome}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 transition-colors hover:[background:rgba(255,255,255,0.18)]"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto px-6.5 pt-5.5 pb-6.5">
          {service.descricao && (
            <p
              className="m-0 mb-4.5 text-[16px] leading-normal"
              style={{
                color: "var(--color-bl-ink)",
                fontFamily: "var(--font-display)",
                opacity: 0.85,
              }}
            >
              {service.descricao}
            </p>
          )}

          {(fullAddress || service.contato?.telefone) && (
            <div className="grid gap-2.5">
              <div
                className="grid gap-x-3.5 gap-y-1 rounded-[12px] border px-4 py-3.5"
                style={{
                  background: "var(--color-bl-bg)",
                  borderColor: LINE,
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                }}
              >
                <div
                  className="bl-display text-[15.5px] font-medium"
                  style={{ color: "var(--color-bl-ink)" }}
                >
                  {unitName}
                </div>

                <div
                  className="col-span-full flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px]"
                  style={{ color: "var(--color-bl-ink)", opacity: 0.85, marginTop: 6 }}
                >
                  {fullAddress && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} /> {fullAddress}
                    </span>
                  )}
                  {service.contato?.telefone && (
                    <span
                      className="inline-flex items-center gap-1.5 font-medium"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-bl-accent)",
                      }}
                    >
                      <Phone size={12} /> {service.contato.telefone}
                    </span>
                  )}
                </div>

                {(service.contato?.telefone || fullAddress) && (
                  <div className="col-span-full mt-3 flex flex-wrap gap-2">
                    {service.contato?.telefone && (
                      <a
                        href={`tel:${service.contato.telefone}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold no-underline transition-colors hover:opacity-90"
                        style={{ background: "var(--color-bl-ink)", color: "#fff" }}
                      >
                        <Phone size={12} /> Ligar agora
                      </a>
                    )}
                    {fullAddress && (
                      <a
                        href={mapsHref(fullAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold no-underline transition-colors hover:opacity-90"
                        style={{
                          background: "var(--color-bl-card)",
                          color: "var(--color-bl-ink)",
                          borderColor: LINE,
                        }}
                      >
                        <MapPin size={12} /> Abrir no mapa
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* foot */}
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-t px-6.5 py-3.5"
          style={{
            background: "var(--color-bl-card)",
            borderColor: LINE,
            color: "var(--color-bl-muted)",
            fontSize: 12.5,
          }}
        >
          <span>{updated ? `Atualizado em ${updated}` : (category?.nome ?? "Serviço")}</span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 truncate text-[12.5px] no-underline"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-bl-accent)",
              }}
            >
              {sourceLabel}
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
