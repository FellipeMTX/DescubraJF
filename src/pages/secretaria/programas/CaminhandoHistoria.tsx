import {
  Calendar,
  MapPin,
  UserPlus,
  Users,
  Landmark,
  GraduationCap,
  Factory,
  Church,
  Train,
  ShoppingBasket,
  ClipboardList,
  Map,
  Footprints,
  BookOpen,
  Heart,
  Images,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProgramaLayout } from "./ProgramaLayout";
import { ProgramHero } from "@/components/programa/ProgramHero";
import { HighlightsBar } from "@/components/programa/HighlightsBar";
import { TextWithSide } from "@/components/programa/TextWithSide";
import { PlaceCards } from "@/components/programa/PlaceCards";
import { TimelineSteps } from "@/components/programa/TimelineSteps";
import { BottomCTAStrip } from "@/components/programa/BottomCTAStrip";
import { SectionTitle } from "@/components/programa/SectionTitle";

type ItemText = { title: string; description: string };

const HIGHLIGHT_ICONS: LucideIcon[] = [MapPin, Users, Landmark, GraduationCap];
const LOCAIS_ICONS: LucideIcon[] = [Factory, Church, Landmark, Train, ShoppingBasket];
const STEP_ICONS: LucideIcon[] = [ClipboardList, Map, Footprints, BookOpen, Heart];

function GalleryPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-5/4 w-full items-center justify-center text-center text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={{ background: "var(--color-bl-prog-soft)", color: "var(--color-bl-prog-muted)" }}
    >
      {label}
    </div>
  );
}

export default function CaminhandoHistoria() {
  const { t } = useTranslation();
  const ns = "programas.caminhandoHistoria";

  const highlights = t(`${ns}.highlights`, { returnObjects: true }) as ItemText[];
  const aboutParagraphs = t(`${ns}.about.paragraphs`, { returnObjects: true }) as string[];
  const locaisItems = t(`${ns}.locais.items`, { returnObjects: true }) as ItemText[];
  const steps = t(`${ns}.funciona.steps`, { returnObjects: true }) as ItemText[];

  return (
    <ProgramaLayout>
      <ProgramHero
        title={t(`${ns}.title`)}
        titleColor="var(--color-bl-prog-ink)"
        description={t(`${ns}.description`)}
        meta={[
          { icon: Calendar, label: t(`${ns}.meta.since`) },
          { icon: MapPin, label: t(`${ns}.meta.location`) },
        ]}
        primaryCta={{ label: t("programas.common.wantParticipate"), icon: UserPlus, href: "#participar" }}
        secondaryCta={{ label: t("programas.common.nextRoteiros"), icon: Calendar, href: "#roteiros" }}
        image={
          <div
            className="flex h-full w-full items-center justify-center text-center text-[13px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-bl-prog-muted)" }}
          >
            imagem · museu
          </div>
        }
      />

      <HighlightsBar items={highlights.map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i] }))} />

      <TextWithSide
        title={t(`${ns}.about.title`)}
        paragraphs={aboutParagraphs}
        side={
          <div
            className="flex aspect-5/4 w-full items-center justify-center text-center text-[13px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-bl-prog-muted)" }}
          >
            imagem · grupo guiado
          </div>
        }
      />

      <section>
        <SectionTitle title={t(`${ns}.locais.title`)} className="mb-6" />
        <PlaceCards
          columns={5}
          items={locaisItems.map((it, i) => ({
            ...it,
            icon: LOCAIS_ICONS[i],
            image: <GalleryPlaceholder label={`local ${i + 1}`} />,
          }))}
        />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.funciona.title`)} className="mb-8" />
        <TimelineSteps steps={steps.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }))} />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.galeria.title`)} className="mb-6" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-[12px]"
              style={{
                background: "var(--color-bl-prog-soft)",
                border: "1px solid var(--color-bl-prog-line)",
              }}
            >
              <div
                className="flex h-full w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-bl-prog-muted)" }}
              >
                foto {i + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href="#galeria-completa"
            className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[12.5px] font-semibold no-underline"
            style={{ background: "var(--color-bl-prog-cta-bg)", color: "#fff" }}
          >
            <Images size={14} /> {t(`${ns}.galeria.button`)}
          </a>
        </div>
      </section>

      <BottomCTAStrip
        title={t(`${ns}.bottom.title`)}
        description={t(`${ns}.bottom.description`)}
        primaryCta={{ label: t("programas.common.wantSubscribe"), icon: UserPlus, href: "#participar" }}
        secondaryCta={{ label: t("programas.common.nextRoteiros"), icon: Calendar, href: "#roteiros" }}
        watermark={
          <Landmark size={120} strokeWidth={0.6} aria-hidden style={{ opacity: 0.4 }} />
        }
      />
    </ProgramaLayout>
  );
}
