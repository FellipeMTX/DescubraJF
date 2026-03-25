export default function Home() {
  return (
    <div>
      {/* Banner rotativo - será implementado com Swiper */}
      <section className="flex h-96 items-center justify-center bg-primary-700 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Descubra Juiz de Fora
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            A Cidade que tem tudo
          </p>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-lg bg-primary-600 p-6 text-white">
            <div>
              <h2 className="text-xl font-bold">Atrativos Turísticos</h2>
              <p className="text-sm text-primary-100">
                Explore o melhor da cidade
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-accent-400 p-6 text-gray-900">
            <div>
              <h2 className="text-xl font-bold">Caminhando pela História</h2>
              <p className="text-sm text-gray-700">
                Um roteiro para cada experiência
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de experiências placeholder */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Tem tudo em Juiz de Fora!
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-gray-200"
            >
              <div className="flex h-full items-end rounded-lg bg-gradient-to-t from-black/50 to-transparent p-4">
                <span className="text-sm font-medium text-white">
                  Experiência {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agenda placeholder */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Acontece em JF
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="h-40 bg-gray-200" />
                <div className="p-4">
                  <p className="text-xs font-medium text-primary-600">
                    Em breve
                  </p>
                  <h3 className="mt-1 font-semibold text-gray-900">
                    Evento {i + 1}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Local a definir</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
