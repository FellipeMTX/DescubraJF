import { useState } from "react";
import { Link } from "react-router";
import { MapPin, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDiningEstablishments, useDiningCategories } from "@/hooks/useDining";

export default function DiningList() {
  const [selected, setSelected] = useState("todos");
  const { data: categories, isLoading: loadingCats } = useDiningCategories();
  const { data: establishments, isLoading: loadingList } = useDiningEstablishments(selected);

  return (
    <div className="min-h-screen bg-primary-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800">Onde Comer e Beber</h1>
        <p className="mt-2 text-accent-500">
          Experimente tudo que nossa gastronomia oferece
        </p>

        {/* Category filter */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelected("todos")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              selected === "todos"
                ? "border-primary-400 bg-primary-400 text-accent-50"
                : "border-primary-200 text-primary-700 hover:border-primary-400"
            )}
          >
            Todos
          </button>
          {loadingCats
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-full" />
              ))
            : categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.slug)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selected === cat.slug
                      ? "border-primary-400 bg-primary-400 text-accent-50"
                      : "border-primary-200 text-primary-700 hover:border-primary-400"
                  )}
                >
                  {cat.nome}
                </button>
              ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loadingList
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-48 rounded-xl" />
                  <Skeleton className="mt-3 h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-full" />
                </div>
              ))
            : establishments?.map((est) => (
                <Link key={est.id} to={`/onde-comer/${est.slug}`}>
                  <Card className="group h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden bg-primary-100">
                      {est.imagem_destaque ? (
                        <img
                          src={est.imagem_destaque}
                          alt={est.nome}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                          <UtensilsCrossed size={40} className="text-primary-300" />
                        </div>
                      )}
                      {est.categoria && (
                        <Badge className="absolute left-3 top-3 bg-primary-700 text-accent-50">
                          {est.categoria.nome}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-primary-800 group-hover:text-primary-600">
                        {est.nome}
                      </h3>
                      {est.descricao_curta && (
                        <p className="mt-1 line-clamp-2 text-sm text-accent-500">
                          {est.descricao_curta}
                        </p>
                      )}
                      {est.endereco && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-accent-400">
                          <MapPin size={12} /> {est.endereco}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        {!loadingList && !establishments?.length && (
          <p className="mt-12 text-center text-accent-500">
            Nenhum estabelecimento encontrado nesta categoria.
          </p>
        )}
      </div>
    </div>
  );
}
