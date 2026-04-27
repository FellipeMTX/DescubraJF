import { PageHeader } from "@/components/ui/PageHeader";

export default function Contact() {
  return (
    <div className="bl-app min-h-screen">
      <div className="mx-auto max-w-4xl px-14 py-12">
        <PageHeader
          kicker="Fale com a gente"
          title="Contato"
          highlight="JF"
          subtitle="Em breve: formulário de contato e informações da Setur."
        />
      </div>
    </div>
  );
}
