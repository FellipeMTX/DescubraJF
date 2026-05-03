import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Compass } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const TIMELINE: ReadonlyArray<{
  year: string;
  text: string;
  image?: string;
  imageLabel: string;
}> = [
  { year: "1703", text: "Início do Caminho Novo, ligando Minas ao Rio e impulsionando o surgimento de povoados como Santo Antônio do Paraibuna.", imageLabel: "caminho novo" },
  { year: "1853", text: "Elevação de Santo Antônio do Paraibuna à categoria de cidade; contratação de técnicos europeus para a Estrada União e Indústria.", imageLabel: "elevação à cidade" },
  { year: "1856", text: "Chegada de 20 artífices europeus para colaborar na construção da estrada.", imageLabel: "artífices europeus" },
  { year: "1857", text: "Chegada de 1.162 imigrantes alemães, formando um núcleo colonial na região.", image: "/Chegada-imigrantes-03.webp", imageLabel: "imigrantes alemães" },
  { year: "1861", text: "Visita de Dom Pedro II à cidade; construção do palacete por Manoel do Vale Amado.", image: "/PacoMunicipal-01.webp", imageLabel: "Dom Pedro II · palacete" },
  { year: "1865", text: "Santo Antônio do Paraibuna recebe o nome de Juiz de Fora.", imageLabel: "novo nome — Juiz de Fora" },
  { year: "1890", text: 'Construção do "Castelinho", sede da Companhia Mineira de Eletricidade.', image: "/ManchesterMineira-05.webp", imageLabel: "Castelinho · eletricidade" },
  { year: "1907", text: "Palacete da Santa Mafalda se transforma no Primeiro Grupo Escolar.", image: "/HotelAvenida-02.webp", imageLabel: "primeiro grupo escolar" },
  { year: "1915", text: "O Museu Mariano Procópio é fundado por Alfredo Ferreira Lage.", imageLabel: "Museu Mariano Procópio" },
  { year: "1929", text: "Inauguração do Cine-Theatro Central com estilo arquitetônico eclético.", image: "/arq-07.webp", imageLabel: "Cine-Theatro Central" },
  { year: "1934", text: "Fundação da escola de samba Turunas do Riachuelo.", imageLabel: "Turunas do Riachuelo" },
  { year: "1977", text: "Criação do Concurso Miss Gay Brasil, marco na cultura LGBTQIAPN+.", imageLabel: "Miss Brasil Gay" },
  { year: "2023", text: "Reabertura do palacete restaurado; celebração da história arquitetônica e cultural da cidade.", imageLabel: "palacete restaurado" },
];

