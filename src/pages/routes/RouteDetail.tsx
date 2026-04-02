import { useParams, Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouteBySlug } from "@/hooks/useRoutes";

export default function RouteDetail() {
  const { slug } = useParams();
  const { data: route, isLoading, error } = useRouteBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 pt-20">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-4 h-10 w-64" />
          <Skeleton className="mt-6 h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-primary-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-primary-800">Roteiro não encontrado</h1>
          <Link to="/roteiros" className="mt-4 inline-flex items-center gap-1 text-primary-500 hover:underline">
            <ChevronLeft size={16} /> Voltar para Roteiros
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/roteiros" className="inline-flex items-center gap-1 text-sm text-accent-500 hover:text-primary-600">
          <ChevronLeft size={16} /> Roteiros
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-primary-800">{route.nome}</h1>
        {route.descricao && (
          <p className="mt-2 whitespace-pre-line text-accent-500">{route.descricao}</p>
        )}

        {route.mapa_url ? (
          <div className="mt-6 overflow-hidden rounded-xl shadow-lg">
            <iframe
              src={route.mapa_url}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={route.nome}
            />
          </div>
        ) : (
          <div className="mt-6 flex h-96 items-center justify-center rounded-xl bg-primary-100 text-primary-400">
            Mapa em breve
          </div>
        )}
      </div>
    </div>
  );
}
