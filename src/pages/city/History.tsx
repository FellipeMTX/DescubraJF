import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { year: "1703", text: "Início do Caminho Novo, ligando Minas ao Rio e impulsionando o surgimento de povoados como Santo Antônio do Paraibuna." },
  { year: "1853", text: "Elevação de Santo Antônio do Paraibuna à categoria de cidade; contratação de técnicos europeus para a Estrada União e Indústria." },
  { year: "1856", text: "Chegada de 20 artífices europeus para colaborar na construção da estrada." },
  { year: "1857", text: "Chegada de 1.162 imigrantes alemães, formando um núcleo colonial na região." },
  { year: "1861", text: "Visita de Dom Pedro II à cidade; construção do palacete por Manoel do Vale Amado." },
  { year: "1865", text: "Santo Antônio do Paraibuna recebe o nome de Juiz de Fora." },
  { year: "1890", text: 'Construção do "Castelinho", sede da Companhia Mineira de Eletricidade.' },
  { year: "1907", text: "Palacete da Santa Mafalda se transforma no Primeiro Grupo Escolar." },
  { year: "1915", text: "O Museu Mariano Procópio é fundado por Alfredo Ferreira Lage." },
  { year: "1929", text: "Inauguração do Cine-Theatro Central com estilo arquitetônico eclético." },
  { year: "1934", text: "Fundação da escola de samba Turunas do Riachuelo." },
  { year: "1977", text: "Criação do Concurso Miss Gay Brasil, marco na cultura LGBTQIAPN+." },
  { year: "2023", text: "Reabertura do palacete restaurado; celebração da história arquitetônica e cultural da cidade." },
];

