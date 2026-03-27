import { Link } from "react-router";
import { MapPin } from "lucide-react";

const ROUTES = [
  { name: "Caminho das Compras", slug: "caminho-das-compras", description: "Descubra o melhor do comércio local" },
  { name: "Caminho das Cervejas Especiais", slug: "caminho-das-cervejas-especiais", description: "Rota pelas cervejarias artesanais" },
  { name: "Caminho da Gastronomia", slug: "caminho-da-gastronomia", description: "Sabores e aromas de Juiz de Fora" },
  { name: "Caminho dos Butecos", slug: "caminho-dos-butecos", description: "Os botecos mais tradicionais da cidade" },
  { name: "Caminho da Cultura", slug: "caminho-da-cultura", description: "Arte, história e patrimônio cultural" },
  { name: "Caminho das Origens", slug: "caminho-das-origens", description: "As raízes históricas da cidade" },
];

export default function RouteList() {
  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800">Caminhando pela História</h1>
        <p className="mt-2 text-accent-500">Um roteiro para cada experiência</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {ROUTES.map((route) => (
            <Link
              key={route.slug}
              to={`/roteiros/${route.slug}`}
              className="group overflow-hidden rounded-xl bg-accent-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300">
                <MapPin size={40} className="text-primary-600 transition-transform group-hover:scale-110" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary-800 group-hover:text-primary-600">
                  {route.name}
                </h3>
                <p className="mt-1 text-sm text-accent-500">{route.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
