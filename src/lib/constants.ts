export const SITE_NAME = "Descubra Juiz de Fora";
export const SITE_DESCRIPTION =
  "Portal turístico oficial de Juiz de Fora. Descubra experiências, roteiros, gastronomia e hospedagens.";

export const NAV_ITEMS = [
  {
    label: "Juiz de Fora",
    children: [
      { label: "História", href: "/juiz-de-fora/historia" },
      { label: "Informações Turísticas", href: "/juiz-de-fora/informacoes" },
      { label: "Como Chegar", href: "/juiz-de-fora/como-chegar" },
      { label: "Assessoria de Imprensa", href: "/juiz-de-fora/imprensa" },
      { label: "Setur - JF", href: "/juiz-de-fora/setur" },
    ],
  },
  {
    label: "O que Fazer",
    children: [
      { label: "Experiências", href: "/experiencias" },
      { label: "Roteiros", href: "/roteiros" },
      { label: "Agenda", href: "/agenda" },
    ],
  },
  { label: "Onde Comer e Beber", href: "/onde-comer" },
  { label: "Onde Ficar", href: "/onde-ficar" },
  { label: "Mapas e Guias", href: "/mapas-e-guias" },
  { label: "Contato", href: "/contato" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
  twitter: "#",
} as const;
