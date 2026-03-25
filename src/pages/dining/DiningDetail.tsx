import { useParams } from "react-router";

export default function DiningDetail() {
  const { slug } = useParams();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm text-gray-500">Onde Comer / {slug}</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        Detalhes do Estabelecimento
      </h1>
      <p className="mt-6 text-gray-600">
        Conteúdo será carregado do Supabase quando configurado.
      </p>
    </div>
  );
}
