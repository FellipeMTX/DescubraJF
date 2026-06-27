import type { ReactNode } from "react";
import { SectionTitle } from "./SectionTitle";

type Props = {
  title: string;
  paragraphs: string[];
  side: ReactNode;
  /** Default: text esquerda, side direita. Use "left" para inverter. */
  sidePosition?: "left" | "right";
};

export function TextWithSide({ title, paragraphs, side, sidePosition = "right" }: Props) {
  const textBlock = (
    <div className="flex flex-col">
      <SectionTitle title={title} className="mb-6" />
      <div className="flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="m-0 text-justify text-[14.5px] leading-[1.65]"
            style={{ color: "var(--color-bl-prog-ink)" }}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );

  const sideBlock = (
    <div
      className="overflow-hidden rounded-[16px]"
      style={{ background: "var(--color-bl-prog-soft)" }}
    >
      {side}
    </div>
  );

  return (
    <section className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
      {sidePosition === "left" ? sideBlock : textBlock}
      {sidePosition === "left" ? textBlock : sideBlock}
    </section>
  );
}
