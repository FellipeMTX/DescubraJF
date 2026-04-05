import { useEffect } from "react";
import { Phone, Mail, Globe, ExternalLink, MapPin, LayoutGrid } from "lucide-react";
import { getIconByName } from "@/components/ui/IconPicker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

function CategoryButton({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description?: string | null;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all ${
        active
          ? "border-primary-500 bg-primary-500 text-white shadow-md"
          : "border-primary-200 bg-white text-primary-700 hover:border-primary-400 hover:bg-primary-50"
      }`}
    >
      {icon}
      <span className="font-bold uppercase tracking-wider text-lg mt-2">{label}</span>
      {description && (
        <span className="leading-tight opacity-80 text-md">{description}</span>
      )}
    </button>
  );
}

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
  const selectedCategory = categories?.find((c) => c.slug === selected);

  useEffect(() => {
    if (!selected && categories?.length) {
      onSelect(categories[0].slug);
    }
  }, [categories, selected, onSelect]);

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
            : categories?.map((cat) => {
                  const Icon = getIconByName(cat.icone);
                  return (
                    <CategoryButton
                      key={cat.id}
                      active={selected === cat.slug}
                      onClick={() => onSelect(cat.slug)}
                      icon={Icon ? <Icon size={28} /> : <LayoutGrid size={28} />}
                      label={cat.nome}
                      description={cat.descricao}
                    />
                  );
                })}
        </div>

        {/* Selected category title */}
        {selectedCategory && (
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
              {items.map((item) => {
                const hasContact = item.contato && Object.values(item.contato).some(Boolean);
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-primary-200 bg-white transition-all hover:border-primary-400 hover:shadow-md"
                  >
                    <div className="flex h-20 flex-col justify-center bg-primary-500 px-5">
                      <h3 className="font-bold text-white">{item.nome}</h3>
                      {item.descricao_curta && (
                        <p className="mt-1 truncate text-sm text-white/80">{item.descricao_curta.length > 50 ? `${item.descricao_curta.slice(0, 50)}...` : item.descricao_curta}</p>
                      )}
                    </div>
                    <div className="p-5">
                    {item.imagem_destaque && (
                      <img src={item.imagem_destaque} alt={item.nome} className="mb-3 h-40 w-full rounded-lg object-cover" />
                    )}
                    {item.descricao && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-primary-700">{item.descricao}</p>
                    )}
                    {item.endereco && (
                      <p className="mt-2 text-xs text-accent-500">
                        <MapPin size={11} className="mr-1 inline shrink-0" />
                        {item.endereco}{item.bairro && ` - ${item.bairro}`}
                      </p>
                    )}
                    {hasContact && (
                      <div className="mt-3 space-y-1">
                        {item.contato?.telefone && (
                          <a href={`tel:${item.contato.telefone}`} className="flex cursor-pointer items-center gap-2 text-xs text-accent-500 hover:text-primary-600">
                            <Phone size={12} /> {item.contato.telefone}
                          </a>
                        )}
                        {item.contato?.email && (
                          <a href={`mailto:${item.contato.email}`} className="flex cursor-pointer items-center gap-2 text-xs text-accent-500 hover:text-primary-600">
                            <Mail size={12} /> {item.contato.email}
                          </a>
                        )}
                        {item.contato?.site && (
                          <a href={item.contato.site} target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-2 text-xs text-accent-500 hover:text-primary-600">
                            <Globe size={12} /> Site oficial
                          </a>
                        )}
                        {item.contato?.instagram && (
                          <a href={item.contato.instagram} target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-2 text-xs text-accent-500 hover:text-primary-600">
                            <ExternalLink size={12} /> Instagram
                          </a>
                        )}
                      </div>
                    )}
                    {item.link_externo && (
                      <a href={item.link_externo} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block cursor-pointer">
                        <Button variant="outline" size="sm">
                          <ExternalLink size={14} /> Acessar
                        </Button>
                      </a>
                    )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
