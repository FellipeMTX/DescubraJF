import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
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
    return <Skeleton className="h-[28rem] w-full rounded-none" />;
  }

  if (!banners?.length) {
    return (
      <section className="flex h-[28rem] items-center justify-center bg-primary-700 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Descubra Juiz de Fora
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            A cidade que tem tudo
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={banners.length > 1}
        className="h-[28rem]"
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
                  ? "#1d4ed8"
                  : undefined,
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content */}
              <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16">
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  {banner.titulo}
                </h2>
                {banner.subtitulo && (
                  <p className="mt-2 text-lg text-gray-200">
                    {banner.subtitulo}
                  </p>
                )}
                {banner.link && (
                  <Link
                    to={banner.link}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      "mt-4"
                    )}
                  >
                    Saiba mais <ChevronRight size={16} />
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