export default function History() {
  return (
    <div className="min-h-screen bg-primary-50 pt-20">
      {/* Hero */}
      <section className="bg-primary-700 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold text-accent-50 md:text-5xl">História</h1>
          <p className="mt-4 text-lg text-primary-200">
            A trajetória de uma cidade que nunca parou de se reinventar
          </p>
        </div>
      </section>

      {/* Intro */}
      <HistorySection>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-primary-700">
            Se você acha que já viu de tudo em uma cidade, é porque ainda não conhece Juiz de Fora.
          </p>
          <p className="mt-4 leading-relaxed text-primary-700">
            No coração da Zona da Mata mineira, ela surpreende pelo espírito <strong>pioneiro</strong>, pela <strong>história vibrante</strong> e pela capacidade única de se <strong>reinventar</strong>.
          </p>
          <p className="mt-4 leading-relaxed text-primary-700">
            Foi aqui que a América Latina testemunhou a <strong>primeira transmissão de TV aberta</strong> e onde Bernardo Mascarenhas fez história com a <strong>primeira usina hidrelétrica</strong> destinada à <strong>iluminação pública</strong> no continente.
          </p>
          <p className="mt-4 leading-relaxed text-primary-700">
            No final do século XIX, Juiz de Fora ganhou o título de <strong>"Manchester Mineira"</strong>, graças às suas fábricas têxteis que projetaram a cidade entre as mais promissoras do Brasil.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl shadow-lg">
          <img src="/PacoMunicipal-01.webp" alt="Antigo Paço Municipal" className="w-full object-cover" />
          <p className="bg-primary-100 px-4 py-2 text-center text-xs text-primary-600">
            Antigo Paço Municipal — Atual Secretaria Especial de Igualdade Racial
          </p>
        </div>
      </HistorySection>

      {/* Gastronomia + transição */}
      <HistorySection dark>
        <div className="mx-auto max-w-3xl">
          <p className="leading-relaxed text-primary-100">
            E se história não fosse suficiente, há também muito sabor: Juiz de Fora entrou para o livro dos recordes com a <strong className="text-accent-50">maior fritada de torresmo do mundo</strong> servido em um único evento, só uma amostra do que a nossa deliciosa gastronomia mineira tem a oferecer.
          </p>
          <p className="mt-4 leading-relaxed text-primary-100">
            Do Museu Mariano Procópio ao Cine-Theatro Central, passando pelo Mirante do Morro do Imperador e pelo Parque Halfeld, cada canto da cidade revela <strong className="text-accent-50">experiências</strong> que unem tradição e inovação.
          </p>
          <p className="mt-6 text-center text-xl font-bold text-accent-50">
            Juiz de Fora é plural, criativa e diversa.
          </p>
        </div>
      </HistorySection>

      {/* Timeline */}
      <section className="bg-accent-100 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary-800">Linha do Tempo</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-primary-300 md:left-1/2 md:block" />

            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} year={item.year} text={item.text} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* De Povoado a Cidade */}
      <HistorySection
        title="De Povoado a Cidade: O Nome Juiz de Fora"
        image="/HotelAvenida-02.webp"
        imageCaption="Fonte: Arquivo Alberto Surerus Moutinho, 1928"
        imagePosition="right"
      >
        <p className="leading-relaxed text-primary-700">
          Juiz de Fora não nasceu por acaso. Sua história começa por volta de 1703, com a abertura do Caminho Novo, uma rota estratégica entre Minas Gerais e o Rio de Janeiro, criada para escoar o ouro e controlar o recolhimento de impostos pela Coroa Portuguesa.
        </p>
        <p className="mt-4 leading-relaxed text-primary-700">
          Ao longo dessa estrada surgiram diversos povoados, entre eles Santo Antônio do Paraibuna — que viria a se tornar uma das cidades pioneiras de Minas Gerais. Em 1853 foi elevado à categoria de cidade e, doze anos depois, recebeu seu nome definitivo: <strong>Juiz de Fora</strong>.
        </p>
        <p className="mt-4 leading-relaxed text-primary-700">
          E sim, havia mesmo um "juiz de fora"! No período colonial, eram nomeados magistrados de outras regiões para evitar favoritismos locais. A expressão pegou e acabou batizando a cidade.
        </p>
      </HistorySection>

      {/* A Chegada dos Imigrantes */}
      <HistorySection
        title="A Chegada dos Imigrantes"
        image="/Chegada-imigrantes-03.webp"
        imageCaption="Fonte: Arquivo Central da UFJF"
        imagePosition="left"
        dark
      >
        <p className="leading-relaxed text-primary-100">
          Com a cidade em pleno desenvolvimento, a <strong className="text-accent-50">construção da Estrada União e Indústria</strong>, idealizada por Mariano Procópio Ferreira Lage, impulsionaria ainda mais o seu crescimento. Considerada uma das primeiras rodovias modernas da América Latina, ligava Juiz de Fora a Petrópolis.
        </p>
        <p className="mt-4 leading-relaxed text-primary-100">
          Em 1857, chegaram <strong className="text-accent-50">1.162 imigrantes alemães</strong>, número equivalente a cerca de 20% da população local. Instalaram-se nos atuais bairros São Pedro, Borboleta e Fábrica. Com o tempo, migraram para a vida urbana como operários, marceneiros e carroceiros, integrando-se à cidade e à Companhia União e Indústria.
        </p>
      </HistorySection>

      {/* Manchester Mineira */}
      <HistorySection
        title="A Manchester Mineira e a Revolução Energética"
        image="/ManchesterMineira-05.webp"
        imageCaption="Fonte: Prefeitura de Juiz de Fora"
        imagePosition="right"
      >
        <p className="leading-relaxed text-primary-700">
          Juiz de Fora conquistou o <strong>título de "Manchester Mineira"</strong> no final do século XIX, em referência à cidade inglesa símbolo da Revolução Industrial. O apelido refletia o importante papel no desenvolvimento industrial de Minas Gerais, impulsionado pelas indústrias têxteis.
        </p>
        <p className="mt-4 leading-relaxed text-primary-700">
          <strong>Bernardo Mascarenhas</strong>, empreendedor visionário, fundou em 1888 a Companhia Mineira de Eletricidade e construiu a <strong>Usina de Marmelos</strong> — a primeira da América Latina a fornecer energia elétrica para iluminação pública.
        </p>
        <p className="mt-4 leading-relaxed text-primary-700">
          O antigo prédio da Fábrica Têxtil foi revitalizado e hoje integra o <strong>Complexo Mascarenhas</strong>, onde tradição e inovação se encontram no Centro Cultural Bernardo Mascarenhas e no Mercado Municipal — reinaugurado em 2025 com novos espaços gastronômicos e galeria de arte.
        </p>
      </HistorySection>

      {/* Arquitetura */}
      <HistorySection
        title="Arquitetura e Personagens que Moldaram a Cidade"
        image="/arq-07.webp"
        imageCaption="Fonte: Cristina Bitarello, 2024"
        imagePosition="left"
        dark
      >
        <p className="leading-relaxed text-primary-100">
          Caminhar pelas ruas de Juiz de Fora é como folhear um <strong className="text-accent-50">livro de memórias</strong>. O <strong className="text-accent-50">Palacete Santa Mafalda</strong>, construído na década de 1850 para presentear Dom Pedro II, foi transformado em escola e restaurado em 2023.
        </p>
        <p className="mt-4 leading-relaxed text-primary-100">
          O <strong className="text-accent-50">"Castelinho"</strong>, erguido em 1890, impressiona com sua arquitetura medieval. Alfredo Ferreira Lage transformou a Villa da família no Museu Mariano Procópio. O paisagista francês Auguste Glaziou imprimiu o charme dos jardins ingleses ao parque.
        </p>
        <p className="mt-4 leading-relaxed text-primary-100">
          Até <strong className="text-accent-50">Cândido Portinari</strong> deixou sua marca com dois painéis públicos na fachada do Edifício Clube Juiz de Fora. E o <strong className="text-accent-50">Cine-Theatro Central</strong>, inaugurado em 1929, segue sendo palco de grandes espetáculos.
        </p>
      </HistorySection>

      {/* Final */}
      <HistorySection title="Uma Cidade que Nunca Para de Surpreender">
        <p className="leading-relaxed text-primary-700">
          No Carnaval, a cidade carrega memórias que misturam ritmos africanos e influências cariocas. Foi aqui que nasceu, em 1934, a <strong>Turunas do Riachuelo</strong> — a primeira escola de samba de Minas Gerais e a quarta do Brasil.
        </p>
        <p className="mt-4 leading-relaxed text-primary-700">
          Desde 1977, Juiz de Fora é palco do <strong>Miss Brasil Gay</strong>, marco para a cultura LGBTQIAPN+ no país. Com suas cores, performances e celebração da pluralidade, o evento tornou-se símbolo de respeito e inclusão.
        </p>
        <p className="mt-6 text-center text-xl font-bold text-primary-800">
          Prepare-se para se surpreender a cada visita.
        </p>
        <p className="mt-2 text-center text-2xl font-bold text-primary-600">
          BEM-VINDO A JUIZ DE FORA!
        </p>
      </HistorySection>
    </div>
  );
}

