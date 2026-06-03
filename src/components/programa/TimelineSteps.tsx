import type { LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

type Props = {
  steps: Step[];
};

export function TimelineSteps({ steps }: Props) {
  return (
    <ol
      className="relative m-0 flex list-none flex-col gap-8 p-0 md:grid md:gap-4"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {/* dashed connector — desktop horizontal */}
      <span
        aria-hidden
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: 30,
          left: `calc(100% / ${steps.length * 2})`,
          right: `calc(100% / ${steps.length * 2})`,
          borderTop: "1.5px dashed var(--color-bl-prog-line)",
        }}
      />

      {steps.map((step, i) => {
        const Icon = step.icon;
        const num = i + 1;
        return (
          <li
            key={i}
            className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-3 md:text-center"
          >
            {/* dashed connector — mobile vertical */}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[29px] top-[60px] h-[calc(100%+2rem-60px)] w-0 border-l border-dashed md:hidden"
                style={{ borderColor: "var(--color-bl-prog-line)" }}
              />
            )}

            <div className="relative shrink-0">
              <span
                className="relative grid h-[60px] w-[60px] place-items-center rounded-full"
                style={{ background: "var(--color-bl-prog-soft)", color: "var(--color-bl-prog-ink)" }}
              >
                <Icon size={24} />
              </span>
              <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold"
                style={{
                  background: "var(--color-bl-prog-card)",
                  color: "var(--color-bl-prog-ink)",
                  border: "1px solid var(--color-bl-prog-line)",
                }}
              >
                {num}
              </span>
            </div>

            <div className="min-w-0 flex-1 pt-1 md:pt-4">
              <p
                className="bl-prog-display m-0 text-[14px] font-bold leading-tight"
                style={{ color: "var(--color-bl-prog-ink)" }}
              >
                {step.title}
              </p>
              {step.description && (
                <p
                  className="m-0 mt-1.5 text-[12.5px] leading-snug"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
