import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  images: string[];
  className?: string;
};

export function Gallery({ images, className }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      else if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  if (!images.length) return null;

  return (
    <>
      <div
        className={cn(
          "gallery-grid grid gap-2 grid-cols-2 md:grid-cols-3",
          className
        )}
      >
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent
          className="gallery-lightbox h-[85vh] w-[90vw] max-w-none border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-none"
          showCloseButton={false}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Fechar galeria"
            className="absolute -top-2 right-0 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary-800 shadow-lg ring-1 ring-black/10 transition hover:bg-white/90 md:-top-4 md:-right-4"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
          {openIndex !== null && (
            <Swiper
              modules={[Navigation, Pagination, Keyboard]}
              onSwiper={(s) => (swiperRef.current = s)}
              initialSlide={openIndex}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              slidesPerView={1}
              grabCursor
              className="h-full w-full"
            >
              {images.map((src, i) => (
                <SwiperSlide
                  key={`lightbox-${src}-${i}`}
                  className="flex! items-center justify-center"
                >
                  <img
                    src={src}
                    alt=""
                    className="block max-h-full max-w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
