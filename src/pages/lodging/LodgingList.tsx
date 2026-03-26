import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Star, BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLodgingEstablishments } from "@/hooks/useLodging";

const TYPES = [
  { label: "Todos", value: "todos" },
  { label: "Hotéis", value: "hotel" },
  { label: "Pousadas", value: "pousada" },
  { label: "Hostels", value: "hostel" },
  { label: "Flats", value: "flat" },
];

export default function LodgingList() {
  const [selected, setSelected] = useState("todos");
  const { data: lodgings, isLoading } = useLodgingEstablishments(selected);

  return (
    <div className="min-h-screen bg-primary-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold text-primary-800">Onde Ficar</h1>
        <p className="mt-2 text-accent-500">
          Lugares para tornar sua estadia memorável
        </p>

        {/* Type filter */}
        <div className="mt-8 flex flex-wrap gap-3">
          {TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelected(type.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected === type.value
                  ? "border-primary-400 bg-primary-400 text-accent-50"
                  : "border-primary-200 text-primary-700 hover:border-primary-400"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-48 rounded-xl" />
                  <Skeleton className="mt-3 h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-full" />
                </div>
              ))
            : lodgings?.map((lodging) => (
                <Link key={lodging.id} to={`/onde-ficar/${lodging.slug}`}>
                  <Card className="group h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden bg-primary-100">
                      {lodging.imagem_destaque ? (
                        <img
                          src={lodging.imagem_destaque}
                          alt={lodging.nome}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                          <BedDouble size={40} className="text-primary-300" />
                        </div>
                      )}
                      <Badge className="absolute left-3 top-3 bg-primary-700 text-accent-50 capitalize">
                        {lodging.tipo}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      {lodging.estrelas && (
                        <div className="mb-1 flex gap-0.5">
                          {Array.from({ length: lodging.estrelas }).map((_, s) => (
                            <Star key={s} size={12} className="fill-primary-400 text-primary-400" />
                          ))}
                        </div>
                      )}
                      <h3 className="font-bold text-primary-800 group-hover:text-primary-600">
                        {lodging.nome}
                      </h3>
                      {lodging.descricao_curta && (
                        <p className="mt-1 line-clamp-2 text-sm text-accent-500">
                          {lodging.descricao_curta}
                        </p>
                      )}
                      {lodging.endereco && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-accent-400">
                          <MapPin size={12} /> {lodging.endereco}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>

        {!isLoading && !lodgings?.length && (
          <p className="mt-12 text-center text-accent-500">
            Nenhuma hospedagem encontrada nesta categoria.
          </p>
        )}
      </div>
    </div>
  );
}
