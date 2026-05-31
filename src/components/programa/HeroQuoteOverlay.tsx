import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  text: string;
};

export function HeroQuoteOverlay({ icon: Icon, text }: Props) {
  return (
    <div
      className="absolute bottom-4 right-4 flex max-w-[260px] items-start gap-2.5 rounded-[12px] p-3.5 shadow-lg md:max-w-[280px]"
      style={{ background: "var(--color-bl-prog-cta-bg)" }}
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
        style={{ background: "rgba(255,255,255,0.1)", color: "var(--color-bl-prog-cta-yellow)" }}
      >
        <Icon size={16} />
      </span>
      <p
        className="m-0 text-[12.5px] leading-snug"
        style={{ color: "#fff" }}
      >
        {text}
      </p>
    </div>
  );
}
