export const SITE_NAME = "Descubra Juiz de Fora";
export const SITE_DESCRIPTION =
  "Portal turístico oficial de Juiz de Fora. Descubra atrativos, roteiros, gastronomia e hospedagens.";

export const NAV_ITEMS = [
  { label: "História", href: "/juiz-de-fora/historia" },
  {
    label: "O que Fazer",
    children: [
      { label: "Atrativos", href: "/atrativos" },
      { label: "Roteiros", href: "/roteiros" },
      { label: "Agenda", href: "/agenda" },
      { label: "Passeios", href: "/passeios" },
    ],
  },
  { label: "Onde Comer e Beber", href: "/onde-comer" },
  { label: "Onde Ficar", href: "/onde-ficar" },
  { label: "Serviços", href: "/servicos" },
  {
    label: "Secretaria de Turismo",
    children: [
      { label: "Institucional", href: "/secretaria/institucional" },
      { label: "Programas e Projetos", href: "/secretaria/programas-e-projetos" },
      { label: "Notícias", href: "/secretaria/noticias" },
      { label: "Contato", href: "/contato" },
    ],
  },
] as const;

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
  twitter: "#",
} as const;
