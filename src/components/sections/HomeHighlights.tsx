import { Link } from "react-router";
import { Map, Footprints } from "lucide-react";

export function HomeHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/mapas-e-guias"
          className="group flex items-center gap-4 rounded-xl bg-primary-600 p-6 text-white transition-all hover:bg-primary-700 hover:shadow-lg"
        >
          <div className="rounded-lg bg-white/20 p-3">
            <Map size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Atrativos Turísticos</h2>
            <p className="text-sm text-primary-100">
              Explore o melhor da cidade
            </p>
          </div>
        </Link>

        <Link
          to="/roteiros"
          className="group flex items-center gap-4 rounded-xl bg-accent-400 p-6 text-gray-900 transition-all hover:bg-accent-300 hover:shadow-lg"
        >
          <div className="rounded-lg bg-black/10 p-3">
            <Footprints size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Caminhando pela História</h2>
            <p className="text-sm text-gray-700">
              Um roteiro para cada experiência
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
