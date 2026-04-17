export const SITE_NAME = "Descubra Juiz de Fora";
export const SITE_DESCRIPTION =
  "Portal turístico oficial de Juiz de Fora. Descubra atrativos, roteiros, gastronomia e hospedagens.";

export const NAV_ITEMS = [
  { label: "nav.history", href: "/juiz-de-fora/historia" },
  {
    label: "nav.whatToDo",
    children: [
      { label: "nav.attractions", href: "/atrativos" },
      { label: "nav.routes", href: "/roteiros" },
      { label: "nav.events", href: "/agenda" },
      { label: "nav.tours", href: "/passeios" },
    ],
  },
  { label: "nav.whereToEat", href: "/onde-comer" },
  { label: "nav.whereToStay", href: "/onde-ficar" },
  { label: "nav.services", href: "/servicos" },
  {
    label: "nav.tourismDept",
    children: [
      { label: "nav.institutional", href: "/secretaria/institucional" },
      { label: "nav.programs", href: "/secretaria/programas-e-projetos" },
      { label: "nav.news", href: "/secretaria/noticias" },
      { label: "nav.christmas", href: "/secretaria/natal" },
      { label: "nav.contact", href: "/contato" },
    ],
  },
] as const;

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
  twitter: "#",
} as const;
