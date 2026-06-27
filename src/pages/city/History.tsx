import type { ReactNode } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Compass } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const TIMELINE_YEARS = [
  "1703", "1853", "1856", "1857", "1861", "1865", "1890",
  "1907", "1915", "1929", "1934", "1977", "2023",
] as const;

const TIMELINE_IMAGES: Record<string, string | undefined> = {
  "1703": "/historia/Linha%20do%20tempo_%201703.jpg",
  "1853": "/historia/Linha%20do%20tempo%20-1853.jpg",
  "1856": "/historia/Linha%20do%20tempo_%201856.jpg",
  "1857": "/historia/Linha%20do%20tempo_%201857.jpg",
  "1861": "/historia/Linha%20do%20tempo_%201861.jpg",
  "1865": "/historia/Linha%20do%20tempo_%201865.jpg",
  "1890": "/historia/Linha%20do%20tempo_%201890.jpg",
  "1907": "/historia/Linha%20do%20tempo_%201907.jpg",
  "1915": "/historia/Linha%20do%20tempo_%201915.jpg",
  "1929": "/historia/Linha%20do%20tempo_%201929.jpg",
  "1934": "/historia/Linha%20do%20tempo_%201934.jpg",
  "1977": "/historia/Linha%20do%20tempo_%201977.jpg",
  "2023": "/historia/Linha%20do%20tempo_%202023.jpg",
};

export default function History() {
  const { t } = useTranslation();
  return (
    <div className="bl-app">
      <HistHero />
      <HistIntro />
      <HistPullQuote />
      <HistTimeline />
      <HistStorySection
        kicker="01."
        eyebrow={t("history.origins.kicker")}
        title={
          <>
            {t("history.origins.titleBefore")} <span className="bl-em">{t("history.origins.titleHighlight")}</span>
            {t("history.origins.titleAfter")}
          </>
        }
        image="/historia/HotelAvenida-02.webp"
        imageCaption={t("history.origins.imageCaption")}
      >
        <p>{t("history.origins.p1")}</p>
        <p>{t("history.origins.p2")}</p>
        <p>{t("history.origins.p3")}</p>
      </HistStorySection>
      <HistStorySection
        reverse
        background="var(--color-bl-card)"
        kicker="02."
        eyebrow={t("history.immigration.kicker")}
        title={
          <>
            {t("history.immigration.titleBefore")} <span className="bl-em">{t("history.immigration.titleHighlight")}</span>
          </>
        }
        image="/historia/Chegada-imigrantes-03.webp"
        imageCaption={t("history.immigration.imageCaption")}
      >
        <p>{t("history.immigration.p1")}</p>
        <p>{t("history.immigration.p2")}</p>
      </HistStorySection>
      <HistManchester />
      <HistStorySection
        reverse
        background="var(--color-bl-card)"
        kicker="04."
        eyebrow={t("history.architecture.kicker")}
        title={
          <>
            {t("history.architecture.titleBefore")} <span className="bl-em">{t("history.architecture.titleHighlight")}</span>{" "}
            {t("history.architecture.titleAfter")}
          </>
        }
        image="/historia/arq-07.webp"
        imageCaption={t("history.architecture.imageCaption")}
      >
        <p>{t("history.architecture.p1")}</p>
        <p>{t("history.architecture.p2")}</p>
        <p>{t("history.architecture.p3")}</p>
      </HistStorySection>
      <HistSurprise />
    </div>
  );
}

