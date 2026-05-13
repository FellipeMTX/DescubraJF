import { useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { MapPin, Accessibility, Dog, DollarSign, Clock, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ListPage } from "@/components/ui/ListPage";
import { AspectImage } from "@/components/ui/AspectImage";
import {
  ModalPill,
  ModalInfoRow,
  ModalContactLink,
  ModalScheduleList,
} from "@/components/ui/ListPageLayout";
import { IMAGE_RATIOS } from "@/lib/constants";
import {
  useExperiences,
  useExperienceCategories,
  useExperienceBySlug,
} from "@/hooks/useExperiences";
import type { Experiencia } from "@/types/database";

export default function ExperienceList() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get("slug");

  function handleSelectSlug(slug: string | null) {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("slug", slug);
    else next.delete("slug");
    setSearchParams(next, { replace: true });
  }

  const { data: categories, isLoading: loadingCats } = useExperienceCategories();
  const { data: experiences, isLoading: loadingExps } = useExperiences(selectedCategory);

  return (
    <ListPage<Experiencia>
      title={t("experiences.title")}
      subtitle={t("experiences.subtitle")}
      items={experiences}
      isLoading={loadingExps}
      emptyMessage={t("experiences.empty")}
      filterSlot={
        <div className="mt-6">
          {loadingCats ? (
            <Skeleton className="h-9 w-full" />
          ) : categories ? (
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={(slug) => { setSelectedCategory(slug); handleSelectSlug(null); }}
            />
          ) : null}
        </div>
      }
      placeholderIcon={<MapPin size={28} className="text-[var(--color-bl-muted)]" />}
      renderCardContent={(exp) => (
        <>
          <h3 className="font-bold bl-display text-base">{exp.nome}</h3>
          {exp.descricao_curta && (
            <p className="mt-1 line-clamp-2 text-xs text-[var(--color-bl-muted)]">{exp.descricao_curta}</p>
          )}
        </>
      )}
      selectedSlug={selectedSlug}
      onSelectSlug={handleSelectSlug}
      renderModalContent={(slug) => <ExperienceModalContent slug={slug} />}
    />
  );
}

function ExperienceModalContent({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { data: exp, isLoading } = useExperienceBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!exp) return <p className="text-[var(--color-bl-muted)]">{t("experiences.notFound")}</p>;

  const hasContact = exp.contato && Object.values(exp.contato).some(Boolean);
  const hasSchedule = exp.horario_funcionamento && Object.keys(exp.horario_funcionamento).length > 0;

  return (
    <>
      {exp.imagem_destaque && (
        <AspectImage
          src={exp.imagem_destaque}
          alt={exp.nome}
          ratio={IMAGE_RATIOS.postCover}
          className="-mx-5 -mt-5 rounded-t-2xl"
        />
      )}
      <DialogHeader className="gap-1.5">
        {exp.categoria && (
          <Badge className="w-fit text-accent-50" style={{ backgroundColor: exp.categoria.cor ?? "var(--color-primary-400)" }}>{exp.categoria.nome}</Badge>
        )}
        <DialogTitle className="text-lg font-bold text-primary-800">{exp.nome}</DialogTitle>
      </DialogHeader>
      {(exp.gratuito || exp.acessibilidade || exp.pet_friendly) && (
        <div className="flex flex-wrap gap-1.5">
          {exp.gratuito && <ModalPill icon={<DollarSign size={12} />}>{t("experiences.badges.free")}</ModalPill>}
          {exp.acessibilidade && <ModalPill icon={<Accessibility size={12} />}>{t("experiences.badges.accessible")}</ModalPill>}
          {exp.pet_friendly && <ModalPill icon={<Dog size={12} />}>{t("experiences.badges.petFriendly")}</ModalPill>}
        </div>
      )}
      {exp.descricao && (
        <p className="text-sm leading-relaxed text-primary-700">{exp.descricao}</p>
      )}
      <div className="space-y-2.5 border-t border-primary-100 pt-3">
        {hasSchedule && (
          <ModalInfoRow icon={<Clock size={14} />}>
            <ModalScheduleList schedule={exp.horario_funcionamento!} />
          </ModalInfoRow>
        )}
        {exp.endereco && (
          <ModalInfoRow icon={<MapPin size={14} />}>
            {exp.endereco}{exp.bairro && ` - ${exp.bairro}`}
          </ModalInfoRow>
        )}
        {hasContact && (
          <div className="space-y-1">
            {exp.contato?.telefone && <ModalContactLink href={`tel:${exp.contato.telefone}`} icon={<Phone size={14} />}>{exp.contato.telefone}</ModalContactLink>}
            {exp.contato?.email && <ModalContactLink href={`mailto:${exp.contato.email}`} icon={<Mail size={14} />}>{exp.contato.email}</ModalContactLink>}
            {exp.contato?.site && <ModalContactLink href={exp.contato.site} icon={<Globe size={14} />} external>{t("experiences.links.website")}</ModalContactLink>}
            {exp.contato?.instagram && <ModalContactLink href={exp.contato.instagram} icon={<ExternalLink size={14} />} external>{t("experiences.links.instagram")}</ModalContactLink>}
          </div>
        )}
      </div>
      {exp.contato?.maps_link && (
        <a href={exp.contato.maps_link} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" size="sm" className="w-full"><MapPin size={14} /> {t("experiences.links.googleMaps")}</Button>
        </a>
      )}
    </>
  );
}
