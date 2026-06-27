import {
  Calendar,
  MapPin,
  UserPlus,
  Users,
  Landmark,
  GraduationCap,
  Train,
  Feather,
  FlaskConical,
  ClipboardList,
  Map,
  Footprints,
  BookOpen,
  Heart,
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
import { Gallery } from "@/components/ui/Gallery";

type ItemText = { title: string; description: string };

const HIGHLIGHT_ICONS: LucideIcon[] = [MapPin, Users, Calendar, GraduationCap];
const LOCAIS_ICONS: LucideIcon[] = [Train, Feather, BookOpen, FlaskConical, Landmark];
const STEP_ICONS: LucideIcon[] = [ClipboardList, Map, Footprints, BookOpen, Heart];

const LOCAIS_IMAGES = [
  "/caminhandoHistoria/museu-ferroviario.webp",
  "/caminhandoHistoria/museu-etnologia-indigena.webp",
  "/caminhandoHistoria/memoria-negra.webp",
  "/caminhandoHistoria/centro-de-ciencias.webp",
  "/caminhandoHistoria/memorial-da-republica.webp",
];

const GALERIA_IMAGES = [
  "/caminhandoHistoria/galeria-1.webp",
  "/caminhandoHistoria/galeria-2.webp",
  "/caminhandoHistoria/galeria-3.webp",
  "/caminhandoHistoria/galeria-4.webp",
];

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
          <img
            src="/caminhandoHistoria/hero-grupo-museu.webp"
            alt={t(`${ns}.title`)}
            className="h-full w-full object-cover"
          />
        }
      />

      <HighlightsBar items={highlights.map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i] }))} />

      <TextWithSide
        title={t(`${ns}.about.title`)}
        paragraphs={aboutParagraphs}
        side={
          <img
            src="/caminhandoHistoria/sobre-grupo-guiado.webp"
            alt={t(`${ns}.about.title`)}
            className="block aspect-5/4 w-full object-cover"
          />
        }
      />

      <section>
        <SectionTitle title={t(`${ns}.locais.title`)} className="mb-6" />
        <PlaceCards
          columns={5}
          items={locaisItems.map((it, i) => ({
            ...it,
            icon: LOCAIS_ICONS[i],
            image: (
              <img
                src={LOCAIS_IMAGES[i]}
                alt={it.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ),
          }))}
        />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.funciona.title`)} className="mb-8" />
        <TimelineSteps steps={steps.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }))} />
      </section>

      <section>
        <SectionTitle title={t(`${ns}.galeria.title`)} className="mb-6" />
        <Gallery images={GALERIA_IMAGES} className="md:grid-cols-4" />
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
