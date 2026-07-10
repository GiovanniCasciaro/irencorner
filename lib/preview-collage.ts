export const PREVIEW_SITE_URL =
  process.env.APP_URL?.replace(/\/$/, "") ?? "https://irencornerita.it";

export const PREVIEW_HEADLINE =
  "Energia, processi digitali e supporto dedicato per la tua agenzia";

export const PREVIEW_SUBLINE =
  "Catalogo Luce, Gas, Fibra e Tech, compensi competitivi e operatività immediata con IrenForce.";

export const PREVIEW_TILES = [
  {
    label: "Catalogo",
    title: "Luce & Gas",
    detail: "offerte low cost sempre a portafoglio",
    accent: "#0033a0",
  },
  {
    label: "Compensi",
    title: "Crescono con te",
    detail: "bonus sui contratti attivi nel tempo",
    accent: "#00b140",
  },
  {
    label: "IrenForce",
    title: "2 minuti",
    detail: "inserimento pratica senza allegati",
    accent: "#ff8200",
  },
  {
    label: "Tech",
    title: "Fibra & bundle",
    detail: "domestico, business e pertinenze",
    accent: "#da291c",
  },
] as const;

export const IREN_GRADIENT =
  "linear-gradient(90deg, #ffd100 0%, #ff8200 28%, #da291c 52%, #0033a0 76%, #00b140 100%)";
