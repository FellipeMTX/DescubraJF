import { PageHeader } from "@/components/ui/PageHeader";

export default function HowToGetHere() {
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          kicker="Acesso à cidade"
          title="Como"
          highlight="Chegar"
          subtitle="Conteúdo será carregado do Supabase quando configurado."
        />
      </div>
    </div>
  );
}
