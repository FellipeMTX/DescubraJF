import type { RoteiroLayout } from "@/types/database";

export const EMPTY_LAYOUT: RoteiroLayout = {
  hero: {
    eyebrow: "Caminhos pela cidade",
    titulo: "",
    tituloAccent: "",
    subtitulo: "",
    descricao: "",
    ctaPrimaryLabel: "Ver no mapa",
    ctaSecondaryLabel: "",
  },
  stats: [],
  sobre: { titulo: "Sobre o roteiro", paragrafos: [], card: { titulo: "", descricao: "", bullets: [] } },
  destaquesTitulo: "Destaques do roteiro",
  dicas: { titulo: "Dicas para aproveitar melhor", items: [] },
  mapsLink: "",
  bottomCta: { titulo: "", descricao: "", label: "Ver outros roteiros" },
};

export type PontoDraft = {
  /** Chave estável de UI (não persistida). */
  id: string;
  nome: string;
  descricao: string;
  local: string;
  imagem: string | null;
  file: File | null;
};

export const emptyPonto = (): PontoDraft => ({
  id: crypto.randomUUID(),
  nome: "",
  descricao: "",
  local: "",
  imagem: null,
  file: null,
});
