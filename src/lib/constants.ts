export const SITE_NAME_KEY = "common.siteName";
export const SITE_DESCRIPTION_KEY = "common.siteDescription";

export const NAV_ITEMS = [
  { labelKey: "nav.history", href: "/juiz-de-fora/historia" },
  {
    labelKey: "nav.whatToDo",
    children: [
      { labelKey: "nav.attractions", href: "/atrativos" },
      { labelKey: "nav.routes", href: "/roteiros" },
      { labelKey: "nav.events", href: "/agenda" },
    ],
  },
  { labelKey: "nav.whereToEat", href: "/onde-comer" },
  { labelKey: "nav.whereToStay", href: "/onde-ficar" },
  { labelKey: "nav.services", href: "/servicos" },
  {
    labelKey: "nav.tourismDept",
    children: [
      { labelKey: "nav.institutional", href: "/secretaria/institucional" },
      { labelKey: "nav.programs", href: "/secretaria/programas-e-projetos" },
      { labelKey: "nav.news", href: "/secretaria/noticias" },
    ],
  },
] as const;

export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
  twitter: "#",
} as const;

export const IMAGE_RATIOS = {
  cardLandscape: "4/3",
  cardPortrait: "4/5",
  cardTall: "3/4",
  cardSquare: "1/1",
  postCover: "16/9",
  hero: "21/9",
} as const;

export const IMAGE_RATIOS_NUM = {
  cardLandscape: 4 / 3,
  cardPortrait: 4 / 5,
  cardTall: 3 / 4,
  cardSquare: 1,
  postCover: 16 / 9,
  hero: 21 / 9,
} as const;
