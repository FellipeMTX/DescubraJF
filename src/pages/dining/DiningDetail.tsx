import { useParams, Link } from "react-router";
import {
  ChevronLeft, MapPin, Phone, Mail, Globe,
  ExternalLink, Clock, DollarSign, Car, Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/components/ui/MapView";
import { useDiningBySlug } from "@/hooks/useDining";

const PRICE_LABELS = ["", "Econômico", "Moderado", "Premium"];

export default function DiningDetail() {
  const { slug } = useParams();
  const { data: est, isLoading, error } = useDiningBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 pt-24">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-4 h-10 w-96" />
          <Skeleton className="mt-6 h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !est) {
    return (
      <div className="min-h-screen bg-primary-50 pt-24">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-primary-800">Estabelecimento não encontrado</h1>
          <Link to="/onde-comer" className="mt-4 inline-flex items-center gap-1 text-primary-500 hover:underline">
            <ChevronLeft size={16} /> Voltar para Onde Comer
          </Link>
        </div>
      </div>
    );
  }

  const hasMap = est.latitude && est.longitude;
  const hasContact = est.contato && Object.values(est.contato).some(Boolean);
  const hasSchedule = est.horario_funcionamento && Object.keys(est.horario_funcionamento).length > 0;

  return (
    <div className="min-h-screen bg-primary-50 pt-24">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/onde-comer" className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-primary-600">
          <ChevronLeft size={16} /> Onde Comer e Beber
        </Link>

        <div className="mt-4">
          {est.categoria && (
            <Badge className="mb-2 bg-primary-700 text-accent-50">{est.categoria.nome}</Badge>
          )}
          <h1 className="text-3xl font-bold text-primary-800">{est.nome}</h1>
        </div>

        {/* Image */}
        <div className="mt-6 overflow-hidden rounded-xl">
          {est.imagem_destaque ? (
            <img src={est.imagem_destaque} alt={est.nome} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center bg-primary-100 text-primary-300">
              Foto em breve
            </div>
          )}
        </div>

        {/* Info badges */}
        <div className="mt-6 flex flex-wrap gap-3">
          {est.faixa_preco && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700">
              <DollarSign size={16} /> {PRICE_LABELS[est.faixa_preco]}
            </div>
          )}
          {est.estacionamento && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700">
              <Car size={16} /> Estacionamento
            </div>
          )}
        </div>

        {/* Description */}
        {est.descricao && (
          <p className="mt-6 whitespace-pre-line leading-relaxed text-primary-700">{est.descricao}</p>
        )}

        <Separator className="my-8 bg-primary-200" />

        {/* Info grid */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {hasSchedule && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
                  <Clock size={16} /> Horário de Funcionamento
                </h3>
                <dl className="mt-3 space-y-1">
                  {Object.entries(est.horario_funcionamento!).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <dt className="capitalize text-accent-500">{day}</dt>
                      <dd className="font-medium text-primary-800">{hours as string}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {est.endereco && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
                  <MapPin size={16} /> Endereço
                </h3>
                <p className="mt-2 text-sm text-accent-500">
                  {est.endereco}{est.bairro && ` - ${est.bairro}`}
                </p>
              </div>
            )}

            {hasContact && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
                  <Phone size={16} /> Contato
                </h3>
                <div className="mt-3 space-y-2">
                  {est.contato?.telefone && (
                    <a href={`tel:${est.contato.telefone}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <Phone size={14} /> {est.contato.telefone}
                    </a>
                  )}
                  {est.contato?.email && (
                    <a href={`mailto:${est.contato.email}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <Mail size={14} /> {est.contato.email}
                    </a>
                  )}
                  {est.contato?.site && (
                    <a href={est.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <Globe size={14} /> Site oficial
                    </a>
                  )}
                  {est.contato?.instagram && (
                    <a href={est.contato.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <ExternalLink size={14} /> Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {hasMap && (
              <MapView
                center={[est.latitude!, est.longitude!]}
                markers={[{ position: [est.latitude!, est.longitude!], title: est.nome, popup: est.nome }]}
                className="h-64 w-full rounded-xl"
              />
            )}
            <div className="flex flex-wrap gap-2">
              {est.contato?.maps_link && (
                <a href={est.contato.maps_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><MapPin size={14} /> Google Maps</Button>
                </a>
              )}
              {est.contato?.waze_link && (
                <a href={est.contato.waze_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink size={14} /> Waze</Button>
                </a>
              )}
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <Share2 size={14} /> Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
