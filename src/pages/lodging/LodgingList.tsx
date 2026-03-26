import { useState } from "react";
import { MapPin, Star, BedDouble, Phone, Mail, Globe, ExternalLink, Wifi, Car, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FilterBar, MapSection, ItemCard, CardsGrid,
  DetailModal, toMapItems,
} from "@/components/ui/ListPageLayout";
import { useLodgingEstablishments, useLodgingBySlug } from "@/hooks/useLodging";

const PRICE_LABELS = ["", "Econômico", "Moderado", "Premium"];

const TYPES = [
  { label: "Todos", value: "todos" },
  { label: "Hotéis", value: "hotel" },
  { label: "Pousadas", value: "pousada" },
  { label: "Hostels", value: "hostel" },
  { label: "Flats", value: "flat" },
];

export default function LodgingList() {
  const [selected, setSelected] = useState("todos");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: lodgings, isLoading } = useLodgingEstablishments(selected);

  const mapItems = toMapItems(lodgings ?? []);

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">Onde Ficar</h1>
        <p className="mt-2 text-accent-500">Lugares para tornar sua estadia memorável</p>

        <FilterBar options={TYPES} selected={selected} onSelect={setSelected} />
        <MapSection items={mapItems} activeId={hoveredId} isLoading={isLoading} />

        <CardsGrid isLoading={isLoading} isEmpty={!lodgings?.length} emptyMessage="Nenhuma hospedagem encontrada nesta categoria.">
          {lodgings?.map((lodging) => (
            <ItemCard
              key={lodging.id}
              imageUrl={lodging.imagem_destaque}
              placeholder={<BedDouble size={28} className="text-primary-300" />}
              isHovered={hoveredId === lodging.id}
              onHover={() => setHoveredId(lodging.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => setSelectedSlug(lodging.slug)}
            >
              <Badge className="mb-1 w-fit bg-primary-700 text-[10px] text-accent-50 capitalize">{lodging.tipo}</Badge>
              <h3 className="font-bold text-primary-800 group-hover:text-primary-600">{lodging.nome}</h3>
              {lodging.estrelas && (
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: lodging.estrelas }).map((_, s) => (
                    <Star key={s} size={11} className="fill-primary-400 text-primary-400" />
                  ))}
                </div>
              )}
              {lodging.endereco && (
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-500">
                  <MapPin size={11} className="shrink-0" /> {lodging.endereco}
                </p>
              )}
            </ItemCard>
          ))}
        </CardsGrid>
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => setSelectedSlug(null)}>
        {selectedSlug && <LodgingModalContent slug={selectedSlug} />}
      </DetailModal>
    </div>
  );
}

function LodgingModalContent({ slug }: { slug: string }) {
  const { data: lodging, isLoading } = useLodgingBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!lodging) return <p className="text-accent-500">Hospedagem não encontrada.</p>;

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

      {lodging.imagem_destaque && (
        <img src={lodging.imagem_destaque} alt={lodging.nome} className="h-56 w-full rounded-xl object-cover" />
      )}

      {/* Gallery */}
      {lodging.imagens && lodging.imagens.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {lodging.imagens.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt={`${lodging.nome} - ${i + 1}`} className="h-20 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}

      {/* Info badges */}
      <div className="flex flex-wrap gap-2">
        {lodging.faixa_preco && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            {PRICE_LABELS[lodging.faixa_preco]}
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
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <MapPin size={14} /> Endereço
          </h3>
          <p className="mt-1 text-sm text-accent-500">{lodging.endereco}{lodging.bairro && ` - ${lodging.bairro}`}</p>
        </div>
      )}

      {hasContact && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <Phone size={14} /> Contato
          </h3>
          <div className="mt-2 space-y-1">
            {lodging.contato?.telefone && <a href={`tel:${lodging.contato.telefone}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><Phone size={12} /> {lodging.contato.telefone}</a>}
            {lodging.contato?.email && <a href={`mailto:${lodging.contato.email}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><Mail size={12} /> {lodging.contato.email}</a>}
            {lodging.contato?.site && <a href={lodging.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><Globe size={12} /> Site oficial</a>}
            {lodging.contato?.booking_url && <a href={lodging.contato.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"><ExternalLink size={12} /> Reservar agora</a>}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          <Share2 size={14} /> Compartilhar
        </Button>
      </div>
    </>
  );
}
