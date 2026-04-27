import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/hooks/useBanners";

export function HeroBanner() {
  const { data: banners, isLoading } = useBanners();
  const [idx, setIdx] = useState(0);

  if (isLoading) {
    return <Skeleton className="mx-14 mt-10 h-[600px] rounded-[28px]" />;
  }

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

  const slide = slides[Math.min(idx, slides.length - 1)];
  const titleParts = slide.titulo.split(" ");
  const lastWord = titleParts[titleParts.length - 1];
  const restTitle = titleParts.slice(0, -1).join(" ");

  return (
    <section className="relative overflow-hidden px-14 pt-12 pb-16">
      <div
        className="bl-blob bl-float"
        style={{
          width: 380,
          height: 380,
          background: "var(--color-bl-accent2)",
          top: -60,
          right: -80,
        }}
      />
      <div
        className="bl-blob bl-float"
        style={{
          width: 280,
          height: 280,
          background: "var(--color-bl-accent)",
          bottom: -100,
          left: "38%",
          animationDelay: "-4s",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-[1280px] items-end gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="bl-kicker mb-7">
            <span className="dot" />
            {slide.subtitulo ? "Em destaque" : "Descubra"}
          </div>
          <h1
            className="bl-display m-0 mb-6"
            style={{ fontSize: "clamp(56px, 6.4vw, 96px)" }}
          >
            {restTitle}{" "}
            <span className="bl-underline">
              <span className="bl-em">{lastWord}</span>
              <svg viewBox="0 0 100 12" preserveAspectRatio="none">
                <path
                  d="M2,8 Q25,2 50,6 T98,5"
                  stroke="var(--color-bl-accent2)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          {slide.subtitulo && (
            <p
              className="m-0 mb-9 max-w-[480px] text-[18px] leading-[1.65]"
              style={{ color: "var(--color-bl-muted)" }}
            >
              {slide.subtitulo}.
            </p>
          )}
          <div className="flex items-center gap-3">
            <Link to={slide.link || "/atrativos"} className="bl-btn">
              Saiba mais <ArrowRight size={14} />
            </Link>
            <Link to="/roteiros" className="bl-btn-ghost">
              Roteiros <Compass size={14} />
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="mt-12 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="border-0 cursor-pointer transition-all duration-300"
                  style={{
                    width: i === idx ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === idx ? "var(--color-bl-accent)" : "rgba(0,0,0,0.18)",
                    padding: 0,
                  }}
                />
              ))}
              <span
                className="ml-3 text-xs tabular-nums italic"
                style={{
                  color: "var(--color-bl-muted)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {String(idx + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <div className="bl-card aspect-[4/5]">
          {slide.imagem_url && !slide.imagem_url.startsWith("/") ? (
            <img src={slide.imagem_url} alt={slide.titulo} loading="eager" />
          ) : (
            <div className="bl-ph h-full w-full">
              <span>{slide.titulo}</span>
            </div>
          )}
          <div className="absolute bottom-[18px] left-[18px] right-[18px] flex items-end justify-between text-white">
            <div
              className="bl-kicker"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                color: "white",
              }}
            >
              <MapPin size={11} /> Juiz de Fora · MG
            </div>
            <div
              className="bl-display italic"
              style={{
                fontSize: 16,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(10px)",
                padding: "8px 14px",
                borderRadius: 999,
              }}
            >
              ↓ explorar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
