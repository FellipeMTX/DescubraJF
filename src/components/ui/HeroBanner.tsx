import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Compass } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/hooks/useBanners";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const { data: banners, isLoading } = useBanners();
  const [idx, setIdx] = useState(0);
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal<HTMLDivElement>(0.05);

  const slides = banners?.length
    ? banners
    : [
        {
          id: "fallback",
          titulo: "Descubra Juiz de Fora",
          subtitulo: "Mais que um destino, uma experiência inesquecível",
          imagem_url: "",
          link: null,
        },
      ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(id);
  }, [slides.length]);

  if (isLoading) {
    return (
      <Skeleton className="mx-6 mt-10 h-[78vh] min-h-[600px] rounded-[14px]" />
    );
  }

  const slide = slides[Math.min(idx, slides.length - 1)];
  const titleParts = slide.titulo.split(" ");
  const lastWord = titleParts[titleParts.length - 1];
  const restTitle = titleParts.slice(0, -1).join(" ");
  const hasImage = slide.imagem_url && !slide.imagem_url.startsWith("/");

  return (
    <section className="px-6 pt-10 pb-16">
      <div
        ref={cardRef}
        className={cn(
          "bl-card reveal relative h-[78vh] min-h-[600px]",
          cardVisible && "in"
        )}
        style={{ borderRadius: 28 }}
      >
        <Link
          to="/atrativos"
          aria-label="Ver atrativos"
          className="absolute inset-0 block"
        >
          {hasImage ? (
            <img
              src={slide.imagem_url}
              alt={slide.titulo}
              loading="eager"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: "#3a2820" }}
            />
          )}
        </Link>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-14 text-white">
          <div
            className="bl-kicker mb-5 self-start"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              color: "white",
            }}
          >
            <span
              className="dot"
              style={{ background: "var(--color-bl-accent2)" }}
            />
            {slide.subtitulo ? "Em destaque" : "Descubra"}
          </div>

          <h1
            className="bl-display m-0 mb-4 max-w-[60%]"
            style={{ fontSize: "clamp(56px, 7vw, 110px)", color: "white" }}
          >
            {restTitle}{" "}
            <span
              className="italic"
              style={{ color: "var(--color-bl-accent2)" }}
            >
              {lastWord}
            </span>
          </h1>

          {slide.subtitulo && (
            <p className="max-w-[480px] text-lg opacity-90">
              {slide.subtitulo}
            </p>
          )}

          <div className="pointer-events-auto mt-8 flex items-center gap-3">
            <Link to="/atrativos" className="bl-btn">
              Saiba mais <ArrowRight size={14} />
            </Link>
            <Link
              to="/roteiros"
              className="bl-btn-ghost"
              style={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              Roteiros <Compass size={14} />
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="pointer-events-auto mt-10 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="cursor-pointer border-0 transition-all duration-300"
                  style={{
                    width: i === idx ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === idx
                        ? "var(--color-bl-accent2)"
                        : "rgba(255,255,255,0.4)",
                    padding: 0,
                  }}
                />
              ))}
              <span
                className="ml-3 text-xs italic tabular-nums"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {String(idx + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
