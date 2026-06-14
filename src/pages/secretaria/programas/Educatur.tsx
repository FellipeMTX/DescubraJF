import {
  Calendar,
  MapPin,
  UserPlus,
  Users,
  BookOpen,
  Heart,
  Train,
  Landmark,
  Trees,
  Drama,
  Camera,
  ShoppingBasket,
  Leaf,
  Building2,
  ClipboardList,
  Footprints,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProgramaLayout } from "./ProgramaLayout";
import { ProgramHero } from "@/components/programa/ProgramHero";
import { HighlightsBar } from "@/components/programa/HighlightsBar";
import { TextWithSide } from "@/components/programa/TextWithSide";
import { PlaceCards } from "@/components/programa/PlaceCards";
import { StatsRow } from "@/components/programa/StatsRow";
import { TimelineSteps } from "@/components/programa/TimelineSteps";
import { BottomCTAStrip } from "@/components/programa/BottomCTAStrip";
import { SectionTitle } from "@/components/programa/SectionTitle";

type ItemText = { title: string; description: string };
type StatText = { value: string; label?: string; description?: string };

const HIGHLIGHT_ICONS: LucideIcon[] = [MapPin, Users, BookOpen, Heart];
const ATRATIVOS_ICONS: LucideIcon[] = [Train, Landmark, Trees, Drama, Camera, ShoppingBasket, Leaf];
const STATS_ICONS: LucideIcon[] = [Users, Building2, Users, MapPin];
const STEP_ICONS: LucideIcon[] = [ClipboardList, Footprints, BookOpen, Sparkles];

const ATRATIVOS_IMAGES = [
  "/educatur/atrativos/estacao-ferroviaria.webp",
  "/educatur/atrativos/museu-mariano-procopio.webp",
  "/educatur/atrativos/parque-da-lajinha.webp",
  "/educatur/atrativos/cine-theatro-central.webp",
  "/educatur/atrativos/morro-do-imperador.webp",
  "/educatur/atrativos/mercado-municipal.webp",
  "/educatur/atrativos/parque-halfeld.webp",
];

export default function Educatur() {
  const { t } = useTranslation();
  const ns = "programas.educatur";

  const highlights = t(`${ns}.highlights`, { returnObjects: true }) as ItemText[];
  const aboutParagraphs = t(`${ns}.about.paragraphs`, { returnObjects: true }) as string[];
  const atrativos = t(`${ns}.atrativos.items`, { returnObjects: true }) as ItemText[];
  const stats = t(`${ns}.impacto.stats`, { returnObjects: true }) as StatText[];
  const steps = t(`${ns}.funciona.steps`, { returnObjects: true }) as ItemText[];

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
        secondaryCta={{ label: t("programas.common.nextRoteiros"), icon: Calendar, href: "#roteiros" }}
        image={
          <img
            src="/educatur/educatur-hero.webp"
            alt={t(`${ns}.title`)}
            className="h-full w-full bg-white object-contain p-8"
          />
        }
      />

      <HighlightsBar items={highlights.map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i] }))} />

      <TextWithSide
        title={t(`${ns}.about.title`)}
        paragraphs={aboutParagraphs}
        side={
          <img
            src="/educatur/alunos-em-visita.webp"
            alt={t(`${ns}.about.title`)}
            className="block aspect-5/4 w-full object-cover"
          />
        }
      />

      <section>
        <SectionTitle title={t(`${ns}.atrativos.title`)} className="mb-6" />
        <PlaceCards
          columns={4}
          items={atrativos.map((it, i) => ({
            ...it,
            icon: ATRATIVOS_ICONS[i],
            image: (
              <img
                src={ATRATIVOS_IMAGES[i]}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ),
          }))}
        />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.impacto.title`)} className="mb-6" />
        <StatsRow items={stats.map((s, i) => ({ ...s, icon: STATS_ICONS[i] }))} />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.funciona.title`)} className="mb-8" />
        <TimelineSteps steps={steps.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }))} />
      </section>

      <BottomCTAStrip
        title={t(`${ns}.bottom.title`)}
        description={t(`${ns}.bottom.description`)}
        primaryCta={{ label: t("programas.common.wantParticipate"), icon: UserPlus, href: "#participar" }}
        secondaryCta={{ label: t("programas.common.nextRoteiros"), icon: Calendar, href: "#roteiros" }}
        watermark={
          <BookOpen size={120} strokeWidth={0.6} aria-hidden style={{ opacity: 0.4 }} />
        }
      />
    </ProgramaLayout>
  );
}
