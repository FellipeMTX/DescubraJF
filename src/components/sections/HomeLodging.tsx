import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ArrowRight, ChevronLeft, ChevronRight, BedDouble, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLodgingEstablishments } from "@/hooks/useLodging";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";

export function HomeLodging() {
  const { data: lodgings, isLoading } = useLodgingEstablishments();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal<HTMLElement>(0.1);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>(0.3);

  return (
    <section ref={sectionRef} className="bg-primary-50 py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div
          ref={titleRef}
          className={cn(
            "transition-all duration-700 ease-out",
            titleVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <SectionHeader
            icon={<BedDouble size={24} className="text-primary-600" />}
            title="Onde Ficar"
            subtitle="Lugares para tornar sua estadia memorável"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "relative transition-all duration-1000 ease-out delay-200",
              sectionVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            )}
          >
            <Swiper
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              navigation={{
                prevEl: ".swiper-lodging-prev",
                nextEl: ".swiper-lodging-next",
              }}
              spaceBetween={20}
              slidesPerView={1.2}
              breakpoints={{
                480: { slidesPerView: 1.5 },
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 2.8 },
                1024: { slidesPerView: 3.5 },
                1280: { slidesPerView: 4 },
              }}
            >
              {lodgings?.map((lodging, i) => (
                <SwiperSlide key={lodging.id}>
                  <div
                    className={cn(
                      "transition-all ease-out",
                      sectionVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                    )}
                    style={{
                      transitionDuration: `${600 + i * 150}ms`,
                      transitionDelay: `${300 + i * 100}ms`,
                    }}
                  >
                    <Link to="/onde-ficar" className="group block">
                      <div className="relative h-80 overflow-hidden rounded-2xl bg-primary-100">
                        {lodging.imagem_destaque ? (
                          <img
                            src={lodging.imagem_destaque}
                            alt={lodging.nome}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-primary-300">
                            <BedDouble size={40} />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent transition-all group-hover:from-primary-900/95" />

                        <Badge className="absolute left-4 top-4 bg-primary-400 text-accent-50 capitalize shadow-sm">
                          {lodging.tipo}
                        </Badge>

                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          {lodging.estrelas && (
                            <div className="mb-2 flex gap-0.5">
                              {Array.from({ length: lodging.estrelas }).map((_, s) => (
                                <Star key={s} size={12} className="fill-accent-100 text-accent-100" />
                              ))}
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-accent-50 transition-transform duration-300 group-hover:-translate-y-1">
                            {lodging.nome}
                          </h3>
                          {lodging.descricao_curta && (
                            <p className="mt-1 line-clamp-2 text-sm text-primary-200 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1">
                              {lodging.descricao_curta}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}

              <SwiperSlide>
                <Link
                  to="/onde-ficar"
                  className="flex h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-300 text-primary-600 transition-all hover:border-primary-400 hover:bg-primary-100"
                >
                  <ArrowRight size={36} className="mb-3" />
                  <span className="text-xl font-bold">Ver todas</span>
                  <span className="mt-1 text-sm text-primary-400">
                    Todas as hospedagens
                  </span>
                </Link>
              </SwiperSlide>
            </Swiper>

            <button className="swiper-lodging-prev absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-primary-200/50 p-3 text-primary-700 shadow-lg backdrop-blur-sm transition-all hover:bg-primary-300/70 hover:scale-110 lg:block">
              <ChevronLeft size={22} />
            </button>
            <button className="swiper-lodging-next absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-primary-200/50 p-3 text-primary-700 shadow-lg backdrop-blur-sm transition-all hover:bg-primary-300/70 hover:scale-110 lg:block">
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
