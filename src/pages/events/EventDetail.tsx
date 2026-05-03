import { useParams, Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function EventDetail() {
  const { slug } = useParams();

  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <Link
          to="/agenda"
          className="mb-4 inline-flex items-center gap-1 text-sm hover:underline"
          style={{ color: "var(--color-bl-muted)" }}
        >
          <ChevronLeft size={16} /> Agenda
        </Link>
        <PageHeader
          kicker={`Evento · ${slug}`}
          title="Detalhes do"
          highlight="Evento"
          subtitle="Conteúdo será carregado do Supabase quando configurado."
        />
        <div
          className="mt-6 h-80 rounded-[28px]"
          style={{ background: "var(--color-bl-card)" }}
        />
      </div>
    </div>
  );
}
