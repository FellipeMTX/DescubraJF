import { Link } from "react-router";

const FOOTER_COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    title: "História",
    links: [{ label: "Ir para História", href: "/juiz-de-fora/historia" }],
  },
  {
    title: "O que Fazer",
    links: [
      { label: "Atrativos", href: "/atrativos" },
      { label: "Roteiros", href: "/roteiros" },
      { label: "Agenda", href: "/agenda" },
    ],
  },
  {
    title: "Onde Comer",
    links: [{ label: "Estabelecimentos", href: "/onde-comer" }],
  },
  {
    title: "Onde Ficar",
    links: [{ label: "Hospedagens", href: "/onde-ficar" }],
  },
  {
    title: "Serviços",
    links: [
      { label: "Institucional", href: "/servicos" },
      { label: "A Gente Se Vê Por Aí", href: "/passeios" },
      { label: "Contato", href: "/contato" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="px-14 pt-20 pb-10"
      style={{ background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-black/10 pb-14 md:grid-cols-5">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest">
                {col.title}
              </div>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="mb-2 block text-[13px] transition-colors hover:text-[var(--color-bl-ink)]"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center pt-12">
          <a
            href="https://www.pjf.mg.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/LogoSeturColor.png"
              alt="Secretaria de Turismo - Prefeitura de Juiz de Fora"
              className="h-20 object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
