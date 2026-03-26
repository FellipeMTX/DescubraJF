import { useParams, Link } from "react-router";
import {
  ChevronLeft, MapPin, Phone, Mail, Globe,
  ExternalLink, Star, Wifi, Car, Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/components/ui/MapView";
import { useLodgingBySlug } from "@/hooks/useLodging";

const PRICE_LABELS = ["", "Econômico", "Moderado", "Premium"];

export default function LodgingDetail() {
  const { slug } = useParams();
  const { data: lodging, isLoading, error } = useLodgingBySlug(slug ?? "");

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

  if (error || !lodging) {
    return (
      <div className="min-h-screen bg-primary-50 pt-24">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-primary-800">Hospedagem não encontrada</h1>
          <Link to="/onde-ficar" className="mt-4 inline-flex items-center gap-1 text-primary-500 hover:underline">
            <ChevronLeft size={16} /> Voltar para Onde Ficar
          </Link>
        </div>
      </div>
    );
  }

  const hasMap = lodging.latitude && lodging.longitude;
  const hasContact = lodging.contato && Object.values(lodging.contato).some(Boolean);

  return (
    <div className="min-h-screen bg-primary-50 pt-24">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/onde-ficar" className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-primary-600">
          <ChevronLeft size={16} /> Onde Ficar
        </Link>

        <div className="mt-4">
          <Badge className="mb-2 bg-primary-700 text-accent-50 capitalize">{lodging.tipo}</Badge>
          <h1 className="text-3xl font-bold text-primary-800">{lodging.nome}</h1>
          {lodging.estrelas && (
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: lodging.estrelas }).map((_, s) => (
                <Star key={s} size={16} className="fill-primary-400 text-primary-400" />
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div className="mt-6 overflow-hidden rounded-xl">
          {lodging.imagem_destaque ? (
            <img src={lodging.imagem_destaque} alt={lodging.nome} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center bg-primary-100 text-primary-300">
              Foto em breve
            </div>
          )}
        </div>

        {/* Gallery */}
        {lodging.imagens && lodging.imagens.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {lodging.imagens.slice(0, 4).map((img, i) => (
              <img key={i} src={img} alt={`${lodging.nome} - ${i + 1}`} className="h-24 w-full rounded-lg object-cover" />
            ))}
          </div>
        )}

        {/* Info badges */}
        <div className="mt-6 flex flex-wrap gap-3">
          {lodging.faixa_preco && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700">
              {PRICE_LABELS[lodging.faixa_preco]}
            </div>
          )}
          {lodging.comodidades?.map((c) => (
            <div key={c} className="flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 capitalize">
              {c === "wifi" ? <Wifi size={14} /> : c === "estacionamento" ? <Car size={14} /> : null}
              {c}
            </div>
          ))}
        </div>

        {/* Description */}
        {lodging.descricao && (
          <p className="mt-6 whitespace-pre-line leading-relaxed text-primary-700">{lodging.descricao}</p>
        )}

        <Separator className="my-8 bg-primary-200" />

        {/* Info grid */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {lodging.endereco && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
                  <MapPin size={16} /> Endereço
                </h3>
                <p className="mt-2 text-sm text-accent-500">
                  {lodging.endereco}{lodging.bairro && ` - ${lodging.bairro}`}
                </p>
              </div>
            )}

            {hasContact && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
                  <Phone size={16} /> Contato
                </h3>
                <div className="mt-3 space-y-2">
                  {lodging.contato?.telefone && (
                    <a href={`tel:${lodging.contato.telefone}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <Phone size={14} /> {lodging.contato.telefone}
                    </a>
                  )}
                  {lodging.contato?.email && (
                    <a href={`mailto:${lodging.contato.email}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <Mail size={14} /> {lodging.contato.email}
                    </a>
                  )}
                  {lodging.contato?.site && (
                    <a href={lodging.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                      <Globe size={14} /> Site oficial
                    </a>
                  )}
                  {lodging.contato?.booking_url && (
                    <a href={lodging.contato.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600">
                      <ExternalLink size={14} /> Reservar agora
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {hasMap && (
              <MapView
                center={[lodging.latitude!, lodging.longitude!]}
                markers={[{ position: [lodging.latitude!, lodging.longitude!], title: lodging.nome, popup: lodging.nome }]}
                className="h-64 w-full rounded-xl"
              />
            )}
            <div className="flex flex-wrap gap-2">
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
