import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Accessibility, Dog, DollarSign, Clock, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ListPage } from "@/components/ui/ListPage";
import {
  useExperiences,
  useExperienceCategories,
  useExperienceBySlug,
} from "@/hooks/useExperiences";
import type { Experiencia } from "@/types/database";

export default function ExperienceList() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useExperienceCategories();
  const { data: experiences, isLoading: loadingExps } = useExperiences(selectedCategory);

  return (
    <ListPage<Experiencia>
      title={t("pages.experiences.title")}
      subtitle={t("pages.experiences.subtitle")}
      items={experiences}
      isLoading={loadingExps}
      emptyMessage={t("pages.experiences.empty")}
      filterSlot={
        <div className="mt-6">
          {loadingCats ? (
            <Skeleton className="h-9 w-full" />
          ) : categories ? (
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={(slug) => { setSelectedCategory(slug); setSelectedSlug(null); }}
            />
          ) : null}
        </div>
      }
      placeholderIcon={<MapPin size={28} className="text-primary-300" />}
      renderCardContent={(exp) => (
        <>
          <h3 className="font-bold text-primary-800 group-hover:text-primary-600">{exp.nome}</h3>
          {exp.descricao_curta && (
            <p className="mt-1 line-clamp-2 text-xs text-accent-500">{exp.descricao_curta}</p>
          )}
        </>
      )}
      selectedSlug={selectedSlug}
      onSelectSlug={setSelectedSlug}
      renderModalContent={(slug) => <ExperienceModalContent slug={slug} />}
    />
  );
}

function ExperienceModalContent({ slug }: { slug: string }) {
  const { data: exp, isLoading } = useExperienceBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!exp) return <p className="text-accent-500">Atrativo não encontrado.</p>;

  const hasContact = exp.contato && Object.values(exp.contato).some(Boolean);
  const hasSchedule = exp.horario_funcionamento && Object.keys(exp.horario_funcionamento).length > 0;

  return (
    <>
      <DialogHeader>
        {exp.categoria && (
          <Badge className="w-fit text-accent-50" style={{ backgroundColor: exp.categoria.cor ?? "var(--color-primary-400)" }}>{exp.categoria.nome}</Badge>
        )}
        <DialogTitle className="text-xl font-bold text-primary-800">{exp.nome}</DialogTitle>
      </DialogHeader>
      {exp.imagem_destaque && <img src={exp.imagem_destaque} alt={exp.nome} className="h-56 w-full rounded-xl object-cover" />}
      <div className="flex flex-wrap gap-2">
        {exp.gratuito && <InfoBadge icon={<DollarSign size={14} />} label="Gratuito" />}
        {exp.acessibilidade && <InfoBadge icon={<Accessibility size={14} />} label="Acessível" />}
        {exp.pet_friendly && <InfoBadge icon={<Dog size={14} />} label="Pet Friendly" />}
      </div>
      {exp.descricao && <p className="whitespace-pre-line text-sm leading-relaxed text-primary-700">{exp.descricao}</p>}
      <Separator className="bg-primary-100" />
      {hasSchedule && (
        <InfoSection icon={<Clock size={14} />} title="Horários">
          <dl className="mt-2 space-y-1">
            {Object.entries(exp.horario_funcionamento!).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm">
                <dt className="capitalize text-accent-500">{day}</dt>
                <dd className="font-medium text-primary-800">{hours as string}</dd>
              </div>
            ))}
          </dl>
        </InfoSection>
      )}
      {exp.endereco && (
        <InfoSection icon={<MapPin size={14} />} title="Endereço">
          <p className="mt-1 text-sm text-accent-500">{exp.endereco}{exp.bairro && ` - ${exp.bairro}`}</p>
        </InfoSection>
      )}
      {hasContact && (
        <InfoSection icon={<Phone size={14} />} title="Contato">
          <div className="mt-2 space-y-1">
            {exp.contato?.telefone && <ContactLink href={`tel:${exp.contato.telefone}`} icon={<Phone size={12} />}>{exp.contato.telefone}</ContactLink>}
            {exp.contato?.email && <ContactLink href={`mailto:${exp.contato.email}`} icon={<Mail size={12} />}>{exp.contato.email}</ContactLink>}
            {exp.contato?.site && <ContactLink href={exp.contato.site} icon={<Globe size={12} />} external>Site oficial</ContactLink>}
            {exp.contato?.instagram && <ContactLink href={exp.contato.instagram} icon={<ExternalLink size={12} />} external>Instagram</ContactLink>}
          </div>
        </InfoSection>
      )}
      {exp.contato?.maps_link && (
        <a href={exp.contato.maps_link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm"><MapPin size={14} /> Google Maps</Button>
        </a>
      )}
    </>
  );
}

function InfoBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
      {icon} {label}
    </div>
  );
}

function InfoSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">{icon} {title}</h3>
      {children}
    </div>
  );
}

function ContactLink({ href, icon, external, children }: { href: string; icon: React.ReactNode; external?: boolean; children: React.ReactNode }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
      {icon} {children}
    </a>
  );
}
