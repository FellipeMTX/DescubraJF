import { ExternalLink } from "lucide-react";

type Props = {
  mapaUrl?: string | null;
  mapsLink?: string | null;
  title: string;
  openLabel: string;
  emptyLabel: string;
};

/**
 * Converte links do Google My Maps (viewer/edit) para o formato embed, que é o
 * único que o Google permite renderizar dentro de um iframe. URLs já em /embed
 * ou de outras origens passam intactas.
 */
function toEmbedUrl(url: string): string {
  return url.replace(/\/maps\/d\/(u\/\d+\/)?(viewer|edit|view)\b/, "/maps/d/embed");
}

export function RoteiroMap({ mapaUrl, mapsLink, title, openLabel, emptyLabel }: Props) {
  const embedUrl = mapaUrl ? toEmbedUrl(mapaUrl) : null;
  return (
    <div
      className="relative h-full min-h-[340px] overflow-hidden rounded-[18px]"
      style={{ border: "1px solid var(--color-bl-prog-line)", background: "var(--color-bl-prog-soft)" }}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          style={{ border: 0, minHeight: 340 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div
          className="flex h-full min-h-[340px] items-center justify-center px-6 text-center text-[13px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--color-bl-prog-muted)" }}
        >
          {emptyLabel}
        </div>
      )}

      {mapsLink && (
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold no-underline shadow-md transition-opacity hover:opacity-90"
          style={{ background: "var(--color-bl-prog-cta-bg)", color: "#fff" }}
        >
          <ExternalLink size={15} /> {openLabel}
        </a>
      )}
    </div>
  );
}
