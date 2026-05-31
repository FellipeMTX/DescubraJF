import {
  Beer,
  Calendar,
  MapPin,
  Truck,
  Music2,
  Users,
  Utensils,
  ShoppingBag,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProgramaLayout } from "./ProgramaLayout";
import { ProgramHero } from "@/components/programa/ProgramHero";
import { HighlightsBar } from "@/components/programa/HighlightsBar";
import { TextWithSide } from "@/components/programa/TextWithSide";
import { IconCardGrid } from "@/components/programa/IconCardGrid";
import { PlaceCards } from "@/components/programa/PlaceCards";
import { BottomCTAStrip } from "@/components/programa/BottomCTAStrip";
import { SectionTitle } from "@/components/programa/SectionTitle";

type ItemText = { title: string; description: string };

const HIGHLIGHT_ICONS: LucideIcon[] = [Beer, Truck, Music2, Users];
const ENCONTRA_ICONS: LucideIcon[] = [Beer, Truck, Utensils, Music2, ShoppingBag];

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center text-center text-[13px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: "var(--color-bl-prog-muted)" }}
    >
      {label}
    </div>
  );
}

export default function PracaCervejeira() {
  const { t } = useTranslation();
  const ns = "programas.pracaCervejeira";

  const highlights = t(`${ns}.highlights`, { returnObjects: true }) as ItemText[];
  const aboutParagraphs = t(`${ns}.about.paragraphs`, { returnObjects: true }) as string[];
  const encontraItems = t(`${ns}.encontra.items`, { returnObjects: true }) as ItemText[];
  const ondeItems = t(`${ns}.onde.items`, { returnObjects: true }) as ItemText[];

  return (
    <ProgramaLayout>
      <ProgramHero
        title={t(`${ns}.title`)}
        description={t(`${ns}.description`)}
        meta={[
          { icon: Calendar, label: t(`${ns}.meta.since`) },
          { icon: MapPin, label: t(`${ns}.meta.location`) },
        ]}
        primaryCta={{ label: t("programas.common.wantParticipate"), icon: UserPlus, href: "#participar" }}
        secondaryCta={{ label: t("programas.common.nextEditions"), icon: Calendar, href: "#edicoes" }}
        image={<ImagePlaceholder label="imagem · praça cervejeira" />}
      />

      <HighlightsBar
        items={highlights.map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i] }))}
      />

      <TextWithSide
        title={t(`${ns}.about.title`)}
        paragraphs={aboutParagraphs}
        side={<ImagePlaceholder label="imagem · evento" />}
      />

      <section>
        <SectionTitle title={t(`${ns}.encontra.title`)} className="mb-6" />
        <IconCardGrid
          columns={5}
          items={encontraItems.map((it, i) => ({ ...it, icon: ENCONTRA_ICONS[i] }))}
        />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.onde.title`)} className="mb-6" />
        <PlaceCards
          columns={5}
          items={ondeItems.map((it, i) => ({
            ...it,
            image: <ImagePlaceholder label={`local ${i + 1}`} />,
          }))}
          extra={
            <article
              className="flex flex-col justify-between rounded-[14px] p-5"
              style={{
                background: "var(--color-bl-prog-card)",
                border: "1px solid var(--color-bl-prog-line)",
              }}
            >
              <div>
                <Calendar
                  size={22}
                  style={{ color: "var(--color-bl-prog-accent)" }}
                  className="mb-3"
                />
                <p
                  className="bl-prog-display m-0 text-[15px] font-bold leading-tight"
                  style={{ color: "var(--color-bl-prog-ink)" }}
                >
                  {t(`${ns}.onde.extra.title`)}
                </p>
                <p
                  className="m-0 mt-1.5 text-[12.5px] leading-snug"
                  style={{ color: "var(--color-bl-prog-muted)" }}
                >
                  {t(`${ns}.onde.extra.description`)}
                </p>
              </div>
              <a
                href="#edicoes"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-[12px] font-semibold no-underline"
                style={{ background: "var(--color-bl-prog-cta-bg)", color: "#fff" }}
              >
                {t(`${ns}.onde.extra.button`)}
              </a>
            </article>
          }
        />
      </section>

      <BottomCTAStrip
        title={t(`${ns}.bottom.title`)}
        description={t(`${ns}.bottom.description`)}
        primaryCta={{ label: t("programas.common.wantParticipate"), icon: UserPlus, href: "#participar" }}
        secondaryCta={{ label: t("programas.common.nextEditions"), icon: Calendar, href: "#edicoes" }}
        watermark={
          <TrendingUp size={120} strokeWidth={0.6} aria-hidden style={{ opacity: 0.4 }} />
        }
      />
    </ProgramaLayout>
  );
}
