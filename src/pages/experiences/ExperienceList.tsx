export default function ExperienceList() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Experiências</h1>
      <p className="mt-2 text-gray-600">Explore o melhor de Juiz de Fora</p>

      {/* Filtro de categorias - placeholder */}
      <div className="mt-8 flex flex-wrap gap-3">
        {["Todos", "Ao Ar Livre", "História e Cultura", "Música e Arte"].map(
          (cat) => (
            <button
              key={cat}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-500 hover:text-primary-700"
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Grid placeholder */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-gray-200">
            <div className="h-48" />
            <div className="p-3">
              <span className="text-xs font-medium text-primary-600">Categoria</span>
              <h3 className="mt-1 font-semibold text-gray-900">
                Experiência {i + 1}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
