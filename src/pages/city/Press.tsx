import { PageHeader } from "@/components/ui/PageHeader";

export default function Press() {
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          kicker="Imprensa"
          title="Assessoria de"
          highlight="Imprensa"
          subtitle="Conteúdo será carregado do Supabase quando configurado."
        />
      </div>
    </div>
  );
}
