import { useState } from "react";
import { Link } from "react-router";
import { MapPin, UtensilsCrossed, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InteractiveMap, type MapItem } from "@/components/ui/InteractiveMap";
import { cn } from "@/lib/utils";
import { useDiningEstablishments, useDiningCategories } from "@/hooks/useDining";

const JF_CENTER: [number, number] = [-21.7612, -43.3496];
const PRICE_DOTS = ["", "$", "$$", "$$$"];

export default function DiningList() {
  const [selected, setSelected] = useState("todos");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: categories, isLoading: loadingCats } = useDiningCategories();
  const { data: establishments, isLoading: loadingList } = useDiningEstablishments(selected);

  const mapItems: MapItem[] = (establishments ?? [])
    .filter((e) => e.latitude && e.longitude)
    .map((e) => ({ id: e.id, name: e.nome, lat: e.latitude!, lng: e.longitude! }));

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-800">Onde Comer e Beber</h1>
        <p className="mt-2 text-accent-500">
          Experimente tudo que nossa gastronomia oferece
        </p>

        {/* Category filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterButton active={selected === "todos"} onClick={() => setSelected("todos")}>
            Todos
          </FilterButton>
          {loadingCats
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))
            : categories?.map((cat) => (
                <FilterButton
                  key={cat.id}
                  active={selected === cat.slug}
                  onClick={() => setSelected(cat.slug)}
                >
                  {cat.nome}
                </FilterButton>
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
              {loadingList ? "Carregando mapa..." : "Nenhum local com coordenadas"}
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loadingList
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))
            : establishments?.map((est) => (
                <Link
                  key={est.id}
                  to={`/onde-comer/${est.slug}`}
                  onMouseEnter={() => setHoveredId(est.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card
                    className={cn(
                      "group h-full overflow-hidden rounded-xl border-0 bg-accent-50 shadow-sm transition-all duration-200 hover:shadow-lg",
                      hoveredId === est.id && "ring-2 ring-primary-400 shadow-lg"
                    )}
                  >
                    <div className="flex h-full">
                      {/* Image */}
                      <div className="relative w-32 shrink-0 overflow-hidden bg-primary-100 sm:w-36">
                        {est.imagem_destaque ? (
                          <img
                            src={est.imagem_destaque}
                            alt={est.nome}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <UtensilsCrossed size={28} className="text-primary-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="flex flex-col justify-center p-4">
                        {est.categoria && (
                          <Badge className="mb-1 w-fit bg-primary-700 text-[10px] text-accent-50">
                            {est.categoria.nome}
                          </Badge>
                        )}
                        <h3 className="font-bold text-primary-800 group-hover:text-primary-600">
                          {est.nome}
                        </h3>
                        {est.endereco && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-accent-500">
                            <MapPin size={11} className="shrink-0" /> {est.endereco}
                          </p>
                        )}
                        {est.faixa_preco && (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary-500">
                            <DollarSign size={11} /> {PRICE_DOTS[est.faixa_preco]}
                          </p>
                        )}
                      </CardContent>
                    </div>
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

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary-400 bg-primary-400 text-accent-50"
          : "border-primary-200 text-primary-700 hover:border-primary-400"
      )}
    >
      {children}
    </button>
  );
}
