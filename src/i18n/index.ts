import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from "./locales/pt.json";
import es from "./locales/es.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = [
  { code: "pt", label: "PT", name: "Português", flag: "🇧🇷" },
  { code: "es", label: "ES", name: "Español", flag: "🇪🇸" },
  { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptBR },
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: "pt",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "descubrajf-lang",
      lookupCookie: "descubrajf-lang",
    },
  });

export default i18n;
