import { createElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { getIconByName } from "@/components/ui/IconPicker";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceCategories, useServices } from "@/hooks/useServices";
import type { CategoriaServico, Servico } from "@/types/database";
import { ServiceModal } from "./ServiceModal";

// ─── Tokens do design (cream-2 = bl-card, cream-4 = inline #F7F1E6) ──────────

const PANEL_BG = "#F7F1E6"; // cream-4 (mais claro que --color-bl-bg)
const LINE = "rgba(0,0,0,0.08)";

// ─── Page head (h1 esquerda, subtitulo direita alinhado a direita) ───────────

function PageHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:gap-10">
      <h1
        className="bl-display m-0 leading-none"
        style={{
          fontSize: "clamp(40px, 7vw, 76px)",
          fontWeight: 400,
          letterSpacing: "-0.015em",
          color: "var(--color-bl-ink)",
        }}
      >
        {title}
      </h1>
      <p
        className="m-0 max-w-[320px] text-right text-[14px] leading-snug max-md:text-left"
        style={{ color: "var(--color-bl-ink)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ─── Sidebar item ────────────────────────────────────────────────────────────

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
      className="flex w-full cursor-pointer items-center gap-3.5 rounded-[10px] border-0 px-3 py-3 text-left transition-colors"
      style={{
        background: active ? "var(--color-bl-ink)" : "transparent",
        color: active ? "#fff" : "var(--color-bl-ink)",
      }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
        style={
          active
            ? { background: "rgba(255,255,255,0.08)", color: "#fff" }
            : { background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }
        }
      >
        {Icon && createElement(Icon, { size: 18 })}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="bl-display m-0 truncate text-[16px] leading-tight"
          style={{ fontWeight: 500 }}
        >
          {cat.nome}
        </p>
        {cat.descricao && (
          <p
            className="m-0 mt-0.5 truncate text-[12px] leading-snug"
            style={{ color: active ? "rgba(242,234,220,0.6)" : "var(--color-bl-muted)" }}
          >
            {cat.descricao}
          </p>
        )}
      </div>
      <span
        aria-hidden
        className="block h-1.75 w-1.75 shrink-0 rotate-45"
        style={{
          borderRight: `1.5px solid ${active ? "var(--color-bl-accent)" : "var(--color-bl-muted)"}`,
          borderTop: `1.5px solid ${active ? "var(--color-bl-accent)" : "var(--color-bl-muted)"}`,
          marginRight: 6,
        }}
      />
    </button>
  );
}

// ─── Mobile chip ─────────────────────────────────────────────────────────────

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
      className="flex min-w-24 max-w-30 shrink-0 flex-col items-start gap-2.5 rounded-[14px] border p-3 transition-colors"
      style={
        active
          ? {
              background: "var(--color-bl-ink)",
              borderColor: "var(--color-bl-ink)",
              color: "#fff",
            }
          : { background: PANEL_BG, borderColor: LINE, color: "var(--color-bl-ink)" }
      }
    >
      {Icon && createElement(Icon, { size: 18 })}
      <span className="bl-display text-[13.5px] font-medium leading-[1.15]">{cat.nome}</span>
    </button>
  );
}

// ─── Resource card ───────────────────────────────────────────────────────────

