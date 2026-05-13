import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, BedDouble, Phone, Mail, Globe, ExternalLink, Wifi, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListPage } from "@/components/ui/ListPage";
import { AspectImage } from "@/components/ui/AspectImage";
import {
  ModalPill,
  ModalInfoRow,
  ModalContactLink,
} from "@/components/ui/ListPageLayout";
import { IMAGE_RATIOS } from "@/lib/constants";
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
      {lodging.imagem_destaque && (
        <AspectImage
          src={lodging.imagem_destaque}
          alt={lodging.nome}
          ratio={IMAGE_RATIOS.postCover}
          className="-mx-5 -mt-5 rounded-t-2xl"
        />
      )}
      <DialogHeader className="gap-1.5">
        <Badge className="w-fit bg-primary-700 text-accent-50 capitalize">{lodging.tipo}</Badge>
        <DialogTitle className="text-lg font-bold text-primary-800">{lodging.nome}</DialogTitle>
        {lodging.estrelas && (
          <StarRating value={lodging.estrelas} size={14} className="text-primary-400" />
        )}
      </DialogHeader>
      {lodging.imagens && lodging.imagens.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5">
          {lodging.imagens.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt={`${lodging.nome} - ${i + 1}`} className="aspect-square w-full rounded-md object-cover" />
          ))}
        </div>
      )}
      {((lodging.faixa_preco && PRICE_KEYS[lodging.faixa_preco]) || (lodging.comodidades && lodging.comodidades.length > 0)) && (
        <div className="flex flex-wrap gap-1.5">
          {lodging.faixa_preco && PRICE_KEYS[lodging.faixa_preco] && (
            <ModalPill>{t(PRICE_KEYS[lodging.faixa_preco])}</ModalPill>
          )}
          {lodging.comodidades?.map((c) => (
            <ModalPill
              key={c}
              icon={c === "wifi" ? <Wifi size={12} /> : c === "estacionamento" ? <Car size={12} /> : undefined}
            >
              <span className="capitalize">{c}</span>
            </ModalPill>
          ))}
        </div>
      )}
      {lodging.descricao && (
        <p className="text-sm leading-relaxed text-primary-700">{lodging.descricao}</p>
      )}
      <div className="space-y-2.5 border-t border-primary-100 pt-3">
        {lodging.endereco && (
          <ModalInfoRow icon={<MapPin size={14} />}>
            {lodging.endereco}{lodging.bairro && ` - ${lodging.bairro}`}
          </ModalInfoRow>
        )}
        {hasContact && (
          <div className="space-y-1">
            {lodging.contato?.telefone && <ModalContactLink href={`tel:${lodging.contato.telefone}`} icon={<Phone size={14} />}>{lodging.contato.telefone}</ModalContactLink>}
            {lodging.contato?.email && <ModalContactLink href={`mailto:${lodging.contato.email}`} icon={<Mail size={14} />}>{lodging.contato.email}</ModalContactLink>}
            {lodging.contato?.site && <ModalContactLink href={lodging.contato.site} icon={<Globe size={14} />} external>{t("lodging.links.website")}</ModalContactLink>}
            {lodging.contato?.booking_url && (
              <a href={lodging.contato.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600">
                <ExternalLink size={14} /> {t("lodging.links.booking")}
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