export default function History() {
  return (
    <div className="bl-app">
      <HistHero />
      <HistIntro />
      <HistPullQuote />
      <HistTimeline />
      <HistStorySection
        kicker="01."
        eyebrow="Origem"
        title={<>De povoado a <span className="bl-em">cidade</span>: o nome Juiz de Fora</>}
        image="/HotelAvenida-02.webp"
        imageCaption="Fonte: Arquivo Alberto Surerus Moutinho, 1928"
      >
        <p>
          Juiz de Fora não nasceu por acaso. Sua história começa por volta de <strong>1703</strong>, com a abertura do <strong>Caminho Novo</strong>, uma rota estratégica entre Minas Gerais e o Rio de Janeiro, criada para escoar o ouro e controlar o recolhimento de impostos pela Coroa Portuguesa.
        </p>
        <p>
          Ao longo dessa estrada surgiram diversos povoados, entre eles <strong>Santo Antônio do Paraibuna</strong> — que viria a se tornar uma das cidades pioneiras de Minas Gerais. Em <strong>1853</strong> foi elevado à categoria de cidade e, doze anos depois, recebeu seu nome definitivo: <strong>Juiz de Fora</strong>.
        </p>
        <p>
          E sim, havia mesmo um <span className="bl-em">"juiz de fora"!</span> No período colonial, eram nomeados magistrados de outras regiões para evitar favoritismos locais. A expressão pegou e acabou batizando a cidade.
        </p>
      </HistStorySection>
      <HistStorySection
        reverse
        kicker="02."
        eyebrow="Imigração"
        title={<>A chegada dos <span className="bl-em">imigrantes</span></>}
        image="/Chegada-imigrantes-03.webp"
        imageCaption="Fonte: Arquivo Central da UFJF"
      >
        <p>
          Com a cidade em pleno desenvolvimento, a <strong>construção da Estrada União e Indústria</strong>, idealizada por <strong>Mariano Procópio Ferreira Lage</strong>, impulsionaria ainda mais o seu crescimento. Considerada uma das <strong>primeiras rodovias modernas da América Latina</strong>, ligava Juiz de Fora a Petrópolis.
        </p>
        <p>
          Em 1857, chegaram <strong>1.162 imigrantes alemães</strong> — número equivalente a cerca de 20% da população local. Instalaram-se nos atuais bairros São Pedro, Borboleta e Fábrica. Com o tempo, migraram para a vida urbana como operários, marceneiros e carroceiros, integrando-se à cidade e à Companhia União e Indústria.
        </p>
      </HistStorySection>
      <HistManchester />
      <HistStorySection
        reverse
        kicker="04."
        eyebrow="Memória"
        title={<>Arquitetura e <span className="bl-em">personagens</span> que moldaram a cidade</>}
        image="/arq-07.webp"
        imageCaption="Fonte: Cristina Bitarello, 2024"
      >
        <p>
          Caminhar pelas ruas de Juiz de Fora é como folhear um <span className="bl-em">livro de memórias</span>. O <strong>Palacete Santa Mafalda</strong>, construído na década de 1850 para presentear Dom Pedro II, foi transformado em escola e restaurado em 2023.
        </p>
        <p>
          O <strong>"Castelinho"</strong>, erguido em 1890, impressiona com sua arquitetura medieval. <strong>Alfredo Ferreira Lage</strong> transformou a Villa da família no Museu Mariano Procópio. O paisagista francês <strong>Auguste Glaziou</strong> imprimiu o charme dos jardins ingleses ao parque.
        </p>
        <p>
          Até <strong>Cândido Portinari</strong> deixou sua marca com dois painéis públicos na fachada do Edifício Clube Juiz de Fora. E o <strong>Cine-Theatro Central</strong>, inaugurado em 1929, segue sendo palco de grandes espetáculos.
        </p>
      </HistStorySection>
      <HistSurprise />
    </div>
  );
}

function HistHero() {
  return (
    <section className="px-6 pt-10 pb-16">
      <div
        className="bl-card relative h-[78vh] min-h-[560px] overflow-hidden"
        style={{ borderRadius: 28, cursor: "default" }}
      >
        <div className="absolute inset-0" style={{ background: "#3a2820" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-[clamp(32px,5vw,64px)] text-white">
          <div
            className="bl-kicker mb-6 self-start"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              color: "white",
            }}
          >
            <span className="dot" style={{ background: "var(--color-bl-accent2)" }} />
            Descubra · Capítulo I
          </div>
          <h1
            className="bl-display m-0 mb-4"
            style={{
              fontSize: "clamp(64px, 9vw, 156px)",
              color: "white",
              lineHeight: 0.95,
            }}
          >
            Hist
            <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>ó</span>
            ria
          </h1>
          <p
            className="m-0 italic"
            style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              opacity: 0.92,
              maxWidth: 620,
              lineHeight: 1.55,
              fontFamily: "var(--font-display)",
            }}
          >
            A trajetória de uma cidade que nunca parou de se reinventar.
          </p>
        </div>
      </div>
    </section>
  );
}

