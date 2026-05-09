import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, Globe, ExternalLink, MapPin, LayoutGrid } from "lucide-react";
import { getIconByName } from "@/components/ui/IconPicker";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";

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
      className="flex h-36 cursor-pointer flex-col items-center rounded-[24px] border px-4 pt-4 text-center transition-all hover:-translate-y-0.5"
      style={
        active
          ? {
              background: "var(--color-bl-ink)",
              color: "var(--color-bl-bg)",
              borderColor: "transparent",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }
          : {
              background: "var(--color-bl-bg)",
              color: "var(--color-bl-ink)",
              borderColor: "rgba(0,0,0,0.08)",
            }
      }
    >
      <div className="flex h-8 shrink-0 items-center">{icon}</div>
      <span
        className="bl-display mt-2 text-lg"
        style={{ letterSpacing: 0 }}
      >
        {label}
      </span>
      <span
        className="mt-1 line-clamp-2 text-sm leading-tight"
        style={{
          opacity: 0.75,
          color: active ? "rgba(255,255,255,0.85)" : "var(--color-bl-muted)",
        }}
      >
        {description ? (description.length > 80 ? `${description.slice(0, 80)}...` : description) : " "}
      </span>
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
  const { t } = useTranslation();
  const selectedCategory = categories?.find((c) => c.slug === selected);

  useEffect(() => {
    if (!selected && categories?.length) {
      onSelect(categories[0].slug);
    }
  }, [categories, selected, onSelect]);

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12">
        <PageHeader title={title} subtitle={subtitle} />

        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {isLoadingCategories
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-[24px]" />
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

        {selectedCategory && (
          <div
            className="mt-10 rounded-full px-6 py-3 text-center"
            style={{ background: "var(--color-bl-card)" }}
          >
            <h2 className="bl-display text-2xl">
              {selectedCategory.nome}
            </h2>
          </div>
        )}

        <div className="mt-8">
          {isLoadingItems ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-[24px]" />
              ))}
            </div>
          ) : !items?.length ? (
            <p
              className="py-12 text-center"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {emptyMessage}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const hasContact = item.contato && Object.values(item.contato).some(Boolean);
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[24px] border transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background: "var(--color-bl-bg)",
                      borderColor: "rgba(0,0,0,0.08)",
                    }}
                  >
                    <div
                      className="flex h-20 flex-col justify-center px-5"
                      style={{
                        background: "var(--color-bl-ink)",
                        color: "var(--color-bl-bg)",
                      }}
                    >
                      <h3 className="bl-display text-xl">{item.nome}</h3>
                      {item.descricao_curta && (
                        <p
                          className="mt-1 truncate text-sm"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {item.descricao_curta.length > 80
                            ? `${item.descricao_curta.slice(0, 80)}...`
                            : item.descricao_curta}
                        </p>
                      )}
                    </div>
                    <div className="p-5">
                      {item.imagem_destaque && (
                        <img
                          src={item.imagem_destaque}
                          alt={item.nome}
                          className="mb-3 h-40 w-full rounded-[16px] object-cover"
                        />
                      )}
                      {item.descricao && (
                        <p
                          className="mt-2 whitespace-pre-line text-sm leading-relaxed"
                          style={{ color: "var(--color-bl-ink)" }}
                        >
                          {item.descricao}
                        </p>
                      )}
                      {item.endereco && (
                        <p
                          className="mt-2 text-xs"
                          style={{ color: "var(--color-bl-muted)" }}
                        >
                          <MapPin size={11} className="mr-1 inline shrink-0" />
                          {item.endereco}{item.bairro && ` - ${item.bairro}`}
                        </p>
                      )}
                      {hasContact && (
                        <div className="mt-3 space-y-1">
                          {item.contato?.telefone && (
                            <a
                              href={`tel:${item.contato.telefone}`}
                              className="flex items-center gap-2 text-xs hover:underline"
                              style={{ color: "var(--color-bl-muted)" }}
                            >
                              <Phone size={12} /> {item.contato.telefone}
                            </a>
                          )}
                          {item.contato?.email && (
                            <a
                              href={`mailto:${item.contato.email}`}
                              className="flex items-center gap-2 text-xs hover:underline"
                              style={{ color: "var(--color-bl-muted)" }}
                            >
                              <Mail size={12} /> {item.contato.email}
                            </a>
                          )}
                          {item.contato?.site && (
                            <a
                              href={item.contato.site}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs hover:underline"
                              style={{ color: "var(--color-bl-muted)" }}
                            >
                              <Globe size={12} /> {t("categoryGrid.siteOfficial")}
                            </a>
                          )}
                          {item.contato?.instagram && (
                            <a
                              href={item.contato.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs hover:underline"
                              style={{ color: "var(--color-bl-muted)" }}
                            >
                              <ExternalLink size={12} /> {t("categoryGrid.instagram")}
                            </a>
                          )}
                        </div>
                      )}
                      {item.link_externo && (
                        <a
                          href={item.link_externo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bl-btn-ghost mt-4 inline-flex"
                        >
                          <ExternalLink size={14} /> {t("categoryGrid.access")}
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
