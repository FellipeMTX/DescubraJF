import { useState } from "react";
import { useSearchParams } from "react-router";
import { MapPin, UtensilsCrossed, DollarSign, Clock, Phone, Mail, Globe, ExternalLink, Car, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListPage } from "@/components/ui/ListPage";
import { useDiningEstablishments, useDiningCategories, useDiningBySlug } from "@/hooks/useDining";
import type { EstabelecimentoGastronomia } from "@/types/database";

const PRICE_LABELS = ["", "Econômico", "Moderado", "Premium"];
const PRICE_DOTS = ["", "$", "$$", "$$$"];

export default function DiningList() {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get("categoria") ?? "todos");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useDiningCategories();
  const { data: establishments, isLoading: loadingList } = useDiningEstablishments(selected);

  const filterOptions = [
    { label: "Todos", value: "todos" },
    ...(categories?.map((c) => ({ label: c.nome, value: c.slug })) ?? []),
  ];

  return (
    <ListPage<EstabelecimentoGastronomia>
      title="Onde Comer e Beber"
      subtitle="Experimente tudo que nossa gastronomia oferece"
      items={establishments}
      isLoading={loadingList}
      emptyMessage="Nenhum estabelecimento encontrado nesta categoria."
      filters={{ options: filterOptions, selected, onSelect: setSelected, isLoading: loadingCats }}
      placeholderIcon={<UtensilsCrossed size={28} className="text-primary-300" />}
      renderCardContent={(est) => (
        <>
          {est.categorias?.map((cat) => (
            <Badge key={cat.id} className="mb-1 w-fit bg-primary-700 text-[10px] text-accent-50">{cat.nome}</Badge>
          ))}
          <h3 className="font-bold text-primary-800 group-hover:text-primary-600">{est.nome}</h3>
          {est.endereco && (
            <p className="mt-1 flex items-center gap-1 text-xs text-accent-500">
              <MapPin size={11} className="shrink-0" /> {est.endereco}
            </p>
          )}
          {est.faixa_preco && (
            <p className="mt-1 text-xs font-medium text-primary-500">
              <DollarSign size={11} className="inline" /> {PRICE_DOTS[est.faixa_preco]}
            </p>
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
  const { data: est, isLoading } = useDiningBySlug(slug);

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (!est) return <p className="text-accent-500">Estabelecimento não encontrado.</p>;

  const hasContact = est.contato && Object.values(est.contato).some(Boolean);
  const hasSchedule = est.horario_funcionamento && Object.keys(est.horario_funcionamento).length > 0;

  return (
    <>
      <DialogHeader>
        {est.categorias?.map((cat) => (
          <Badge key={cat.id} className="w-fit bg-primary-700 text-accent-50">{cat.nome}</Badge>
        ))}
        <DialogTitle className="text-xl font-bold text-primary-800">{est.nome}</DialogTitle>
      </DialogHeader>
      {est.imagem_destaque && <img src={est.imagem_destaque} alt={est.nome} className="h-56 w-full rounded-xl object-cover" />}
      <div className="flex flex-wrap gap-2">
        {est.faixa_preco && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            <DollarSign size={14} /> {PRICE_LABELS[est.faixa_preco]}
          </div>
        )}
        {est.estacionamento && (
          <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            <Car size={14} /> Estacionamento
          </div>
        )}
      </div>
      {est.descricao && <p className="whitespace-pre-line text-sm leading-relaxed text-primary-700">{est.descricao}</p>}
      <Separator className="bg-primary-100" />
      {hasSchedule && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800"><Clock size={14} /> Horários</h3>
          <dl className="mt-2 space-y-1">
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
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800"><MapPin size={14} /> Endereço</h3>
          <p className="mt-1 text-sm text-accent-500">{est.endereco}{est.bairro && ` - ${est.bairro}`}</p>
        </div>
      )}
      {hasContact && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800"><Phone size={14} /> Contato</h3>
          <div className="mt-2 space-y-1">
            {est.contato?.telefone && <a href={`tel:${est.contato.telefone}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><Phone size={12} /> {est.contato.telefone}</a>}
            {est.contato?.email && <a href={`mailto:${est.contato.email}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><Mail size={12} /> {est.contato.email}</a>}
            {est.contato?.site && <a href={est.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><Globe size={12} /> Site oficial</a>}
            {est.contato?.instagram && <a href={est.contato.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600"><ExternalLink size={12} /> Instagram</a>}
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