function HistIntro() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.12);
  return (
    <section className="relative overflow-hidden px-14 pt-6 pb-24">
      <div
        className="bl-blob bl-float"
        style={{
          width: 360,
          height: 360,
          background: "var(--color-bl-accent2)",
          top: 40,
          right: -120,
        }}
      />
      <div
        ref={ref}
        className={cn(
          "reveal relative z-10 mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.1fr_1fr]",
          isVisible && "in"
        )}
      >
        <div>
          <div className="bl-kicker mb-7">
            <span className="bl-num">— </span> Pioneira por essência
          </div>
          <p
            className="m-0 mb-7"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 2.8vw, 40px)",
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
            }}
          >
            Se você acha que já viu de tudo em uma cidade, é porque ainda{" "}
            <span className="bl-em">não conhece Juiz de Fora.</span>
          </p>
          <p className="mb-4 text-base leading-[1.7]" style={{ color: "var(--color-bl-muted)" }}>
            No coração da Zona da Mata mineira, ela surpreende pelo espírito{" "}
            <strong style={{ color: "var(--color-bl-ink)" }}>pioneiro</strong>, pela{" "}
            <strong style={{ color: "var(--color-bl-ink)" }}>história vibrante</strong> e pela
            capacidade única de se{" "}
            <strong style={{ color: "var(--color-bl-ink)" }}>reinventar</strong>.
          </p>
          <p className="mb-4 text-base leading-[1.7]" style={{ color: "var(--color-bl-muted)" }}>
            Foi aqui que a América Latina testemunhou a{" "}
            <strong style={{ color: "var(--color-bl-ink)" }}>primeira transmissão de TV aberta</strong>{" "}
            e onde Bernardo Mascarenhas fez história com a{" "}
            <strong style={{ color: "var(--color-bl-ink)" }}>primeira usina hidrelétrica</strong>{" "}
            destinada à{" "}
            <strong style={{ color: "var(--color-bl-ink)" }}>iluminação pública</strong> no
            continente.
          </p>
          <p className="text-base leading-[1.7]" style={{ color: "var(--color-bl-muted)" }}>
            No final do século XIX, Juiz de Fora ganhou o título de{" "}
            <span className="bl-em">"Manchester Mineira"</span>, graças às fábricas têxteis que
            projetaram a cidade entre as mais promissoras do Brasil.
          </p>
        </div>
        <figure className="m-0">
          <div
            className="bl-card relative aspect-4/5"
            style={{ maxHeight: 580, cursor: "default" }}
          >
            <img
              src="/PacoMunicipal-01.webp"
              alt="Antigo Paço Municipal"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption
            className="mt-3 text-right text-xs italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            Antigo Paço Municipal — atual Secretaria Especial de Igualdade Racial
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function HistPullQuote() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.12);
  return (
    <section className="px-14 py-6">
      <div
        ref={ref}
        className={cn("reveal mx-auto max-w-[980px] text-center", isVisible && "in")}
      >
        <div className="bl-kicker mb-7">
          <span className="dot" /> Sabor, cultura, surpresa
        </div>
        <p
          className="bl-display m-0 mb-7"
          style={{ fontSize: "clamp(28px, 3.2vw, 44px)", lineHeight: 1.22 }}
        >
          Juiz de Fora entrou para o livro dos recordes com a{" "}
          <span className="bl-em">maior fritada de torresmo do mundo</span> servida em um único
          evento — só uma amostra do que a nossa gastronomia mineira tem a oferecer.
        </p>
        <p
          className="mx-auto mb-4 max-w-[720px] text-base leading-[1.7]"
          style={{ color: "var(--color-bl-muted)" }}
        >
          Do <strong style={{ color: "var(--color-bl-ink)" }}>Museu Mariano Procópio</strong> ao{" "}
          <strong style={{ color: "var(--color-bl-ink)" }}>Cine-Theatro Central</strong>, passando
          pelo <strong style={{ color: "var(--color-bl-ink)" }}>Mirante do Morro do Imperador</strong>{" "}
          e pelo <strong style={{ color: "var(--color-bl-ink)" }}>Parque Halfeld</strong>, cada canto
          da cidade revela experiências que unem tradição e inovação.
        </p>
        <p
          className="m-0 italic"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--color-bl-accent)",
          }}
        >
          Juiz de Fora é plural, criativa e diversa.
        </p>
      </div>
    </section>
  );
}

