import { useState } from "react";
import { MapPin, Accessibility, Dog, DollarSign, Clock, Phone, Mail, Globe, ExternalLink, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { InteractiveMap, type MapItem } from "@/components/ui/InteractiveMap";
import { cn } from "@/lib/utils";
import {
  useExperiences,
  useExperienceCategories,
  useExperienceBySlug,
} from "@/hooks/useExperiences";
import type { Experiencia } from "@/types/database";

const JF_CENTER: [number, number] = [-21.7612, -43.3496];

export default function ExperienceList() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useExperienceCategories();
  const { data: experiences, isLoading: loadingExps } = useExperiences(selectedCategory);

  const mapItems: MapItem[] = (experiences ?? [])
    .filter((e) => e.latitude && e.longitude)
    .map((e) => ({ id: e.id, name: e.nome, lat: e.latitude!, lng: e.longitude! }));

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">Experiências</h1>
        <p className="mt-2 text-accent-500">Explore o melhor de Juiz de Fora</p>

        {/* Category filter */}
        <div className="mt-6">
          {loadingCats ? (
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))}
            </div>
          ) : categories ? (
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={(slug) => { setSelectedCategory(slug); setSelectedSlug(null); }}
            />
          ) : null}
        </div>

        {/* Map */}
        <div className="sticky top-20 z-10 mt-6">
          {mapItems.length > 0 ? (
            <InteractiveMap
              items={mapItems}
              activeId={hoveredId}
              center={JF_CENTER}
              zoom={13}
              className="h-72 w-full rounded-xl shadow-lg md:h-80"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl bg-primary-100 text-primary-300 md:h-80">
              {loadingExps ? "Carregando mapa..." : "Nenhum local com coordenadas"}
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loadingExps
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))
            : experiences?.map((exp) => (
                <ExperienceCardItem
                  key={exp.id}
                  experience={exp}
                  isHovered={hoveredId === exp.id}
                  onHover={() => setHoveredId(exp.id)}
                  onLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedSlug(exp.slug)}
                />
              ))}
        </div>

        {!loadingExps && !experiences?.length && (
          <p className="mt-12 text-center text-accent-500">
            Nenhuma experiência encontrada nesta categoria.
          </p>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selectedSlug} onOpenChange={(open) => { if (!open) setSelectedSlug(null); }}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto bg-accent-50">
          {selectedSlug && <ExperienceModalContent slug={selectedSlug} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExperienceCardItem({
  experience,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  experience: Experiencia;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick} className="cursor-pointer">
      <Card
        className={cn(
          "group h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-sm transition-all duration-200 hover:shadow-lg",
          isHovered && "ring-2 ring-primary-400 shadow-lg"
        )}
      >
        <div className="flex h-full">
          <div className="relative w-32 shrink-0 overflow-hidden bg-primary-100 sm:w-36">
            {experience.imagem_destaque ? (
              <img
                src={experience.imagem_destaque}
                alt={experience.nome}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                <MapPin size={28} className="text-primary-300" />
              </div>
            )}
          </div>

          <CardContent className="flex flex-col justify-center p-4">
            {experience.categoria && (
              <Badge
                className="mb-1 w-fit text-[10px] text-accent-50"
                style={{ backgroundColor: experience.categoria.cor ?? "#7b9669" }}
              >
                {experience.categoria.nome}
              </Badge>
            )}
            <h3 className="font-bold text-primary-800 group-hover:text-primary-600">
              {experience.nome}
            </h3>
            {experience.descricao_curta && (
              <p className="mt-1 line-clamp-2 text-xs text-accent-500">
                {experience.descricao_curta}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {experience.gratuito && (
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-600">Gratuito</span>
              )}
              {experience.acessibilidade && (
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-600">Acessível</span>
              )}
              {experience.pet_friendly && (
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-600">Pet Friendly</span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function ExperienceModalContent({ slug }: { slug: string }) {
  const { data: exp, isLoading } = useExperienceBySlug(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!exp) return <p className="text-accent-500">Experiência não encontrada.</p>;

  const hasContact = exp.contato && Object.values(exp.contato).some(Boolean);
  const hasSchedule = exp.horario_funcionamento && Object.keys(exp.horario_funcionamento).length > 0;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          {exp.categoria && (
            <Badge className="text-accent-50" style={{ backgroundColor: exp.categoria.cor ?? "#7b9669" }}>
              {exp.categoria.nome}
            </Badge>
          )}
        </div>
        <DialogTitle className="text-xl font-bold text-primary-800">
          {exp.nome}
        </DialogTitle>
      </DialogHeader>

      {/* Image */}
      {exp.imagem_destaque && (
        <img src={exp.imagem_destaque} alt={exp.nome} className="h-56 w-full rounded-xl object-cover" />
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {exp.gratuito && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            <DollarSign size={14} /> Gratuito
          </div>
        )}
        {exp.acessibilidade && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            <Accessibility size={14} /> Acessível
          </div>
        )}
        {exp.pet_friendly && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            <Dog size={14} /> Pet Friendly
          </div>
        )}
      </div>

      {/* Description */}
      {exp.descricao && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-primary-700">{exp.descricao}</p>
      )}

      <Separator className="bg-primary-100" />

      {/* Schedule */}
      {hasSchedule && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <Clock size={14} /> Horários
          </h3>
          <dl className="mt-2 space-y-1">
            {Object.entries(exp.horario_funcionamento!).map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm">
                <dt className="capitalize text-accent-500">{day}</dt>
                <dd className="font-medium text-primary-800">{hours as string}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Address */}
      {exp.endereco && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <MapPin size={14} /> Endereço
          </h3>
          <p className="mt-1 text-sm text-accent-500">{exp.endereco}{exp.bairro && ` - ${exp.bairro}`}</p>
        </div>
      )}

      {/* Contact */}
      {hasContact && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <Phone size={14} /> Contato
          </h3>
          <div className="mt-2 space-y-1">
            {exp.contato?.telefone && (
              <a href={`tel:${exp.contato.telefone}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <Phone size={12} /> {exp.contato.telefone}
              </a>
            )}
            {exp.contato?.email && (
              <a href={`mailto:${exp.contato.email}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <Mail size={12} /> {exp.contato.email}
              </a>
            )}
            {exp.contato?.site && (
              <a href={exp.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <Globe size={12} /> Site oficial
              </a>
            )}
            {exp.contato?.instagram && (
              <a href={exp.contato.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <ExternalLink size={12} /> Instagram
              </a>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {exp.contato?.maps_link && (
          <a href={exp.contato.maps_link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm"><MapPin size={14} /> Google Maps</Button>
          </a>
        )}
        {exp.contato?.waze_link && (
          <a href={exp.contato.waze_link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm"><ExternalLink size={14} /> Waze</Button>
          </a>
        )}
        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          <Share2 size={14} /> Compartilhar
        </Button>
      </div>
    </>
  );
}