function HistHero() {
  const { t } = useTranslation();
  return (
    <section className="px-6 pt-10 pb-16">
      <div
        className="bl-card relative h-[78vh] min-h-[560px] overflow-hidden"
        style={{ borderRadius: 28, cursor: "default" }}
      >
        <img src="/historia/Foto%202.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-[clamp(32px,5vw,64px)] text-white">
          <div
            className="bl-kicker mb-6 self-start"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              color: "white",
            }}
          >
            <span className="dot" style={{ background: "var(--color-bl-accent2)" }} />
            {t("history.chapter")}
          </div>
          <h1
            className="bl-display m-0 mb-4"
            style={{
              fontSize: "clamp(64px, 9vw, 156px)",
              color: "white",
              lineHeight: 0.95,
            }}
          >
            {t("history.hero.title")}
          </h1>
          <p
            className="m-0 italic"
            style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              opacity: 0.92,
              maxWidth: 620,
              lineHeight: 1.55,
              fontFamily: "var(--font-display)",
            }}
          >
            {t("history.hero.subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}

function HistIntro() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.12);
  return (
    <section className="relative overflow-hidden px-14 pt-6 pb-24">
      <div
        className="bl-blob bl-float"
        style={{
          width: 360,
          height: 360,
          background: "var(--color-bl-accent2)",
          top: 40,
          right: -120,
        }}
      />
      <div
        ref={ref}
        className={cn(
          "reveal relative z-10 mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.1fr_1fr]",
          isVisible && "in"
        )}
      >
        <div>
          <div className="bl-kicker mb-7">
            <span className="bl-num">— </span> {t("history.intro.kicker")}
          </div>
          <p
            className="m-0 mb-7"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 2.8vw, 40px)",
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
            }}
          >
            {t("history.intro.mainBefore")} <span className="bl-em">{t("history.intro.mainHighlight")}</span>
          </p>
          <p className="mb-4 text-justify text-base leading-[1.7]" style={{ color: "var(--color-bl-muted)" }}>
            {t("history.intro.p1")}
          </p>
          <p className="mb-4 text-justify text-base leading-[1.7]" style={{ color: "var(--color-bl-muted)" }}>
            {t("history.intro.p2")}
          </p>
          <p className="text-justify text-base leading-[1.7]" style={{ color: "var(--color-bl-muted)" }}>
            {t("history.intro.p3")}
          </p>
        </div>
        <figure className="m-0">
          <div
            className="bl-card relative aspect-4/5"
            style={{ maxHeight: 580, cursor: "default" }}
          >
            <img
              src="/historia/PacoMunicipal-01.webp"
              alt={t("history.intro.palaceAlt")}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption
            className="mt-3 text-right text-xs italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("history.intro.palaceCaption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function HistPullQuote() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.12);
  return (
    <section className="px-14 py-6">
      <div
        ref={ref}
        className={cn("reveal mx-auto max-w-[980px] text-center", isVisible && "in")}
      >
        <div className="bl-kicker mb-7">
          <span className="dot" /> {t("history.quote.kicker")}
        </div>
        <p
          className="bl-display m-0 mb-7"
          style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.22 }}
        >
          {t("history.quote.mainBefore")} <span className="bl-em">{t("history.quote.mainHighlight")}</span> {t("history.quote.mainAfter")}
        </p>
        <p
          className="mx-auto mb-4 max-w-[720px] text-base leading-[1.7]"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {t("history.quote.places")}
        </p>
        <p
          className="m-0 italic"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--color-bl-accent)",
          }}
        >
          {t("history.quote.conclusion")}
        </p>
      </div>
    </section>
  );
}