function HistTimeline() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <section
      className="relative overflow-hidden px-14 py-24"
      style={{ background: "var(--color-bl-card)" }}
    >
      <div
        className="bl-blob bl-float"
        style={{
          width: 320,
          height: 320,
          background: "var(--color-bl-accent)",
          top: -80,
          left: "20%",
          opacity: 0.28,
        }}
      />
      <div
        ref={ref}
        className={cn("reveal relative z-10 mx-auto max-w-7xl", isVisible && "in")}
      >
        <div className="mb-16 grid items-end gap-10 md:grid-cols-2">
          <div>
            <div
              className="bl-kicker mb-5"
              style={{ background: "var(--color-bl-bg)" }}
            >
              <span className="bl-num">— </span> 1703 → hoje
            </div>
            <h2
              className="bl-display m-0"
              style={{ fontSize: "clamp(40px, 4.4vw, 64px)" }}
            >
              Linha do <span className="bl-em">tempo</span>
            </h2>
          </div>
          <p
            className="m-0 text-base leading-[1.7]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            Mais de três séculos de marcos que transformaram um povoado de tropeiros em uma das
            cidades mais influentes das Geraes.
          </p>
        </div>

        <div className="hist-tl">
          <div className="hist-tl-line" />
          {TIMELINE.map((it, i) => (
            <TimelineItem
              key={it.year}
              year={it.year}
              text={it.text}
              image={it.image}
              imageLabel={it.imageLabel}
              side={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  year,
  text,
  image,
  imageLabel,
  side,
}: {
  year: string;
  text: string;
  image?: string;
  imageLabel: string;
  side: "left" | "right";
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      className={cn("reveal hist-tl-row", side, isVisible && "in")}
    >
      <div className="hist-tl-card">
        <span className="hist-tl-year">{year}</span>
        <p className="hist-tl-text">{text}</p>
      </div>
      <div className="hist-tl-node">{year}</div>
      <div className="hist-tl-photo">
        {image ? (
          <img src={image} alt={imageLabel} loading="lazy" />
        ) : (
          <div className="bl-ph">
            <span>{imageLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HistStorySection({
  kicker,
  eyebrow,
  title,
  image,
  imageCaption,
  reverse,
  children,
}: {
  kicker: string;
  eyebrow: string;
  title: ReactNode;
  image: string;
  imageCaption?: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.1);
  return (
    <section className="relative overflow-hidden px-14 py-24">
      <div
        ref={ref}
        className={cn(
          "reveal mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2",
          isVisible && "in"
        )}
      >
        <div className={cn(reverse && "md:order-2")}>
          <div className="bl-kicker mb-6">
            <span className="bl-num">{kicker}</span> {eyebrow}
          </div>
          <h2
            className="bl-display m-0 mb-8"
            style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.08 }}
          >
            {title}
          </h2>
          <div
            className="flex flex-col gap-4 text-base leading-[1.75]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            {children}
          </div>
        </div>
        <figure className={cn("m-0", reverse && "md:order-1")}>
          <div
            className="bl-card relative aspect-4/5 overflow-hidden"
            style={{ maxHeight: 600, cursor: "default" }}
          >
            <img
              src={image}
              alt={eyebrow}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {imageCaption && (
            <figcaption
              className={cn(
                "mt-3 text-xs italic",
                reverse ? "text-left" : "text-right"
              )}
              style={{
                color: "var(--color-bl-muted)",
                fontFamily: "var(--font-display)",
              }}
            >
              {imageCaption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

function HistManchester() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.1);
  return (
    <section
      className="relative overflow-hidden px-14 py-24"
      style={{ background: "var(--color-bl-card)" }}
    >
      <div
        className="bl-blob bl-float"
        style={{
          width: 380,
          height: 380,
          background: "var(--color-bl-accent)",
          top: -100,
          right: -100,
          opacity: 0.3,
        }}
      />
      <div
        ref={ref}
        className={cn(
          "reveal relative z-10 mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2",
          isVisible && "in"
        )}
      >
        <figure className="m-0">
          <div
            className="bl-card relative aspect-4/5 overflow-hidden"
            style={{
              maxHeight: 600,
              cursor: "default",
              background: "var(--color-bl-bg)",
            }}
          >
            <img
              src="/ManchesterMineira-05.webp"
              alt="Usina de Marmelos"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption
            className="mt-3 text-xs italic"
            style={{
              color: "var(--color-bl-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            Fonte: Prefeitura de Juiz de Fora
          </figcaption>
        </figure>
        <div>
          <div
            className="bl-kicker mb-6"
            style={{ background: "var(--color-bl-bg)" }}
          >
            <span className="bl-num">03.</span> Indústria & energia
          </div>
          <h2
            className="bl-display m-0 mb-8"
            style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.08 }}
          >
            A <span className="bl-em">Manchester Mineira</span> e a revolução energética
          </h2>
          <div
            className="flex flex-col gap-4 text-base leading-[1.75]"
            style={{ color: "var(--color-bl-muted)" }}
          >
            <p className="m-0">
              Juiz de Fora conquistou o{" "}
              <strong style={{ color: "var(--color-bl-ink)" }}>
                título de "Manchester Mineira"
              </strong>{" "}
              no final do século XIX, em referência à cidade inglesa símbolo da Revolução
              Industrial. O apelido refletia o importante papel no desenvolvimento industrial de
              Minas Gerais, impulsionado pelas indústrias têxteis.
            </p>
            <p className="m-0">
              <strong style={{ color: "var(--color-bl-ink)" }}>Bernardo Mascarenhas</strong>,
              empreendedor visionário, fundou em 1888 a{" "}
              <strong style={{ color: "var(--color-bl-ink)" }}>
                Companhia Mineira de Eletricidade
              </strong>{" "}
              e construiu a <span className="bl-em">Usina de Marmelos</span> — a primeira da
              América Latina a fornecer energia elétrica para iluminação pública.
            </p>
            <p className="m-0">
              O antigo prédio da Fábrica Têxtil foi revitalizado e hoje integra o{" "}
              <strong style={{ color: "var(--color-bl-ink)" }}>Complexo Mascarenhas</strong>, onde
              tradição e inovação se encontram no Centro Cultural Bernardo Mascarenhas e no Mercado
              Municipal — reinaugurado em 2025.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-3 gap-4">
            {[
              { n: "1888", l: "Cia. Mineira de Eletricidade" },
              { n: "1ª", l: "usina hidrelétrica da AL" },
              { n: "2025", l: "Mercado reinaugurado" },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-[14px] px-4 py-[18px]"
                style={{ background: "var(--color-bl-bg)" }}
              >
                <div
                  className="bl-display italic"
                  style={{ fontSize: 28, color: "var(--color-bl-accent)" }}
                >
                  {s.n}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HistSurprise() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.08);
  return (
    <section
      className="relative overflow-hidden px-14 py-24"
      style={{ background: "var(--color-bl-ink)", color: "var(--color-bl-bg)" }}
    >
      <div
        className="bl-blob bl-float"
        style={{
          width: 420,
          height: 420,
          background: "var(--color-bl-accent)",
          top: "-15%",
          left: "-8%",
          opacity: 0.4,
        }}
      />
      <div
        className="bl-blob bl-float"
        style={{
          width: 320,
          height: 320,
          background: "var(--color-bl-accent2)",
          bottom: "-10%",
          right: "-5%",
          opacity: 0.3,
          animationDelay: "-5s",
        }}
      />

      <div
        ref={ref}
        className={cn("reveal relative z-10 mx-auto max-w-7xl", isVisible && "in")}
      >
        <div className="mb-16 grid items-center gap-14 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div
              className="bl-kicker mb-6"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--color-bl-bg)" }}
            >
              <span
                className="italic"
                style={{
                  color: "var(--color-bl-accent2)",
                  fontFamily: "var(--font-display)",
                }}
              >
                05.
              </span>{" "}
              Diversidade & cultura
            </div>
            <h2
              className="bl-display m-0 mb-8"
              style={{
                fontSize: "clamp(40px, 4.6vw, 68px)",
                lineHeight: 1.05,
                color: "var(--color-bl-bg)",
              }}
            >
              Uma cidade que{" "}
              <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
                nunca para
              </span>
              <br />
              de surpreender.
            </h2>
            <p
              className="m-0 mb-4 text-[17px] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              No Carnaval, a cidade carrega memórias que misturam ritmos africanos e influências
              cariocas. Foi aqui que nasceu, em{" "}
              <strong style={{ color: "var(--color-bl-bg)" }}>1934</strong>, a{" "}
              <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
                Turunas do Riachuelo
              </span>{" "}
              — a primeira escola de samba de Minas Gerais e a quarta do Brasil.
            </p>
            <p
              className="m-0 text-[17px] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Desde <strong style={{ color: "var(--color-bl-bg)" }}>1977</strong>, Juiz de Fora é
              palco do{" "}
              <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
                Miss Brasil Gay
              </span>
              , marco para a cultura LGBTQIAPN+ no país. Com suas cores, performances e celebração
              da pluralidade, o evento tornou-se símbolo de respeito e inclusão.
            </p>
          </div>
        </div>

        <div
          className="border-t pt-14 text-center"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <p
            className="m-0 mb-6 italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 1.8vw, 26px)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Prepare-se para se surpreender a cada visita.
          </p>
          <h3
            className="bl-display m-0 mb-8"
            style={{
              fontSize: "clamp(48px, 6.4vw, 96px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--color-bl-bg)",
            }}
          >
            Bem-vindo a{" "}
            <span style={{ color: "var(--color-bl-accent2)", fontStyle: "italic" }}>
              Juiz de Fora
            </span>
            !
          </h3>
          <div className="inline-flex flex-wrap justify-center gap-3">
            <Link to="/roteiros" className="bl-btn">
              Planejar viagem <ArrowRight size={14} />
            </Link>
            <Link
              to="/atrativos"
              className="bl-btn-ghost"
              style={{ color: "var(--color-bl-bg)", borderColor: "rgba(255,255,255,0.25)" }}
            >
              Explorar atrativos <Compass size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
