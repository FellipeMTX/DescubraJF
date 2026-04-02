import { useState } from "react";
import { Phone, Mail, Globe, ExternalLink, MapPin, Share2, LayoutGrid } from "lucide-react";
import { getIconByName } from "@/components/ui/IconPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetailModal } from "@/components/ui/ListPageLayout";

type CategoryItem = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  icone: string | null;
};

type ServiceItem = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  imagem_destaque: string | null;
  endereco: string | null;
  bairro: string | null;
  contato: {
    telefone?: string;
    email?: string;
    site?: string;
    instagram?: string;
  } | null;
  link_externo: string | null;
  categoria?: CategoryItem;
};

type CategoryGridPageProps = {
  title: string;
  subtitle: string;
  categories: CategoryItem[] | undefined;
  items: ServiceItem[] | undefined;
  isLoadingCategories: boolean;
  isLoadingItems: boolean;
  selected: string;
  onSelect: (slug: string) => void;
  emptyMessage: string;
};

export function CategoryGridPage({
  title,
  subtitle,
  categories,
  items,
  isLoadingCategories,
  isLoadingItems,
  selected,
  onSelect,
  emptyMessage,
}: CategoryGridPageProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedItem = items?.find((i) => i.slug === selectedSlug);
  const selectedCategory = categories?.find((c) => c.slug === selected);

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">{title}</h1>
        <p className="mt-2 text-accent-500">{subtitle}</p>

        {/* Category grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {isLoadingCategories
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))
            : (
              <>
                <button
                  onClick={() => onSelect("todos")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    selected === "todos"
                      ? "border-primary-500 bg-primary-500 text-white shadow-md"
                      : "border-primary-200 bg-white text-primary-700 hover:border-primary-400 hover:bg-primary-50"
                  }`}
                >
                  <LayoutGrid size={28} />
                  <span className="text-xs font-bold uppercase tracking-wider">Todos</span>
                  <span className="text-[10px] leading-tight opacity-80">Mostrar todos os serviços disponíveis</span>
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelect(cat.slug)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                      selected === cat.slug
                        ? "border-primary-500 bg-primary-500 text-white shadow-md"
                        : "border-primary-200 bg-white text-primary-700 hover:border-primary-400 hover:bg-primary-50"
                    }`}
                  >
                    {(() => { const Icon = getIconByName(cat.icone); return Icon ? <Icon size={28} /> : <LayoutGrid size={28} />; })()}
                    <span className="text-xs font-bold uppercase tracking-wider">{cat.nome}</span>
                    {cat.descricao && (
                      <span className="text-[10px] leading-tight opacity-80">{cat.descricao}</span>
                    )}
                  </button>
                ))}
              </>
            )}
        </div>

        {/* Selected category title */}
        {selected !== "todos" && selectedCategory && (
          <div className="mt-8 rounded-xl bg-primary-500 px-6 py-3 text-center">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">
              {selectedCategory.nome}
            </h2>
          </div>
        )}

        {/* Items grid */}
        <div className="mt-6">
          {isLoadingItems ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : !items?.length ? (
            <p className="py-12 text-center text-accent-500">{emptyMessage}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSlug(item.slug)}
                  className="group rounded-xl border border-primary-200 bg-white p-5 text-left transition-all hover:border-primary-400 hover:shadow-md"
                >
                  {item.categoria && (
                    <Badge className="mb-2 bg-primary-700 text-[10px] uppercase tracking-wider text-accent-50">
                      {item.categoria.nome}
                    </Badge>
                  )}
                  <h3 className="font-bold text-primary-800 group-hover:text-primary-600">
                    {item.nome}
                  </h3>
                  {item.endereco && (
                    <p className="mt-1 text-xs text-accent-500">
                      <MapPin size={11} className="mr-1 inline shrink-0" />
                      {item.endereco}{item.bairro && ` - ${item.bairro}`}
                    </p>
                  )}
                  {item.descricao_curta && (
                    <p className="mt-2 line-clamp-2 text-xs text-accent-500">{item.descricao_curta}</p>
                  )}
                  {item.contato?.site && (
                    <p className="mt-2 text-xs font-medium text-primary-500">
                      Site: {item.contato.site}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <DetailModal open={!!selectedSlug} onClose={() => setSelectedSlug(null)}>
        {selectedItem && <ServiceModalContent item={selectedItem} />}
      </DetailModal>
    </div>
  );
}

function ServiceModalContent({ item }: { item: ServiceItem }) {
  const hasContact = item.contato && Object.values(item.contato).some(Boolean);

  return (
    <>
      <DialogHeader>
        {item.categoria && (
          <Badge className="w-fit bg-primary-700 text-accent-50">{item.categoria.nome}</Badge>
        )}
        <DialogTitle className="text-xl font-bold text-primary-800">{item.nome}</DialogTitle>
      </DialogHeader>
      {item.imagem_destaque && (
        <img src={item.imagem_destaque} alt={item.nome} className="h-56 w-full rounded-xl object-cover" />
      )}
      {item.descricao && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-primary-700">{item.descricao}</p>
      )}
      {(item.endereco || hasContact || item.link_externo) && <Separator className="bg-primary-100" />}
      {item.endereco && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <MapPin size={14} /> Endereço
          </h3>
          <p className="mt-1 text-sm text-accent-500">
            {item.endereco}{item.bairro && ` - ${item.bairro}`}
          </p>
        </div>
      )}
      {hasContact && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-800">
            <Phone size={14} /> Contato
          </h3>
          <div className="mt-2 space-y-1">
            {item.contato?.telefone && (
              <a href={`tel:${item.contato.telefone}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <Phone size={12} /> {item.contato.telefone}
              </a>
            )}
            {item.contato?.email && (
              <a href={`mailto:${item.contato.email}`} className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <Mail size={12} /> {item.contato.email}
              </a>
            )}
            {item.contato?.site && (
              <a href={item.contato.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <Globe size={12} /> Site oficial
              </a>
            )}
            {item.contato?.instagram && (
              <a href={item.contato.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent-500 hover:text-primary-600">
                <ExternalLink size={12} /> Instagram
              </a>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {item.link_externo && (
          <a href={item.link_externo} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink size={14} /> Acessar
            </Button>
          </a>
        )}
        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          <Share2 size={14} /> Compartilhar
        </Button>
      </div>
    </>
  );
}
