import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ArrowRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useFeaturedExperiences } from "@/hooks/useExperiences";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";

export function HomeExperiences() {
  const { data: experiences, isLoading } = useFeaturedExperiences();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>(0.1);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>(0.3);

  return (
    <section ref={sectionRef} className="bg-primary-700 py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        {/* Title with scroll reveal */}
        <div
          ref={titleRef}
          className={cn(
            "transition-all duration-700 ease-out",
            titleVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          )}
        >
          <SectionHeader
            icon={<Compass size={24} className="text-primary-200" />}
            title="Tem tudo em Juiz de Fora!"
            subtitle="Viva experiências inesquecíveis"
            dark
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl bg-primary-800/50" />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "relative transition-all duration-1000 ease-out delay-200",
              sectionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            )}
          >
            <Swiper
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation={{
                prevEl: ".swiper-exp-prev",
                nextEl: ".swiper-exp-next",
              }}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={false}
              breakpoints={{
                480: { slidesPerView: 1.5 },
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 2.8 },
                1024: { slidesPerView: 3.5 },
                1280: { slidesPerView: 4 },
              }}
            >
              {experiences?.map((exp, i) => (
                <SwiperSlide key={exp.id}>
                  <div
                    className={cn(
                      "transition-all ease-out",
                      sectionVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-20 opacity-0"
                    )}
                    style={{
                      transitionDuration: `${600 + i * 150}ms`,
                      transitionDelay: `${300 + i * 100}ms`,
                    }}
                  >
                    <ExperienceSlide exp={exp} />
                  </div>
                </SwiperSlide>
              ))}

              {/* CTA slide */}
              <SwiperSlide>
                <div
                  className={cn(
                    "transition-all duration-700 ease-out",
                    sectionVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  )}
                  style={{ transitionDelay: `${300 + (experiences?.length ?? 0) * 100}ms` }}
                >
                  <Link
                    to="/atrativos"
                    className="flex h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-400/40 text-primary-200 transition-all hover:border-primary-400/70 hover:bg-primary-400/10"
                  >
                    <ArrowRight size={36} className="mb-3" />
                    <span className="text-xl font-bold text-accent-50">Tudo e muito mais!</span>
                    <span className="mt-1 text-sm text-primary-300">
                      Ver todos os atrativos
                    </span>
                  </Link>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Navigation arrows */}
            <button className="swiper-exp-prev absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-primary-400/20 p-3 text-accent-100 shadow-lg backdrop-blur-sm transition-all hover:bg-primary-400/40 hover:scale-110 lg:block">
              <ChevronLeft size={22} />
            </button>
            <button className="swiper-exp-next absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-primary-400/20 p-3 text-accent-100 shadow-lg backdrop-blur-sm transition-all hover:bg-primary-400/40 hover:scale-110 lg:block">
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ExperienceSlide({ exp }: { exp: { id: string; slug: string; nome: string; descricao_curta: string | null; imagem_destaque: string | null; categoria?: { nome: string; cor: string | null } | null } }) {
  return (
    <Link to="/atrativos" className="group block">
      <div className="relative h-80 overflow-hidden rounded-2xl bg-primary-800">
        {exp.imagem_destaque ? (
          <img
            src={exp.imagem_destaque}
            alt={exp.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-primary-200">
            {exp.nome}
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent transition-all group-hover:from-primary-900/95" />

        {/* Category badge */}
        {exp.categoria && (
          <Badge
            className="absolute left-4 top-4 text-accent-50 shadow-sm"
            style={{ backgroundColor: exp.categoria.cor ?? "#7b9669" }}
          >
            {exp.categoria.nome}
          </Badge>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-lg font-bold text-accent-50 transition-transform duration-300 group-hover:-translate-y-1">
            {exp.nome}
          </h3>
          {exp.descricao_curta && (
            <p className="mt-2 line-clamp-2 text-sm text-primary-200 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1">
              {exp.descricao_curta}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
