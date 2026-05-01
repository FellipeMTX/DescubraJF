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
      <div className="bl-app min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-24 md:px-14">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="mt-4 h-6 w-2/3" />
        </div>
      </div>
    );
  }

  if (!pagina) {
    return (
      <div
        className="bl-app flex min-h-screen items-center justify-center"
        style={{ color: "var(--color-bl-muted)" }}
      >
        Conteúdo indisponível.
      </div>
    );
  }

  return (
    <div className="bl-app min-h-screen">
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
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--color-bl-ink)" }}
    >
      {pagina.hero_imagem && (
        <img
          src={pagina.hero_imagem}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(36,21,16,0.7) 0%, rgba(36,21,16,0.92) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-14">
        <div
          className="bl-kicker mb-6"
          style={{ background: "rgba(247,238,226,0.12)", color: "var(--color-bl-bg)" }}
        >
          <span className="dot" /> Secretaria de Turismo
        </div>
        <h1
          className="bl-display m-0"
          style={{
            color: "var(--color-bl-bg)",
            fontSize: "clamp(40px, 5vw, 64px)",
          }}
        >
          {pagina.hero_titulo}
        </h1>
        {pagina.hero_subtitulo && (
          <p
            className="mt-4 text-lg leading-[1.6]"
            style={{ color: "rgba(247,238,226,0.78)" }}
          >
            {pagina.hero_subtitulo}
          </p>
        )}
      </div>
    </section>
  );
}

function Intro({ pagina }: { pagina: SeturPagina }) {
  if (!pagina.intro_texto_1 && !pagina.intro_texto_2 && !pagina.intro_texto_3) return null;

  return (
    <RevealSection className="py-20" style={{ background: "var(--color-bl-bg)" }}>
      <div className="mx-auto max-w-3xl px-4 md:px-14">
        {pagina.intro_texto_1 && (
          <p className="text-lg leading-[1.75]">{pagina.intro_texto_1}</p>
        )}
        {pagina.intro_texto_2 && (
          <p className="mt-5 text-lg leading-[1.75]">{pagina.intro_texto_2}</p>
        )}
        {pagina.intro_titulo_secao && (
          <h2
            className="bl-display mt-12"
            style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
          >
            {pagina.intro_titulo_secao}
          </h2>
        )}
        {pagina.intro_texto_3 && (
          <p className="mt-5 text-lg leading-[1.75]">{pagina.intro_texto_3}</p>
        )}
      </div>
    </RevealSection>
  );
}

function Mvv({ pagina }: { pagina: SeturPagina }) {
  const hasAny = pagina.missao_texto || pagina.visao_texto || pagina.valores.length > 0;
  if (!hasAny) return null;

  return (
    <RevealSection className="py-20" style={{ background: "var(--color-bl-card)" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-14">
        <div className="grid gap-6 md:grid-cols-3">
          {pagina.missao_texto && (
            <MvvCard icon={<Target className="h-7 w-7" />} title="Nossa Missão">
              <p className="leading-[1.7]">{pagina.missao_texto}</p>
            </MvvCard>
          )}
          {pagina.visao_texto && (
            <MvvCard icon={<Eye className="h-7 w-7" />} title="Nossa Visão">
              <p className="leading-[1.7]">{pagina.visao_texto}</p>
            </MvvCard>
          )}
          {pagina.valores.length > 0 && (
            <MvvCard icon={<Heart className="h-7 w-7" />} title="Nossos Valores">
              <ul className="space-y-2">
                {pagina.valores.map((v) => (
                  <li key={v} className="flex gap-2 leading-[1.7]">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--color-bl-accent)" }}
                    />
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
    <RevealSection className="py-20" style={{ background: "var(--color-bl-bg)" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-14">
        <h2
          className="bl-display mb-10"
          style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
        >
          Onde <span className="bl-em">estamos</span>?
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          <ul className="space-y-5">
            {pagina.endereco && (
              <li className="flex gap-4">
                <MapPin
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-bl-accent)" }}
                />
                <div className="leading-[1.6]">
                  {pagina.endereco}
                  {pagina.cep && (
                    <>
                      <br />
                      <span style={{ color: "var(--color-bl-muted)" }}>
                        CEP: {pagina.cep}
                      </span>
                    </>
                  )}
                </div>
              </li>
            )}
            {pagina.horario && (
              <li className="flex gap-4">
                <Clock
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-bl-accent)" }}
                />
                <span className="leading-[1.6]">{pagina.horario}</span>
              </li>
            )}
            {pagina.telefone && (
              <li className="flex gap-4">
                <Phone
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-bl-accent)" }}
                />
                <a
                  href={`tel:${pagina.telefone.replace(/\D/g, "")}`}
                  className="leading-[1.6] underline-offset-4 hover:underline"
                >
                  {pagina.telefone}
                </a>
              </li>
            )}
            {pagina.email && (
              <li className="flex gap-4">
                <Mail
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "var(--color-bl-accent)" }}
                />
                <a
                  href={`mailto:${pagina.email}`}
                  className="leading-[1.6] underline-offset-4 hover:underline"
                >
                  {pagina.email}
                </a>
              </li>
            )}
          </ul>
          {hasCoords && (
            <div
              className="overflow-hidden rounded-[24px]"
              style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            >
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
    <RevealSection className="py-20" style={{ background: "var(--color-bl-card)" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-14">
        <h2
          className="bl-display mb-12 text-center"
          style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
        >
          Quem é <span className="bl-em">quem</span>?
        </h2>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[20px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {equipe.map((member) => (
              <div
                key={member.id}
                className="rounded-[20px] p-6"
                style={{
                  background: "var(--color-bl-bg)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p
                  className="text-2xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  {member.cargo}
                </p>
                <p className="bl-display mt-2 text-lg leading-tight">{member.nome}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 inline-block text-sm underline-offset-4 hover:underline"
                    style={{ color: "var(--color-bl-muted)" }}
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

function RevealSection({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);
  return (
    <section ref={ref} className={className} style={style}>
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

function MvvCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[20px] p-7 md:p-8"
      style={{
        background: "var(--color-bl-bg)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "var(--color-bl-card)",
          color: "var(--color-bl-accent)",
        }}
      >
        {icon}
      </div>
      <h3 className="bl-display mb-3 text-xl leading-tight">{title}</h3>
      {children}
    </div>
  );
}
