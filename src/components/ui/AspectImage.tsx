import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null | undefined;
  alt: string;
  ratio: string;
  className?: string;
  imgClassName?: string;
  position?: string;
  placeholder?: ReactNode;
  loading?: "lazy" | "eager";
  children?: ReactNode;
};

export function AspectImage({
  src,
  alt,
  ratio,
  className,
  imgClassName,
  position = "center",
  placeholder,
  loading = "lazy",
  children,
}: Props) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn("h-full w-full object-cover", imgClassName)}
          style={{ objectPosition: position }}
        />
      ) : (
        <div className="bl-ph flex h-full w-full items-center justify-center">
          {placeholder}
        </div>
      )}
      {children}
    </div>
  );
}
