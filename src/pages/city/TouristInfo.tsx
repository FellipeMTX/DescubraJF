import { PageHeader } from "@/components/ui/PageHeader";

export default function TouristInfo() {
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          title="Informações"
          highlight="Turísticas"
          subtitle="Conteúdo será carregado do Supabase quando configurado."
        />
      </div>
    </div>
  );
}
