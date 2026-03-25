export default function EventList() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Acontece em JF</h1>
      <p className="mt-2 text-gray-600">
        Fique por dentro de tudo o que está rolando na cidade
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="h-40 bg-gray-200" />
            <div className="p-4">
              <p className="text-xs font-medium text-primary-600">Em breve</p>
              <h3 className="mt-1 font-semibold text-gray-900">Evento {i + 1}</h3>
              <p className="mt-1 text-sm text-gray-500">Local a definir</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
