import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/hooks/useBanners";
import "swiper/css";
import "swiper/css/pagination";

export function HeroBanner() {
  const { data: banners, isLoading } = useBanners();

  if (isLoading) {
    return <Skeleton className="h-screen w-full rounded-none" />;
  }

  if (!banners?.length) {
    return (
      <section className="relative flex h-screen items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-400 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold md:text-7xl">
            Descubra Juiz de Fora
          </h1>
          <p className="mt-6 text-xl text-white/70">
            Mais que um destino, uma experiência inesquecível
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={banners.length > 1}
        className="h-screen"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="relative flex h-full items-end bg-cover bg-center"
              style={{
                backgroundImage: banner.imagem_url.startsWith("/")
                  ? undefined
                  : `url(${banner.imagem_url})`,
                backgroundColor: banner.imagem_url.startsWith("/")
                  ? "#404e3b"
                  : undefined,
              }}
            >
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 md:pb-32">
                <h2 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
                  {banner.titulo}
                </h2>
                {banner.subtitulo && (
                  <p className="mt-4 max-w-lg text-lg text-white/80 md:text-xl">
                    {banner.subtitulo}
                  </p>
                )}
                {banner.link && (
                  <Link
                    to={banner.link}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "mt-6 rounded-full px-8"
                    )}
                  >
                    Saiba mais <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
