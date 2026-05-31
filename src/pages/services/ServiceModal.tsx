import { createElement } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getIconByName } from "@/components/ui/IconPicker";
import type { CategoriaServico, Servico } from "@/types/database";

type Props = {
  service: Servico | null;
  category: CategoriaServico | undefined;
  onClose: () => void;
};

function mapsHref(addr: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

export function ServiceModal({ service, category, onClose }: Props) {
  const open = service !== null;
  if (!service) return null;

  const Icon = getIconByName(category?.icone ?? null);
  const fullAddress = [service.endereco, service.bairro].filter(Boolean).join(" — ");
  const sourceUrl = service.link_externo ?? service.contato?.site ?? null;
  const sourceLabel = sourceUrl
    ? sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="grid max-h-[calc(100vh-4rem)] w-[min(720px,calc(100vw-3rem))] max-w-none grid-rows-[auto_1fr_auto] gap-0 overflow-hidden rounded-[22px] border-0 bg-transparent p-0 shadow-2xl ring-0"
        style={{ background: "var(--color-bl-card)" }}
      >
        {/* dark head */}
        <div
          className="flex items-center gap-4 px-6 py-5 max-sm:px-4 max-sm:py-4"
          style={{ background: "var(--color-bl-ink)" }}
        >
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-[14px] max-sm:h-12 max-sm:w-12"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-bl-bg)" }}
          >
            {Icon && createElement(Icon, { size: 26 })}
          </span>
          <div className="min-w-0 flex-1">
            {service.descricao_curta && (
              <p
                className="m-0 text-[10.5px] font-semibold uppercase leading-none tracking-[0.22em]"
                style={{ color: "rgba(242,234,220,0.6)" }}
              >
                {service.descricao_curta}
              </p>
            )}
            <h2
              className="bl-display m-0 mt-1.5 leading-tight"
              style={{
                fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "var(--color-bl-bg)",
              }}
            >
              {service.nome}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-bl-bg)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto px-6 py-6 max-sm:px-4 max-sm:py-4">
          {service.descricao && (
            <p
              className="bl-display m-0 mb-5 text-[15px] leading-snug"
              style={{ color: "var(--color-bl-ink)" }}
            >
              {service.descricao}
            </p>
          )}

          {service.imagem_destaque && (
            <img
              src={service.imagem_destaque}
              alt={service.nome}
              className="mb-5 h-44 w-full rounded-[12px] object-cover"
            />
          )}

          {/* unit card with address/phone */}
          {(fullAddress || service.contato?.telefone || service.contato?.email || service.contato?.instagram) && (
            <div
              className="rounded-[12px] p-4"
              style={{ background: "var(--color-bl-bg)", border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span
                  className="bl-display text-[15.5px] font-medium leading-tight"
                  style={{ color: "var(--color-bl-ink)" }}
                >
                  {service.nome}
                </span>
                {service.bairro && (
                  <span
                    className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--color-bl-accent)" }}
                  >
                    {service.bairro}
                  </span>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px]" style={{ color: "var(--color-bl-ink)" }}>
                {fullAddress && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} /> {fullAddress}
                  </span>
                )}
                {service.contato?.telefone && (
                  <span
                    className="inline-flex items-center gap-1.5 font-mono font-medium"
                    style={{ color: "var(--color-bl-accent)" }}
                  >
                    <Phone size={12} /> {service.contato.telefone}
                  </span>
                )}
                {service.contato?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={12} /> {service.contato.email}
                  </span>
                )}
              </div>

              {/* action buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                {service.contato?.telefone && (
                  <a
                    href={`tel:${service.contato.telefone}`}
                    className="inline-flex items-center gap-1.5 rounded-full border-0 px-3.5 py-2 text-[12px] font-semibold no-underline transition-colors"
                    style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }}
                  >
                    <Phone size={12} /> Ligar agora
                  </a>
                )}
                {fullAddress && (
                  <a
                    href={mapsHref(fullAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold no-underline transition-colors"
                    style={{
                      background: "var(--color-bl-card)",
                      color: "var(--color-bl-ink)",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <MapPin size={12} /> Abrir no mapa
                  </a>
                )}
                {service.contato?.instagram && (
                  <a
                    href={service.contato.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold no-underline transition-colors"
                    style={{
                      background: "var(--color-bl-card)",
                      color: "var(--color-bl-ink)",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <ExternalLink size={12} /> Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-3.5 max-sm:px-4"
          style={{ background: "var(--color-bl-bg)", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <span className="text-[11.5px]" style={{ color: "var(--color-bl-muted)" }}>
            {category?.nome ?? "Serviço"}
          </span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 truncate font-mono text-[12.5px] no-underline"
              style={{ color: "var(--color-bl-accent)" }}
            >
              <Globe size={12} /> {sourceLabel}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
