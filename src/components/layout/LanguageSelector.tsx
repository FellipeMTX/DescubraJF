import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "header" | "mobile";
};

export function LanguageSelector({ variant = "header" }: Props) {
  const { i18n, t } = useTranslation();
  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ??
    SUPPORTED_LANGUAGES[0];

  const triggerClass =
    variant === "header"
      ? "bl-btn-soft hidden md:inline-flex px-4! py-2.5! text-[13px]! gap-2!"
      : "flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-black/5";

  const triggerStyle =
    variant === "mobile" ? { color: "var(--color-bl-ink)" } : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("common.selectLanguage")}
        className={triggerClass}
        style={triggerStyle}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-44 overflow-hidden rounded-2xl border border-black/5 p-1.5 shadow-xl bg-bl-bg!"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-black/5! focus:bg-black/5!"
            style={{ color: "var(--color-bl-ink)" }}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            <Check
              size={14}
              style={{ color: "var(--color-bl-accent)" }}
              className={cn(
                lang.code === current.code ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
