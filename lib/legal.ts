export type LegalEntity = {
  name: string;
  brand: string;
  email: string;
  siteUrl: string;
  address: string;
  vat?: string;
};

export function getLegalEntity(): LegalEntity {
  return {
    name:
      process.env.LEGAL_ENTITY_NAME?.trim() ||
      "eNOVA Italia — Evolvia",
    brand: "Iren Corner",
    email:
      process.env.LEGAL_PRIVACY_EMAIL?.trim() ||
      process.env.NOTIFIER_EMAIL?.trim() ||
      "codifiche@gruppoevolvia.it",
    siteUrl:
      process.env.APP_URL?.trim().replace(/\/$/, "") ||
      "https://irencornerita.it",
    address:
      process.env.LEGAL_ENTITY_ADDRESS?.trim() ||
      "Italia",
    vat: process.env.LEGAL_ENTITY_VAT?.trim() || undefined,
  };
}

export const COOKIE_CONSENT_KEY = "iren_cookie_consent";
export const COOKIE_CONSENT_VERSION = "1";

export type CookiePreferences = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  version: string;
  updatedAt: string;
};
