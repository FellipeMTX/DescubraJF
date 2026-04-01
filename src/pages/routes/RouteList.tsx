import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoutes } from "@/hooks/useRoutes";

export default function RouteList() {
  const { data: routes, isLoading } = useRoutes();

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800">Roteiros</h1>
        <p className="mt-2 text-accent-500">Caminhos temáticos para explorar Juiz de Fora</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))
            : routes?.map((route) => (
                <Link
                  key={route.id}
                  to={`/roteiros/${route.slug}`}
                  className="group overflow-hidden rounded-xl bg-accent-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-200 to-primary-300">
                    {route.imagem_destaque ? (
                      <img src={route.imagem_destaque} alt={route.nome} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <MapPin size={40} className="text-primary-600 transition-transform group-hover:scale-110" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-primary-800 group-hover:text-primary-600">{route.nome}</h3>
                    {route.descricao_curta && (
                      <p className="mt-1 text-sm text-accent-500">{route.descricao_curta}</p>
                    )}
                  </div>
                </Link>
              ))}
        </div>

        {!isLoading && !routes?.length && (
          <p className="mt-12 text-center text-accent-500">Nenhum roteiro cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
