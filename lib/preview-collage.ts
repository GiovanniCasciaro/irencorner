export const PREVIEW_SITE_URL =
  process.env.APP_URL?.replace(/\/$/, "") ?? "https://irencornerita.it";

export const PREVIEW_HEADLINE =
  "Energia, processi digitali e supporto dedicato per la tua agenzia";

export const PREVIEW_SUBLINE =
  "Offerte competitive, compensi fino a 115€ a contratto e operatività immediata con IrenForce.";

export const PREVIEW_TILES = [
  {
    label: "Prezzo fisso",
    title: "Sottocasa Special",
    detail: "Luce 0,10 €/kWh · Gas 0,44 €/Smc",
    accent: "#0033a0",
  },
  {
    label: "Compensi",
    title: "Fino a 115€",
    detail: "per ogni contratto attivo 9 mesi",
    accent: "#00b140",
  },
  {
    label: "IrenForce",
    title: "2 minuti",
    detail: "inserimento pratica senza allegati",
    accent: "#ff8200",
  },
  {
    label: "TLC",
    title: "Fibra 18,99 €",
    detail: "anche offerte business e bundle",
    accent: "#da291c",
  },
] as const;

export const IREN_GRADIENT =
  "linear-gradient(90deg, #ffd100 0%, #ff8200 28%, #da291c 52%, #0033a0 76%, #00b140 100%)";
