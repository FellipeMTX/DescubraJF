import { createElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, MapPin } from "lucide-react";
import { getIconByName } from "@/components/ui/IconPicker";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { useServiceCategories, useServices } from "@/hooks/useServices";
import type { CategoriaServico, Servico } from "@/types/database";
import { ServiceModal } from "./ServiceModal";

// ─── category sidebar item (desktop) ────────────────────────────────────────

function CatItem({
  cat,
  active,
  onClick,
}: {
  cat: CategoriaServico;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = getIconByName(cat.icone);
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[10px] px-3 py-3 text-left transition-colors"
      style={{ background: active ? "var(--color-bl-ink)" : "transparent" }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
        style={
          active
            ? { background: "rgba(255,255,255,0.08)", color: "var(--color-bl-bg)" }
            : { background: "rgba(0,0,0,0.06)", color: "var(--color-bl-ink)" }
        }
      >
        {Icon && createElement(Icon, { size: 20 })}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="bl-display m-0 truncate text-base leading-tight"
          style={{ fontWeight: 500, color: active ? "var(--color-bl-bg)" : "var(--color-bl-ink)" }}
        >
          {cat.nome}
        </p>
        {cat.descricao && (
          <p
            className="m-0 mt-0.5 truncate text-xs leading-tight"
            style={{ color: active ? "rgba(255,255,255,0.5)" : "var(--color-bl-muted)" }}
          >
            {cat.descricao}
          </p>
        )}
      </div>
      <ChevronRight
        size={13}
        className="shrink-0"
        style={{ color: active ? "var(--color-bl-accent)" : "var(--color-bl-muted)" }}
      />
    </button>
  );
}

// ─── mobile category chip ────────────────────────────────────────────────────

function MobileChip({
  cat,
  active,
  onClick,
}: {
  cat: CategoriaServico;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = getIconByName(cat.icone);
  return (
    <button
      onClick={onClick}
      className="flex min-w-24 max-w-[110px] shrink-0 flex-col items-start gap-2.5 rounded-[14px] border p-3 transition-colors"
      style={
        active
          ? { background: "var(--color-bl-ink)", borderColor: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }
          : { background: "var(--color-bl-card)", borderColor: "rgba(0,0,0,0.08)", color: "var(--color-bl-ink)" }
      }
    >
      {Icon && createElement(Icon, { size: 20 })}
      <span className="bl-display text-[13.5px] leading-[1.15]">{cat.nome}</span>
    </button>
  );
}

// ─── service resource card ────────────────────────────────────────────────────

function ResourceCard({ item, onOpen }: { item: Servico; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir detalhes de ${item.nome}`}
      className="group flex min-h-[168px] flex-col rounded-xl p-4 text-left transition-colors hover:shadow-sm"
      style={{
        background: "var(--color-bl-bg)",
        border: "1px solid rgba(0,0,0,0.08)",
        color: "var(--color-bl-ink)",
      }}
    >
      {item.descricao_curta && (
        <span
          className="mb-2 text-[10.5px] font-semibold uppercase leading-tight tracking-[0.22em]"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {item.descricao_curta}
        </span>
      )}
      <span
        className="bl-display mb-1.5 text-[17px] font-medium leading-tight"
        style={{ color: "var(--color-bl-ink)" }}
      >
        {item.nome}
      </span>
      {item.descricao && (
        <span
          className="mb-auto line-clamp-3 text-[12.5px] leading-relaxed"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {item.descricao}
        </span>
      )}

      {/* footer */}
      <div className="mt-3 flex items-center justify-between gap-2.5">
        {item.bairro ? (
          <span
            className="inline-flex min-w-0 items-center gap-1 truncate text-[11.5px]"
            style={{ color: "var(--color-bl-ink)" }}
          >
            <MapPin size={11} className="shrink-0" /> {item.bairro}
          </span>
        ) : (
          <span />
        )}
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors group-hover:[background:var(--color-bl-ink)] group-hover:[color:var(--color-bl-bg)] group-hover:[border-color:var(--color-bl-ink)]"
          style={{
            background: "var(--color-bl-card)",
            color: "var(--color-bl-ink)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          Mais detalhes
          <ChevronRight size={11} />
        </span>
      </div>
    </button>
  );
}

// ─── content panel (shared desktop/mobile) ────────────────────────────────────

function ContentPanel({
  category,
  items,
  isLoading,
  onOpenService,
}: {
  category: CategoriaServico | undefined;
  items: Servico[] | undefined;
  isLoading: boolean;
  onOpenService: (s: Servico) => void;
}) {
  const { t } = useTranslation();

  if (!category) {
    return (
      <div className="rounded-[18px] border" style={{ background: "var(--color-bl-card)", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="grid grid-cols-2 gap-3 p-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const Icon = getIconByName(category.icone);

  return (
    <section
      className="overflow-hidden rounded-[18px]"
      style={{ border: "1px solid rgba(0,0,0,0.08)", background: "var(--color-bl-card)" }}
    >
      {/* dark cover header */}
      <div
        className="flex items-center justify-between gap-4 px-6 py-5 max-sm:px-4 max-sm:py-4"
        style={{ background: "var(--color-bl-ink)" }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl max-sm:h-10 max-sm:w-10"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-bl-bg)" }}
          >
            {Icon && createElement(Icon, { size: 22 })}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              className="bl-display m-0 leading-none max-sm:text-2xl"
              style={{
                fontSize: "clamp(1.375rem, 2.6vw, 1.75rem)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "var(--color-bl-bg)",
              }}
            >
              {category.nome}
            </h2>
            {category.descricao && (
              <p
                className="m-0 mt-1 text-[13px] leading-snug"
                style={{ color: "rgba(242,234,220,0.6)" }}
              >
                {category.descricao}
              </p>
            )}
          </div>
        </div>

        {!isLoading && (items?.length ?? 0) > 0 && (
          <div className="hidden shrink-0 text-right max-sm:hidden sm:block">
            <div
              className="bl-display text-[22px] italic leading-none"
              style={{ color: "#F4B89F", fontWeight: 400, letterSpacing: 0 }}
            >
              {String(items?.length ?? 0).padStart(2, "0")}
            </div>
            <span
              className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgba(242,234,220,0.6)" }}
            >
              {items?.length === 1 ? "contato útil" : "contatos úteis"}
            </span>
          </div>
        )}
      </div>

      {/* resource grid */}
      <div className="px-8 py-7 max-sm:px-5 max-sm:py-5">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : !items?.length ? (
          <p className="py-8 text-center text-sm" style={{ color: "var(--color-bl-muted)" }}>
            {t("services.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <ResourceCard key={item.id} item={item} onOpen={() => onOpenService(item)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ServiceList() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");
  const [openService, setOpenService] = useState<Servico | null>(null);
  const { data: categories, isLoading: loadingCats } = useServiceCategories("servicos");

  // Default to first category until user picks one — derivado, sem useEffect
  const activeSlug = selected || categories?.[0]?.slug || "";
  const { data: items, isLoading: loadingItems } = useServices("servicos", activeSlug);
  const selectedCategory = categories?.find((c) => c.slug === activeSlug);

  function pickCategory(slug: string) {
    setSelected(slug);
    setOpenService(null);
  }

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-7xl px-14 py-12 max-md:px-6 max-md:py-8">
        <PageHeader title={t("services.title")} subtitle={t("services.subtitle")} />

        {/* ── mobile: horizontal chip rail ──────────────────────── */}
        <section className="mt-6 md:hidden">
          <div
            className="flex gap-2.5 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {loadingCats
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-24 shrink-0 rounded-[14px]" />
                ))
              : categories?.map((cat) => (
                  <MobileChip
                    key={cat.id}
                    cat={cat}
                    active={cat.slug === activeSlug}
                    onClick={() => pickCategory(cat.slug)}
                  />
                ))}
          </div>
          <div className="mt-3">
            <ContentPanel
              category={selectedCategory}
              items={items}
              isLoading={loadingItems}
              onOpenService={setOpenService}
            />
          </div>
        </section>

        {/* ── desktop: sidebar + content panel ─────────────────── */}
        <div
          className="mt-8 hidden gap-6 md:grid"
          style={{ gridTemplateColumns: "300px 1fr" }}
        >
          <aside
            className="self-start rounded-[18px] p-3.5"
            style={{ background: "var(--color-bl-card)", border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div
              className="mb-2.5 flex items-center justify-between px-3.5 pb-3.5"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--color-bl-muted)" }}
              >
                Categorias
              </span>
              <span className="bl-display text-sm italic" style={{ color: "var(--color-bl-accent)" }}>
                {loadingCats ? "…" : `${categories?.length ?? 0} serviços`}
              </span>
            </div>
            <div className="space-y-0.5">
              {loadingCats
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-[10px]" />
                  ))
                : categories?.map((cat) => (
                    <CatItem
                      key={cat.id}
                      cat={cat}
                      active={cat.slug === selected}
                      onClick={() => setSelected(cat.slug)}
                    />
                  ))}
            </div>
          </aside>

          <ContentPanel
            category={selectedCategory}
            items={items}
            isLoading={loadingItems}
            onOpenService={setOpenService}
          />
        </div>
      </div>

      <ServiceModal
        service={openService}
        category={selectedCategory}
        onClose={() => setOpenService(null)}
      />
    </div>
  );
}
