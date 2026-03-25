import { useParams } from "react-router";

export default function ExperienceDetail() {
  const { slug } = useParams();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm text-gray-500">Experiências / {slug}</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        Detalhes da Experiência
      </h1>
      <div className="mt-6 h-80 rounded-lg bg-gray-200" />
      <p className="mt-6 text-gray-600">
        Conteúdo será carregado do Supabase quando configurado.
      </p>
    </div>
  );
}
