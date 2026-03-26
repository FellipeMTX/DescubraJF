import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Star, BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveMap, type MapItem } from "@/components/ui/InteractiveMap";
import { cn } from "@/lib/utils";
import { useLodgingEstablishments } from "@/hooks/useLodging";

const JF_CENTER: [number, number] = [-21.7612, -43.3496];

const TYPES = [
  { label: "Todos", value: "todos" },
  { label: "Hotéis", value: "hotel" },
  { label: "Pousadas", value: "pousada" },
  { label: "Hostels", value: "hostel" },
  { label: "Flats", value: "flat" },
];

export default function LodgingList() {
  const [selected, setSelected] = useState("todos");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: lodgings, isLoading } = useLodgingEstablishments(selected);

  const mapItems: MapItem[] = (lodgings ?? [])
    .filter((l) => l.latitude && l.longitude)
    .map((l) => ({ id: l.id, name: l.nome, lat: l.latitude!, lng: l.longitude! }));

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">Onde Ficar</h1>
        <p className="mt-2 text-accent-500">
          Lugares para tornar sua estadia memorável
        </p>

        {/* Type filter */}
        <div className="mt-6 flex flex-wrap gap-2">
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

        {/* Map */}
        <div className="sticky top-20 z-10 mt-6">
          {mapItems.length > 0 ? (
            <InteractiveMap
              items={mapItems}
              activeId={hoveredId}
              center={JF_CENTER}
              zoom={13}
              className="h-72 w-full rounded-xl shadow-lg md:h-80"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl bg-primary-100 text-primary-300 md:h-80">
              {isLoading ? "Carregando mapa..." : "Nenhum local com coordenadas"}
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))
            : lodgings?.map((lodging) => (
                <Link
                  key={lodging.id}
                  to={`/onde-ficar/${lodging.slug}`}
                  onMouseEnter={() => setHoveredId(lodging.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card
                    className={cn(
                      "group h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-sm transition-all duration-200 hover:shadow-lg",
                      hoveredId === lodging.id && "ring-2 ring-primary-400 shadow-lg"
                    )}
                  >
                    <div className="flex h-full">
                      {/* Image */}
                      <div className="relative w-32 shrink-0 overflow-hidden bg-primary-100 sm:w-36">
                        {lodging.imagem_destaque ? (
                          <img
                            src={lodging.imagem_destaque}
                            alt={lodging.nome}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BedDouble size={28} className="text-primary-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="flex flex-col justify-center p-4">
                        <Badge className="mb-1 w-fit bg-primary-700 text-[10px] text-accent-50 capitalize">
                          {lodging.tipo}
                        </Badge>
                        <h3 className="font-bold text-primary-800 group-hover:text-primary-600">
                          {lodging.nome}
                        </h3>
                        {lodging.estrelas && (
                          <div className="mt-1 flex gap-0.5">
                            {Array.from({ length: lodging.estrelas }).map((_, s) => (
                              <Star key={s} size={11} className="fill-primary-400 text-primary-400" />
                            ))}
                          </div>
                        )}
                        {lodging.endereco && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-accent-500">
                            <MapPin size={11} className="shrink-0" /> {lodging.endereco}
                          </p>
                        )}
                      </CardContent>
                    </div>
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
