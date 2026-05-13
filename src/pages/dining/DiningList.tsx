import { useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { MapPin, UtensilsCrossed, DollarSign, Clock, Phone, Mail, Globe, ExternalLink, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListPage } from "@/components/ui/ListPage";
import { AspectImage } from "@/components/ui/AspectImage";
import {
  ModalPill,
  ModalInfoRow,
  ModalContactLink,
  ModalScheduleList,
} from "@/components/ui/ListPageLayout";
import { IMAGE_RATIOS } from "@/lib/constants";
import { useDiningEstablishments, useDiningCategories, useDiningBySlug } from "@/hooks/useDining";
import type { EstabelecimentoGastronomia } from "@/types/database";

const PRICE_KEYS = ["", "dining.pricing.budget", "dining.pricing.moderate", "dining.pricing.premium"];

export default function DiningList() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get("categoria") ?? "todos");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useDiningCategories();
  const { data: establishments, isLoading: loadingList } = useDiningEstablishments(selected);

  const filterOptions = [
    { label: t("dining.filters.all"), value: "todos" },
    ...(categories?.map((c) => ({ label: c.nome, value: c.slug })) ?? []),
  ];

  return (
    <ListPage<EstabelecimentoGastronomia>
      title={t("dining.title")}
      subtitle={t("dining.subtitle")}
      items={establishments}
      isLoading={loadingList}
      emptyMessage={t("dining.empty")}
      filters={{ options: filterOptions, selected, onSelect: setSelected, isLoading: loadingCats }}
      placeholderIcon={<UtensilsCrossed size={28} className="text-[var(--color-bl-muted)]" />}
      renderCardContent={(est) => (
        <>
          <h3 className="font-bold bl-display text-base">{est.nome}</h3>
          {est.descricao_curta && (
            <p className="mt-1 line-clamp-2 text-xs text-[var(--color-bl-muted)]">{est.descricao_curta}</p>
          )}
        </>
      )}
      selectedSlug={selectedSlug}
      onSelectSlug={setSelectedSlug}
      renderModalContent={(slug) => <DiningModalContent slug={slug} />}
    />
  );
}

function DiningModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: est, isLoading } = useDiningBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!est) return <p className="text-[var(--color-bl-muted)]">{t("dining.notFound")}</p>;

  const hasContact = est.contato && Object.values(est.contato).some(Boolean);
  const hasSchedule = est.horario_funcionamento && Object.keys(est.horario_funcionamento).length > 0;

  return (
    <>
      {est.imagem_destaque && (
        <AspectImage
          src={est.imagem_destaque}
          alt={est.nome}
          ratio={IMAGE_RATIOS.postCover}
          className="-mx-5 -mt-5 rounded-t-2xl"
        />
      )}
      <DialogHeader className="gap-1.5">
        {est.categorias && est.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {est.categorias.map((cat) => (
              <Badge key={cat.id} className="bg-primary-700 text-accent-50">{cat.nome}</Badge>
            ))}
          </div>
        )}
        <DialogTitle className="text-lg font-bold text-primary-800">{est.nome}</DialogTitle>
      </DialogHeader>
      {((est.faixa_preco && PRICE_KEYS[est.faixa_preco]) || est.estacionamento) && (
        <div className="flex flex-wrap gap-1.5">
          {est.faixa_preco && PRICE_KEYS[est.faixa_preco] && (
            <ModalPill icon={<DollarSign size={12} />}>{t(PRICE_KEYS[est.faixa_preco])}</ModalPill>
          )}
          {est.estacionamento && (
            <ModalPill icon={<Car size={12} />}>{t("dining.amenities.parking")}</ModalPill>
          )}
        </div>
      )}
      {est.descricao && (
        <p className="text-sm leading-relaxed text-primary-700">{est.descricao}</p>
      )}
      <div className="space-y-2.5 border-t border-primary-100 pt-3">
        {hasSchedule && (
          <ModalInfoRow icon={<Clock size={14} />}>
            <ModalScheduleList schedule={est.horario_funcionamento!} />
          </ModalInfoRow>
        )}
        {est.endereco && (
          <ModalInfoRow icon={<MapPin size={14} />}>
            {est.endereco}{est.bairro && ` - ${est.bairro}`}
          </ModalInfoRow>
        )}
        {hasContact && (
          <div className="space-y-1">
            {est.contato?.telefone && <ModalContactLink href={`tel:${est.contato.telefone}`} icon={<Phone size={14} />}>{est.contato.telefone}</ModalContactLink>}
            {est.contato?.email && <ModalContactLink href={`mailto:${est.contato.email}`} icon={<Mail size={14} />}>{est.contato.email}</ModalContactLink>}
            {est.contato?.site && <ModalContactLink href={est.contato.site} icon={<Globe size={14} />} external>{t("dining.links.website")}</ModalContactLink>}
            {est.contato?.instagram && <ModalContactLink href={est.contato.instagram} icon={<ExternalLink size={14} />} external>{t("dining.links.instagram")}</ModalContactLink>}
          </div>
        )}
      </div>
    </>
  );
}