/* ─── Sub-components ─── */

function HistorySection({
  title,
  image,
  imageCaption,
  imagePosition,
  dark,
  children,
}: {
  title?: string;
  image?: string;
  imageCaption?: string;
  imagePosition?: "left" | "right";
  dark?: boolean;
  children: React.ReactNode;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);

  return (
    <section ref={ref} className={cn("py-16", dark ? "bg-primary-700" : "bg-primary-50")}>
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          {title && (
            <h2 className={cn("mb-8 text-2xl font-bold md:text-3xl", dark ? "text-accent-50" : "text-primary-800")}>
              {title}
            </h2>
          )}

          {image ? (
            <div className={cn("flex flex-col gap-8 md:flex-row md:items-start", imagePosition === "left" && "md:flex-row-reverse")}>
              <div className="flex-1">{children}</div>
              <div className="w-full shrink-0 md:w-80">
                <img src={image} alt={title ?? ""} className="w-full rounded-2xl object-cover shadow-lg" />
                {imageCaption && (
                  <p className={cn("mt-2 text-center text-xs", dark ? "text-primary-300" : "text-accent-500")}>
                    {imageCaption}
                  </p>
                )}
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ year, text, index }: { year: string; text: string; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.2);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={cn(
        "mb-8 flex items-start transition-all duration-600 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        "md:justify-center"
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className={cn("flex w-full items-start gap-4 md:w-5/12", isEven ? "md:flex-row-reverse md:text-right" : "md:ml-auto")}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-accent-50 shadow">
          {year.slice(2)}
        </div>
        <div className="flex-1">
          <span className="text-lg font-bold text-primary-800">{year}</span>
          <p className="mt-1 text-sm leading-relaxed text-primary-700">{text}</p>
        </div>
      </div>
    </div>
  );
}
