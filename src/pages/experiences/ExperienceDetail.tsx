import { useParams, Link } from "react-router";
import {
  Accessibility, Dog, DollarSign, Clock, MapPin, Phone,
  Mail, Globe, ExternalLink, ChevronLeft, Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/components/ui/MapView";
import { useExperienceBySlug } from "@/hooks/useExperiences";

export default function ExperienceDetail() {
  const { slug } = useParams();
  const { data: exp, isLoading, error } = useExperienceBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-4 h-10 w-96" />
        <Skeleton className="mt-6 h-80 w-full rounded-lg" />
        <Skeleton className="mt-6 h-32 w-full" />
      </div>
    );
  }

  if (error || !exp) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Experiência não encontrada
        </h1>
        <Link
          to="/experiencias"
          className="mt-4 inline-flex items-center gap-1 text-primary-600 hover:underline"
        >
          <ChevronLeft size={16} /> Voltar para experiências
        </Link>
      </div>
    );
  }

  const hasMap = exp.latitude && exp.longitude;
  const hasContact = exp.contato && Object.values(exp.contato).some(Boolean);
  const hasSchedule =
    exp.horario_funcionamento &&
    Object.keys(exp.horario_funcionamento).length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <Link
        to="/experiencias"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
      >
        <ChevronLeft size={16} /> Experiências
      </Link>

      {/* Title + Category */}
      <div className="mt-4">
        {exp.categoria && (
          <Badge
            className="mb-2 text-white"
            style={{ backgroundColor: exp.categoria.cor ?? "#7b9669" }}
          >
            {exp.categoria.nome}
          </Badge>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{exp.nome}</h1>
      </div>

      {/* Main image */}
      <div className="mt-6 overflow-hidden rounded-xl">
        {exp.imagem_destaque ? (
          <img
            src={exp.imagem_destaque}
            alt={exp.nome}
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 items-center justify-center bg-primary-50 text-primary-300">
            Foto em breve
          </div>
        )}
      </div>

      {/* Image gallery */}
      {exp.imagens && exp.imagens.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {exp.imagens.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${exp.nome} - foto ${i + 1}`}
              className="h-24 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* Badges row */}
      <div className="mt-6 flex flex-wrap gap-3">
        {exp.gratuito && (
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
            <DollarSign size={16} /> Gratuito
          </div>
        )}
        {exp.acessibilidade && (
          <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <Accessibility size={16} /> Acessível
          </div>
        )}
        {exp.pet_friendly && (
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700">
            <Dog size={16} /> Pet Friendly
          </div>
        )}
      </div>

      {/* Description */}
      {exp.descricao && (
        <div className="mt-6">
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">{exp.descricao}</p>
        </div>
      )}

      <Separator className="my-8" />

      {/* Info grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: schedule + address */}
        <div className="space-y-6">
          {/* Schedule */}
          {hasSchedule && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-900">
                <Clock size={16} /> Horário de Funcionamento
              </h3>
              <dl className="mt-3 space-y-1">
                {Object.entries(exp.horario_funcionamento!).map(
                  ([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <dt className="capitalize text-gray-600">{day}</dt>
                      <dd className="font-medium text-gray-900">{hours as string}</dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          )}

          {/* Address */}
          {exp.endereco && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-900">
                <MapPin size={16} /> Endereço
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {exp.endereco}
                {exp.bairro && ` - ${exp.bairro}`}
              </p>
            </div>
          )}

          {/* Contact */}
          {hasContact && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-900">
                <Phone size={16} /> Contato
              </h3>
              <div className="mt-3 space-y-2">
                {exp.contato?.telefone && (
                  <a
                    href={`tel:${exp.contato.telefone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Phone size={14} /> {exp.contato.telefone}
                  </a>
                )}
                {exp.contato?.email && (
                  <a
                    href={`mailto:${exp.contato.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Mail size={14} /> {exp.contato.email}
                  </a>
                )}
                {exp.contato?.site && (
                  <a
                    href={exp.contato.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                  >
                    <Globe size={14} /> Site oficial
                  </a>
                )}
                {exp.contato?.instagram && (
                  <a
                    href={exp.contato.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                  >
                    <ExternalLink size={14} /> Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: map + actions */}
        <div className="space-y-4">
          {hasMap && (
            <MapView
              center={[exp.latitude!, exp.longitude!]}
              markers={[
                {
                  position: [exp.latitude!, exp.longitude!],
                  title: exp.nome,
                  popup: exp.nome,
                },
              ]}
              className="h-64 w-full rounded-lg"
            />
          )}

          {/* External links */}
          <div className="flex flex-wrap gap-2">
            {exp.contato?.maps_link && (
              <a
                href={exp.contato.maps_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <MapPin size={14} /> Google Maps
                </Button>
              </a>
            )}
            {exp.contato?.waze_link && (
              <a
                href={exp.contato.waze_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink size={14} /> Waze
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <Share2 size={14} /> Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