function HistTimeline() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <section
      className="relative overflow-hidden px-14 py-24"
      style={{ background: "var(--color-bl-card)" }}
    >
      <div
        className="bl-blob bl-float"
        style={{
          width: 320,
          height: 320,
          background: "var(--color-bl-accent)",
          top: -80,
          left: "20%",
          opacity: 0.28,
        }}
      />
      <div
        ref={ref}
        className={cn("reveal relative z-10 mx-auto max-w-7xl", isVisible && "in")}
      >
        <div className="mb-16 grid items-end gap-10 md:grid-cols-2">
          <div>
            <div
              className="bl-kicker mb-5"
              style={{ background: "var(--color-bl-bg)" }}
            >
              <span className="bl-num">— </span> {t("history.timeline.kicker")}
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              {t("history.timeline.title")} <span className="bl-em">{t("history.timeline.titleHighlight")}</span>
            </h2>
          </div>
          <p
            className="m-0 text-base leading-[1.7]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {t("history.timeline.description")}
          </p>
        </div>

        <div className="hist-tl">
          <div className="hist-tl-line" />
          {TIMELINE_YEARS.map((year, i) => (
            <TimelineItem
              key={year}
              year={year}
              text={t(`history.timeline.events.${year}.text`)}
              image={TIMELINE_IMAGES[year]}
              imageLabel={t(`history.timeline.events.${year}.imageLabel`)}
              side={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  year,
  text,
  image,
  imageLabel,
  side,
}: {
  year: string;
  text: string;
  image?: string;
  imageLabel: string;
  side: "left" | "right";
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      className={cn("reveal hist-tl-row", side, isVisible && "in")}
    >
      <div className="hist-tl-card">
        <span className="hist-tl-year">{year}</span>
        <p className="hist-tl-text">{text}</p>
      </div>
      <div className="hist-tl-node">{year}</div>
      <div className="hist-tl-photo">
        {image ? (
          <img src={image} alt={imageLabel} loading="lazy" />
        ) : (
          <div className="bl-ph">
            <span>{imageLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HistStorySection({
  kicker,
  eyebrow,
  title,
  image,
  imageCaption,
  reverse,
  background,
  children,
}: {
  kicker: string;
  eyebrow: string;
  title: ReactNode;
  image: string;
  imageCaption?: string;
  reverse?: boolean;
  background?: string;
  children: ReactNode;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.1);
  const kickerBg = background ? { background: "var(--color-bl-bg)" } : undefined;
  return (
    <section className="relative overflow-hidden px-14 py-18" style={background ? { background } : undefined}>
      <div
        ref={ref}
        className={cn(
          "reveal mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2",
          isVisible && "in"
        )}
      >
        <div className={cn(reverse && "md:order-2")}>
          <div className="bl-kicker mb-6" style={kickerBg}>
            <span className="bl-num">{kicker}</span> {eyebrow}
          </div>
          <h2
            className="bl-display m-0 mb-8"
            style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.08 }}
          >
            {title}
          </h2>
          <div
            className="flex flex-col gap-4 text-justify text-base leading-[1.75]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {children}
          </div>
        </div>
        <figure className={cn("m-0", reverse && "md:order-1")}>
          <div
            className="bl-card relative aspect-4/5 overflow-hidden"
            style={{ maxHeight: 600, cursor: "default" }}
          >
            <img
              src={image}
              alt={eyebrow}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {imageCaption && (
            <figcaption
              className={cn(
                "mt-3 text-xs italic",
                reverse ? "text-left" : "text-right"
              )}
              style={{
                color: "var(--color-bl-muted)",
                fontFamily: "var(--font-display)",
              }}
            >
              {imageCaption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

function HistManchester() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.1);

  const stats = [
    { key: "1888", value: t("history.manchester.stats.1888.value"), label: t("history.manchester.stats.1888.label") },
    { key: "first", value: t("history.manchester.stats.first.value"), label: t("history.manchester.stats.first.label") },
    { key: "2025", value: t("history.manchester.stats.2025.value"), label: t("history.manchester.stats.2025.label") },
  ];

  return (
    <section className="relative overflow-hidden px-14 py-18">
      <div
        className="bl-blob bl-float"
        style={{
          width: 380,
          height: 380,
          background: "var(--color-bl-accent)",
          top: -100,
          right: -100,
          opacity: 0.3,
        }}
      />
      <div
        ref={ref}
        className={cn(
          "reveal relative z-10 mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2",
          isVisible && "in"
        )}
      >
        <figure className="m-0 md:order-2">
          <div
            className="bl-card relative aspect-4/5 overflow-hidden"
            style={{
              maxHeight: 600,
              cursor: "default",
              background: "var(--color-bl-bg)",
            }}
          >
            <img
              src="/historia/Foto%204.jpg"
              alt={t("history.manchester.imageAlt")}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption
            className="mt-3 text-xs italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("history.manchester.imageCaption")}
          </figcaption>
        </figure>
        <div className="md:order-1">
          <div className="bl-kicker mb-6">
            <span className="bl-num">03.</span> {t("history.manchester.kicker")}
          </div>
          <h2
            className="bl-display m-0 mb-8"
            style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.08 }}
          >
            {t("history.manchester.titleBefore")} <span className="bl-em">{t("history.manchester.titleHighlight")}</span>{" "}
            {t("history.manchester.titleAfter")}
          </h2>
          <div
            className="flex flex-col gap-4 text-justify text-base leading-[1.75]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            <p className="m-0">{t("history.manchester.p1")}</p>
            <p className="m-0">{t("history.manchester.p2")}</p>
            <p className="m-0">{t("history.manchester.p3")}</p>
          </div>

          <div className="mt-9 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.key}
                className="rounded-[14px] px-4 py-[18px]"
                style={{ background: "var(--color-bl-bg)" }}
              >
                <div
                  className="bl-display italic"
                  style={{ fontSize: 28, color: "var(--color-bl-accent)" }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HistSurprise() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <section
      className="relative overflow-hidden px-14 py-24"
      style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }}
    >
      <div
        className="bl-blob bl-float"
        style={{
          width: 420,
          height: 420,
          background: "var(--color-bl-accent)",
          top: "-15%",
          left: "-8%",
          opacity: 0.4,
        }}
      />
      <div
        className="bl-blob bl-float"
        style={{
          width: 320,
          height: 320,
          background: "var(--color-bl-accent2)",
          bottom: "-10%",
          right: "-5%",
          opacity: 0.3,
          animationDelay: "-5s",
        }}
      />

      <div
        ref={ref}
        className={cn("reveal relative z-10 mx-auto max-w-7xl", isVisible && "in")}
      >
        <div className="mb-16 grid items-center gap-14 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div
              className="bl-kicker mb-6"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--color-bl-bg)" }}
            >
              <span
                className="italic"
                style={{
                  color: "var(--color-bl-accent2)",
                  fontFamily: "var(--font-display)",
                }}
              >
                05.
              </span>{" "}
              {t("history.surprise.kicker")}
            </div>
            <h2
              className="bl-display m-0 mb-8"
              style={{
                fontSize: "clamp(40px, 4.6vw, 68px)",
                lineHeight: 1.05,
                color: "var(--color-bl-bg)",
              }}
            >
              {t("history.surprise.titleBefore")}{" "}
              <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
                {t("history.surprise.titleHighlight")}
              </span>
              <br />
              {t("history.surprise.titleAfter")}
            </h2>
            <p
              className="m-0 mb-4 text-justify text-[17px] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              {t("history.surprise.p1")}
            </p>
            <p
              className="m-0 text-justify text-[17px] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              {t("history.surprise.p2")}
            </p>
          </div>
          <figure className="m-0 hidden md:block">
            <div className="bl-card relative aspect-4/5 overflow-hidden" style={{ maxHeight: 560, cursor: "default" }}>
              <img
                src="/historia/Foto%207.jpg"
                alt={t("history.surprise.kicker")}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
        </div>

        <div
          className="border-t pt-14 text-center"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <p
            className="m-0 mb-6 italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 1.8vw, 26px)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {t("history.surprise.tagline")}
          </p>
          <h3
            className="bl-display m-0 mb-8"
            style={{
              fontSize: "clamp(48px, 6.4vw, 96px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--color-bl-bg)",
            }}
          >
            {t("history.surprise.welcomeBefore")}{" "}
            <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
              {t("history.surprise.welcomeHighlight")}
            </span>
            {t("history.surprise.welcomeAfter")}
          </h3>
          <div className="inline-flex flex-wrap justify-center gap-3">
            <Link to="/roteiros" className="bl-btn">
              {t("common.planTrip")} <ArrowRight size={14} />
            </Link>
            <Link
              to="/atrativos"
              className="bl-btn-ghost"
              style={{ color: "var(--color-bl-bg)", borderColor: "rgba(255,255,255,0.25)" }}
            >
              {t("common.exploreAttractions")} <Compass size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
