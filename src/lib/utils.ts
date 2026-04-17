import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import i18n from "@/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const LOCALE_MAP: Record<string, string> = {
  pt: "pt-BR",
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
};

function currentLocale(): string {
  return LOCALE_MAP[i18n.language] ?? "pt-BR";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(currentLocale(), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString(currentLocale(), {
    day: "2-digit",
    month: "short",
  });
}

export function toMapItems(
  items: Array<{ id: string; nome: string; latitude?: number | null; longitude?: number | null }>
) {
  return items
    .filter((i) => i.latitude && i.longitude)
    .map((i) => ({ id: i.id, name: i.nome, lat: i.latitude!, lng: i.longitude! }));
}
