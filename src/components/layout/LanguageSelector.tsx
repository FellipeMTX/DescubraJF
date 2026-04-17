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
      ? "flex cursor-pointer items-center gap-1 rounded-md px-2 py-2 text-sm font-medium uppercase tracking-wider text-white/90 transition-colors hover:bg-white/10 hover:text-white"
      : "flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-50";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("common.selectLanguage")}
        className={triggerClass}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            <Check
              size={14}
              className={cn(
                "text-primary-600",
                lang.code === current.code ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
