import { PageHeader } from "@/components/ui/PageHeader";

export default function AboutSetur() {
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          title="Setur"
          highlight="JF"
          subtitle="Conteúdo será carregado do Supabase quando configurado."
        />
      </div>
    </div>
  );
}
