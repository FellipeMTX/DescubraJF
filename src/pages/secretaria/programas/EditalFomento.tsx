import {
  Calendar,
  Sprout,
  Lightbulb,
  TrendingUp,
  Users,
  Handshake,
  Target,
  FileText,
  CalendarDays,
  Banknote,
  ClipboardList,
  Megaphone,
  Search,
  CheckCircle2,
  Award,
  FileDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProgramaLayout } from "./ProgramaLayout";
import { ProgramHero } from "@/components/programa/ProgramHero";
import { HeroQuoteOverlay } from "@/components/programa/HeroQuoteOverlay";
import { HighlightsBar } from "@/components/programa/HighlightsBar";
import { TextWithSide } from "@/components/programa/TextWithSide";
import { KeyPointsCard } from "@/components/programa/KeyPointsCard";
import { StatsRow } from "@/components/programa/StatsRow";
import { TimelineSteps } from "@/components/programa/TimelineSteps";
import { BottomCTAStrip } from "@/components/programa/BottomCTAStrip";
import { SectionTitle } from "@/components/programa/SectionTitle";

type ItemText = { title: string; description: string };
type StatText = { value: string; label?: string; description?: string };

const HIGHLIGHT_ICONS: LucideIcon[] = [Lightbulb, TrendingUp, Users, Handshake];
const KEYPOINT_ICONS: LucideIcon[] = [Target, Users, CalendarDays, Banknote, ClipboardList];
const STATS_ICONS: LucideIcon[] = [Users, CalendarDays, TrendingUp, Sprout];
const STEP_ICONS: LucideIcon[] = [Megaphone, ClipboardList, Search, CheckCircle2, Award];

export default function EditalFomento() {
  const { t } = useTranslation();
  const ns = "programas.editalFomento";

  const highlights = t(`${ns}.highlights`, { returnObjects: true }) as ItemText[];
  const aboutParagraphs = t(`${ns}.about.paragraphs`, { returnObjects: true }) as string[];
  const keypoints = t(`${ns}.about.keypoints`, { returnObjects: true }) as ItemText[];
  const stats = t(`${ns}.impacto.stats`, { returnObjects: true }) as StatText[];
  const steps = t(`${ns}.funciona.steps`, { returnObjects: true }) as ItemText[];

  return (
    <ProgramaLayout>
      <ProgramHero
        title={t(`${ns}.title`)}
        description={t(`${ns}.description`)}
        meta={[{ icon: Calendar, label: t(`${ns}.meta.date`) }]}
        primaryCta={{ label: t(`${ns}.cta.openEdital`), icon: FileText, href: "#edital" }}
        secondaryCta={{ label: t(`${ns}.cta.schedule`), icon: CalendarDays, href: "#cronograma" }}
        image={
          <div
            className="flex h-full w-full items-center justify-center text-center text-[13px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-bl-prog-muted)" }}
          >
            imagem · setur
          </div>
        }
        quoteOverlay={<HeroQuoteOverlay icon={Sprout} text={t(`${ns}.heroQuote`)} />}
      />

      <HighlightsBar items={highlights.map((h, i) => ({ ...h, icon: HIGHLIGHT_ICONS[i] }))} />

      <TextWithSide
        title={t(`${ns}.about.title`)}
        paragraphs={aboutParagraphs}
        side={
          <KeyPointsCard
            items={keypoints.map((k, i) => ({ ...k, icon: KEYPOINT_ICONS[i] }))}
          />
        }
      />

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
        primaryCta={{ label: t(`${ns}.cta.downloadEdital`), icon: FileDown, href: "#edital" }}
        secondaryCta={{ label: t(`${ns}.cta.viewCalendar`), icon: CalendarDays, href: "#cronograma" }}
        watermark={
          <Sprout size={120} strokeWidth={0.6} aria-hidden style={{ opacity: 0.4 }} />
        }
      />
    </ProgramaLayout>
  );
}