function ServiceCard({ item, onOpen }: { item: Servico; onOpen: () => void }) {
  const eyebrow = item.descricao_curta ?? item.categoria?.nome ?? "";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir detalhes de ${item.nome}`}
      className="group flex min-h-42 cursor-pointer flex-col rounded-xl border p-4.5 text-left transition-colors"
      style={{
        background: "var(--color-bl-bg)",
        borderColor: LINE,
        color: "var(--color-bl-ink)",
      }}
    >
      {eyebrow && (
        <span
          className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {eyebrow}
        </span>
      )}
      <span
        className="bl-display mb-1.5 text-[18px] font-medium leading-[1.15]"
        style={{ color: "var(--color-bl-ink)" }}
      >
        {item.nome}
      </span>
      {item.descricao && (
        <span
          className="mb-auto line-clamp-3 text-[13px] leading-relaxed"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {item.descricao}
        </span>
      )}

      <div className="mt-3.5 flex items-center justify-between gap-2.5">
        <span
          className="inline-flex items-center gap-1.5 text-[11.5px]"
          style={{ color: "var(--color-bl-ink)" }}
        >
          <b className="bl-display font-medium" style={{ color: "var(--color-bl-ink)" }}>
            1
          </b>{" "}
          local
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 pl-3 text-[12px] font-semibold transition-colors group-hover:border-bl-ink group-hover:bg-bl-ink group-hover:text-white"
          style={{
            background: "var(--color-bl-card)",
            borderColor: LINE,
            color: "var(--color-bl-ink)",
          }}
        >
          Mais detalhes
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rotate-45"
            style={{
              borderRight: "1.5px solid currentColor",
              borderTop: "1.5px solid currentColor",
            }}
          />
        </span>
      </div>
    </button>
  );
}

// ─── Content panel (cover + cbody) ───────────────────────────────────────────

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
      <section
        className="overflow-hidden rounded-[18px] border"
        style={{ background: PANEL_BG, borderColor: LINE }}
      >
        <div className="grid gap-3 p-8.5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-42 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  const Icon = getIconByName(category.icone);
  const count = items?.length ?? 0;

  return (
    <section
      className="overflow-hidden rounded-[18px] border"
      style={{ background: PANEL_BG, borderColor: LINE }}
    >
      {/* cover */}
      <div
        className="flex items-center justify-between gap-6 px-8.5 py-7.5 max-md:gap-4 max-md:px-5 max-md:py-5"
        style={{ background: "var(--color-bl-ink)" }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4.5 max-md:gap-3">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-[16px] max-md:h-12 max-md:w-12 max-md:rounded-[12px]"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
          >
            {Icon && createElement(Icon, { size: 28 })}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              className="bl-display m-0 leading-none"
              style={{
                fontSize: "clamp(22px, 3.6vw, 38px)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "#fff",
              }}
            >
              {category.nome}
            </h2>
            {category.descricao && (
              <p
                className="m-0 mt-1.5 text-[13.5px] leading-snug max-md:text-[12.5px]"
                style={{ color: "rgba(242,234,220,0.65)" }}
              >
                {category.descricao}
              </p>
            )}
          </div>
        </div>

        {!isLoading && count > 0 && (
          <div className="hidden shrink-0 text-right sm:block">
            <div
              className="bl-display leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.5vw, 28px)",
                color: "#F4B89F",
                fontWeight: 400,
              }}
            >
              {String(count).padStart(2, "0")}
            </div>
            <span
              className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgba(242,234,220,0.6)" }}
            >
              {count === 1 ? "contato útil" : "contatos úteis"}
            </span>
          </div>
        )}
      </div>

      {/* cbody */}
      <div className="px-8.5 py-8.5 max-md:px-5 max-md:py-5">
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-42 rounded-xl" />
            ))}
          </div>
        ) : !items?.length ? (
          <p className="py-8 text-center text-sm" style={{ color: "var(--color-bl-muted)" }}>
            {t("services.empty")}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <ServiceCard key={item.id} item={item} onOpen={() => onOpenService(item)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Página ─────────────────────────────────────────────────────────────────

export default function ServiceList() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");
  const [openService, setOpenService] = useState<Servico | null>(null);
  const { data: categories, isLoading: loadingCats } = useServiceCategories("servicos");

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
        <PageHead title={t("services.title")} subtitle={t("services.subtitle")} />

        {/* ── mobile: chip rail + content panel ────────────────────── */}
        <section className="mt-7 md:hidden">
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

        {/* ── desktop: sidebar + content panel ─────────────────────── */}
        <div
          className="mt-8 hidden gap-6 md:grid"
          style={{ gridTemplateColumns: "340px 1fr" }}
        >
          <aside
            className="self-start rounded-[18px] border p-3.5 sticky top-5"
            style={{ background: PANEL_BG, borderColor: LINE }}
          >
            <div
              className="mb-2.5 flex items-center justify-between px-3.5 pb-3.5"
              style={{ borderBottom: `1px solid ${LINE}` }}
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--color-bl-muted)" }}
              >
                Categorias
              </span>
              <span
                className="bl-display text-[14px] italic"
                style={{ color: "var(--color-bl-accent)", fontFamily: "var(--font-display)" }}
              >
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
                      active={cat.slug === activeSlug}
                      onClick={() => pickCategory(cat.slug)}
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
