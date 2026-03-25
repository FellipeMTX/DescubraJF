export default function RouteList() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Caminhando pela História</h1>
      <p className="mt-2 text-gray-600">Um roteiro para cada experiência</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[
          "Caminho das Compras",
          "Caminho das Cervejas Especiais",
          "Caminho da Gastronomia",
          "Caminho dos Butecos",
          "Caminho da Cultura",
          "Caminho das Origens",
        ].map((name, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-gray-200">
            <div className="h-48" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
