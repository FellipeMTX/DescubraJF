import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Star, BedDouble, Phone, Mail, Globe, ExternalLink, Wifi, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListPage } from "@/components/ui/ListPage";
import { useLodgingEstablishments, useLodgingBySlug } from "@/hooks/useLodging";
import type { Hospedagem } from "@/types/database";

const PRICE_KEYS = ["", "lodging.pricing.budget", "lodging.pricing.moderate", "lodging.pricing.premium"];

const TYPE_VALUES = ["todos", "hotel", "pousada", "hostel", "flat"] as const;
const TYPE_KEY_MAP: Record<(typeof TYPE_VALUES)[number], string> = {
  todos: "lodging.types.all",
  hotel: "lodging.types.hotel",
  pousada: "lodging.types.pousada",
  hostel: "lodging.types.hostel",
  flat: "lodging.types.flat",
};

export default function LodgingList() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("todos");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: lodgings, isLoading } = useLodgingEstablishments(selected);

  const TYPES = TYPE_VALUES.map((value) => ({ label: t(TYPE_KEY_MAP[value]), value }));

  return (
    <ListPage<Hospedagem>
      title={t("lodging.title")}
      subtitle={t("lodging.subtitle")}
      items={lodgings}
      isLoading={isLoading}
      emptyMessage={t("lodging.empty")}
      filters={{ options: TYPES, selected, onSelect: setSelected }}
      placeholderIcon={<BedDouble size={28} className="text-[var(--color-bl-muted)]" />}
      renderCardContent={(lodging) => (
        <>
          <h3 className="font-bold bl-display text-base">{lodging.nome}</h3>
          {lodging.descricao_curta && (
            <p className="mt-1 line-clamp-2 text-xs text-[var(--color-bl-muted)]">{lodging.descricao_curta}</p>
          )}
        </>
      )}
      selectedSlug={selectedSlug}
      onSelectSlug={setSelectedSlug}
      renderModalContent={(slug) => <LodgingModalContent slug={slug} />}
    />
  );
}

function LodgingModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: lodging, isLoading } = useLodgingBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!lodging) return <p className="text-[var(--color-bl-muted)]">{t("lodging.notFound")}</p>;

  const hasContact = lodging.contato && Object.values(lodging.contato).some(Boolean);

  return (
    <>
      <DialogHeader>
        <Badge className="w-fit bg-primary-700 text-accent-50 capitalize">{lodging.tipo}</Badge>
        <DialogTitle className="text-xl font-bold text-primary-800">{lodging.nome}</DialogTitle>
        {lodging.estrelas && (
          <div className="flex gap-0.5">
            {Array.from({ length: lodging.estrelas }).map((_, s) => (
              <Star key={s} size={16} className="fill-primary-400 text-primary-400" />
            ))}
          </div>
        )}
      </DialogHeader>
      {lodging.imagem_destaque && <img src={lodging.imagem_destaque} alt={lodging.nome} className="h-56 w-full rounded-xl object-cover" />}
      {lodging.imagens && lodging.imagens.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {lodging.imagens.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt={`${lodging.nome} - ${i + 1}`} className="h-20 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {lodging.faixa_preco && PRICE_KEYS[lodging.faixa_preco] && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            {t(PRICE_KEYS[lodging.faixa_preco])}
          </div>
        )}
        {lodging.comodidades?.map((c) => (
          <div key={c} className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 capitalize">
            {c === "wifi" ? <Wifi size={14} /> : c === "estacionamento" ? <Car size={14} /> : null}
            {c}
          </div>
        ))}
      </div>
      {lodging.descricao && <p className="whitespace-pre-line text-sm leading-relaxed text-primary-700">{lodging.descricao}</p>}
      <Separator className="bg-primary-100" />
      {lodging.endereco && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800"><MapPin size={14} /> {t("lodging.sections.address")}</h3>
          <p className="mt-1 text-sm text-[var(--color-bl-muted)]">{lodging.endereco}{lodging.bairro && ` - ${lodging.bairro}`}</p>
        </div>
      )}
      {hasContact && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800"><Phone size={14} /> {t("lodging.sections.contact")}</h3>
          <div className="mt-2 space-y-1">
            {lodging.contato?.telefone && <a href={`tel:${lodging.contato.telefone}`} className="flex items-center gap-2 text-sm text-[var(--color-bl-muted)] hover:text-primary-600"><Phone size={12} /> {lodging.contato.telefone}</a>}
            {lodging.contato?.email && <a href={`mailto:${lodging.contato.email}`} className="flex items-center gap-2 text-sm text-[var(--color-bl-muted)] hover:text-primary-600"><Mail size={12} /> {lodging.contato.email}</a>}
            {lodging.contato?.site && <a href={lodging.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--color-bl-muted)] hover:text-primary-600"><Globe size={12} /> {t("lodging.links.website")}</a>}
            {lodging.contato?.booking_url && <a href={lodging.contato.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"><ExternalLink size={12} /> {t("lodging.links.booking")}</a>}
          </div>
        </div>
      )}
    </>
  );
}
