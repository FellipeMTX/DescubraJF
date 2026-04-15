import { Clock, Eye, Heart, Mail, MapPin, Phone, Target } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSeturEquipe, useSeturPagina } from "@/hooks/useSetur";
import { InteractiveMap } from "@/components/ui/InteractiveMap";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { SeturMembro, SeturPagina } from "@/types/database";

export default function Institucional() {
  const { data: pagina, isLoading: loadingPage } = useSeturPagina();
  const { data: equipe, isLoading: loadingTeam } = useSeturEquipe();

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-primary-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-24">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="mt-4 h-6 w-2/3" />
        </div>
      </div>
    );
  }

  if (!pagina) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-50 pt-20 text-primary-700">
        Conteúdo indisponível.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      <Hero pagina={pagina} />
      <Intro pagina={pagina} />
      <Mvv pagina={pagina} />
      <Location pagina={pagina} />
      <Team loading={loadingTeam} equipe={equipe ?? []} />
    </div>
  );
}

function Hero({ pagina }: { pagina: SeturPagina }) {
  return (
    <section className="relative overflow-hidden bg-primary-700 py-24">
      {pagina.hero_imagem && (
        <img
          src={pagina.hero_imagem}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-primary-900/70" />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-3xl font-bold text-accent-50 md:text-5xl">{pagina.hero_titulo}</h1>
        {pagina.hero_subtitulo && (
          <p className="mt-4 text-lg text-primary-100">{pagina.hero_subtitulo}</p>
        )}
      </div>
    </section>
  );
}

function Intro({ pagina }: { pagina: SeturPagina }) {
  if (!pagina.intro_texto_1 && !pagina.intro_texto_2 && !pagina.intro_texto_3) return null;

  return (
    <RevealSection className="bg-primary-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        {pagina.intro_texto_1 && <p className="leading-relaxed text-primary-700">{pagina.intro_texto_1}</p>}
        {pagina.intro_texto_2 && (
          <p className="mt-4 leading-relaxed text-primary-700">{pagina.intro_texto_2}</p>
        )}
        {pagina.intro_titulo_secao && (
          <h2 className="mt-10 text-2xl font-bold text-primary-800 md:text-3xl">
            {pagina.intro_titulo_secao}
          </h2>
        )}
        {pagina.intro_texto_3 && (
          <p className="mt-4 leading-relaxed text-primary-700">{pagina.intro_texto_3}</p>
        )}
      </div>
    </RevealSection>
  );
}

function Mvv({ pagina }: { pagina: SeturPagina }) {
  const hasAny = pagina.missao_texto || pagina.visao_texto || pagina.valores.length > 0;
  if (!hasAny) return null;

  return (
    <RevealSection className="bg-primary-700 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {pagina.missao_texto && (
            <MvvCard icon={<Target className="h-8 w-8" />} title="Nossa Missão">
              <p className="leading-relaxed text-primary-100">{pagina.missao_texto}</p>
            </MvvCard>
          )}
          {pagina.visao_texto && (
            <MvvCard icon={<Eye className="h-8 w-8" />} title="Nossa Visão">
              <p className="leading-relaxed text-primary-100">{pagina.visao_texto}</p>
            </MvvCard>
          )}
          {pagina.valores.length > 0 && (
            <MvvCard icon={<Heart className="h-8 w-8" />} title="Nossos Valores">
              <ul className="space-y-2 text-primary-100">
                {pagina.valores.map((v) => (
                  <li key={v} className="flex gap-2 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-50" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </MvvCard>
          )}
        </div>
      </div>
    </RevealSection>
  );
}

function Location({ pagina }: { pagina: SeturPagina }) {
  const hasCoords = pagina.latitude !== null && pagina.longitude !== null;

  return (
    <RevealSection className="bg-primary-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-primary-800 md:text-3xl">Onde estamos?</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <ul className="space-y-4 text-primary-700">
            {pagina.endereco && (
              <li className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
                <div>
                  {pagina.endereco}
                  {pagina.cep && (
                    <>
                      <br />
                      CEP: {pagina.cep}
                    </>
                  )}
                </div>
              </li>
            )}
            {pagina.horario && (
              <li className="flex gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
                <span>{pagina.horario}</span>
              </li>
            )}
            {pagina.telefone && (
              <li className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
                <a href={`tel:${pagina.telefone.replace(/\D/g, "")}`} className="hover:text-primary-900">
                  {pagina.telefone}
                </a>
              </li>
            )}
            {pagina.email && (
              <li className="flex gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
                <a href={`mailto:${pagina.email}`} className="hover:text-primary-900">
                  {pagina.email}
                </a>
              </li>
            )}
          </ul>
          {hasCoords && (
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <InteractiveMap
                items={[
                  {
                    id: "setur",
                    name: pagina.hero_titulo,
                    lat: pagina.latitude!,
                    lng: pagina.longitude!,
                  },
                ]}
                activeId="setur"
                center={[pagina.latitude!, pagina.longitude!]}
                zoom={16}
                className="h-80 w-full"
              />
            </div>
          )}
        </div>
      </div>
    </RevealSection>
  );
}

function Team({ loading, equipe }: { loading: boolean; equipe: SeturMembro[] }) {
  return (
    <RevealSection className="bg-primary-700 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-2xl font-bold text-accent-50 md:text-3xl">Quem é quem?</h2>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full bg-primary-800" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {equipe.map((member) => (
              <div key={member.id} className="rounded-2xl bg-primary-800 p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-300">
                  {member.cargo}
                </p>
                <p className="mt-2 text-lg font-bold text-accent-50">{member.nome}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-1 inline-block text-sm text-primary-200 hover:text-accent-50"
                  >
                    {member.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </RevealSection>
  );
}

function RevealSection({ className, children }: { className?: string; children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);
  return (
    <section ref={ref} className={className}>
      <div
        className={cn(
          "transition-all duration-700 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}
      >
        {children}
      </div>
    </section>
  );
}

function MvvCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-primary-800 p-6 shadow-lg md:p-8">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-700 text-accent-50">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-accent-50">{title}</h3>
      {children}
    </div>
  );
}
