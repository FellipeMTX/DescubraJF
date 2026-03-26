import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedExperiences } from "@/hooks/useExperiences";
import "swiper/css";

export function HomeExperiences() {
  const { data: experiences, isLoading } = useFeaturedExperiences();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
        Tem tudo em Juiz de Fora!
      </h2>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {experiences?.map((exp) => (
            <SwiperSlide key={exp.id}>
              <Link to={`/experiencias/${exp.slug}`} className="group block">
                <div className="relative h-64 overflow-hidden rounded-lg bg-gray-200">
                  {exp.imagem_destaque ? (
                    <img
                      src={exp.imagem_destaque}
                      alt={exp.nome}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary-100 text-primary-600">
                      {exp.nome}
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity group-hover:from-black/70" />

                  {/* Category badge */}
                  {exp.categoria && (
                    <Badge
                      className="absolute left-3 top-3"
                      style={{ backgroundColor: exp.categoria.cor ?? undefined }}
                    >
                      {exp.categoria.nome}
                    </Badge>
                  )}

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold text-white">
                      {exp.nome}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}

          {/* Last card: CTA */}
          <SwiperSlide>
            <Link
              to="/experiencias"
              className="flex h-64 flex-col items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors hover:bg-primary-100"
            >
              <ArrowRight size={32} className="mb-2" />
              <span className="text-lg font-bold">Tudo e muito mais!</span>
              <span className="text-sm text-primary-500">
                Ver todas as experiências
              </span>
            </Link>
          </SwiperSlide>
        </Swiper>
      )}
    </section>
  );
}
