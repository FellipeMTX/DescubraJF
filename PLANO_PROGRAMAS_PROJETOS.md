# Plano — Páginas de Programas e Projetos

Plano modularizado para implementar as 4 referências de design (Edital de Fomento, Praça Cervejeira, Caminhando pela História, Educatur) priorizando reuso de componentes.

---

## 1. Estado atual

- **Rota detalhe**: `/secretaria/programas-e-projetos/:slug` → `src/pages/secretaria/PostDetail.tsx`
- **Modelo de dados**: `Post` em `src/types/database.ts` — campos genéricos (`titulo`, `resumo`, `conteudo_html`, `imagem_capa`, `autor`). Hoje renderiza HTML cru.
- **Tema visual atual**: paleta terracota quente (`--color-bl-bg #f7eee2`, `--color-bl-ink #241510`, `--color-bl-accent #b8482e`).
- **Componentes já prontos** que podemos reusar: `PageHeader`, `SectionHeader`, `AspectImage`, `HeroBanner`, `Gallery`, `Skeleton`, `dialog`, `button`, `card`.

---

## 2. Decisões fechadas

- **D1 — Tema**: subtema verde só nas páginas de Programas. Adiciona `--color-bl-prog-*` em `src/index.css` e aplica via wrapper `bl-prog`. Resto do site fica terracota.
- **D2 — Modelo de dados**: hardcoded — um arquivo `.tsx` por programa em `pages/secretaria/programas/`. Admin segue editando `Post` só pra metadados (slug, publicado, capa). Refator pra JSON quando o padrão estabilizar.
- **D3 — Rota**: manter `/secretaria/programas-e-projetos/:slug`. Router faz lookup slug→componente; cai no `PostDetail` antigo se slug não estiver mapeado (compatibilidade).
- **D4 — MVP**: somente **Praça Cervejeira**. Demais páginas entram em fases seguintes.

---

## 3. Inventário de blocos compartilhados

Cada bloco vira **um arquivo** em `src/components/programa/`. Coluna "imgs" mostra em quais das 4 referências o bloco aparece. Blocos marcados com ⭐ entram no MVP (Praça Cervejeira); o resto fica para fases seguintes.

| Bloco | MVP | Imgs | Arquivo | Props principais |
| --- | --- | --- | --- | --- |
| `BreadcrumbPill` | ⭐ | 1,2,3,4 | `BreadcrumbPill.tsx` | `to`, `label` |
| `ProgramHero` | ⭐ | 1,2,3,4 | `ProgramHero.tsx` | `title`, `description?`, `meta[]` (`{icon, label}`), `image`, `primaryCta`, `secondaryCta?`, `quoteOverlay?` |
| `HeroQuoteOverlay` | | 1 | `HeroQuoteOverlay.tsx` | `icon`, `text` (filho de `ProgramHero` via prop) |
| `HighlightsBar` | ⭐ | 1,2,3,4 | `HighlightsBar.tsx` | `items[]` (`{icon, title, description}`) — render 4-up horizontal pill |
| `TextWithSide` | ⭐ | 1,2,3,4 | `TextWithSide.tsx` | `title`, `paragraphs[]`, `side: <ReactNode>` (variantes: imagem ou card) |
| `KeyPointsCard` | | 1 | `KeyPointsCard.tsx` | `items[]` (`{icon, title, description}`) — usado como `side` do `TextWithSide` |
| `IconCardGrid` | ⭐ | 2 | `IconCardGrid.tsx` | `items[]`, `columns?` — cards compactos (ícone+título+desc) |
| `PlaceCards` | ⭐ | 2,3,4 | `PlaceCards.tsx` | `items[]` (`{image, icon?, title, description}`), `extra?` (slot pra card "Fique por dentro") |
| `StatsRow` | | 1,4 | `StatsRow.tsx` | `items[]` (`{icon, value, label, description?}`) |
| `TimelineSteps` | | 1,3,4 | `TimelineSteps.tsx` | `steps[]` (`{icon, title, description}`) — auto-numerado, com linha tracejada |
| `Gallery` | | 3 | já existe (`@/components/ui/Gallery.tsx`) | reuso direto |
| `BottomCTAStrip` | ⭐ | 1,2,3,4 | `BottomCTAStrip.tsx` | `title`, `description?`, `primaryCta`, `secondaryCta?`, `watermark?` |
| `SectionTitle` | ⭐ | todos | `SectionTitle.tsx` | `title`, `underlineColor?` — H2 com sublinhado fino |

**Total MVP**: 8 blocos novos + `ProgramaLayout` (wrapper) = 9 arquivos novos para Praça Cervejeira.

---

## 4. Estrutura de pastas proposta

```text
src/
├── components/
│   └── programa/                    ← novo, todos os blocos compartilhados
│       ├── BreadcrumbPill.tsx       ⭐ MVP
│       ├── ProgramHero.tsx          ⭐ MVP
│       ├── HeroQuoteOverlay.tsx
│       ├── HighlightsBar.tsx        ⭐ MVP
│       ├── TextWithSide.tsx         ⭐ MVP
│       ├── KeyPointsCard.tsx
│       ├── IconCardGrid.tsx         ⭐ MVP
│       ├── PlaceCards.tsx           ⭐ MVP
│       ├── StatsRow.tsx
│       ├── TimelineSteps.tsx
│       ├── BottomCTAStrip.tsx       ⭐ MVP
│       └── SectionTitle.tsx         ⭐ MVP
└── pages/
    └── secretaria/
        ├── PostDetail.tsx           ← mantém pra notícias e fallback
        └── programas/                ← novo
            ├── ProgramaLayout.tsx   ⭐ MVP — wrapper c/ breadcrumb + bl-prog
            ├── PracaCervejeira.tsx  ⭐ MVP
            ├── EditalFomento.tsx
            ├── CaminhandoHistoria.tsx
            └── Educatur.tsx
```

**Roteamento**: substituir a entrada genérica `programa_projeto` por um mapa slug→componente em `routes.tsx`:

```tsx
const PROGRAM_PAGES: Record<string, React.LazyExoticComponent<…>> = {
  "edital-de-fomento-ao-turismo": lazy(() => import("./pages/secretaria/programas/EditalFomento")),
  "praca-cervejeira": lazy(() => import("./pages/secretaria/programas/PracaCervejeira")),
  …
};
```

E uma página `ProgramaLoader` que faz `useParams() → lookup → render`. Se slug não existir no mapa, cai no `PostDetail` antigo (compatibilidade com posts antigos do banco).

---

## 5. Tema visual (subtema "verde")

Adicionar em `src/index.css` dentro de `@theme`:

```css
--color-bl-prog-bg:      #F7F2E8;   /* cream off-white */
--color-bl-prog-ink:     #1B3D2F;   /* deep forest */
--color-bl-prog-accent:  #2E6F4E;   /* primary green */
--color-bl-prog-soft:    #E2EBD3;   /* sage icon bg */
--color-bl-prog-card:    #F3EDDE;   /* cream card */
--color-bl-prog-cta-bg:  #1F3A2E;   /* CTA dark strip */
--color-bl-prog-cta-yellow: #F1C56A; /* botão amarelo do CTA */
```

Wrapper raiz: `<div className="bl-prog">…</div>` aplica fundo + cor de texto + tipografia. Restante do site continua no tema terracota.

---

## 6. Modelo de dados

Decisão fechada em D2 — sem mudar schema. `Post` continua igual; apenas a renderização do detalhe muda quando o `slug` corresponde a um programa mapeado.

- Não muda tabela `posts` nem tipos em `database.ts`.
- Cada arquivo em `pages/secretaria/programas/` traz o conteúdo inline (textos, listas de highlights, lugares, etc.).
- Admin continua editando `Post` só pra **metadados** (título, slug, imagem de capa pra listagem, `publicado`).
- Listagem (`/secretaria/programas-e-projetos`) puxa do banco como hoje — nada muda lá.
- Quando o padrão estabilizar e mais 3-4 programas existirem, dá pra refatorar pra `secoes jsonb` com editor no admin.

---

## 7. Fases de implementação

### Fase 1 — Fundação MVP

1. Adicionar tokens do tema verde (`--color-bl-prog-*`) em `src/index.css` + classe `.bl-prog`.
2. Criar `src/components/programa/` com **8 blocos MVP** (marcados ⭐ na tabela da seção 3): `BreadcrumbPill`, `ProgramHero` (sem `quoteOverlay`), `HighlightsBar`, `TextWithSide`, `IconCardGrid`, `PlaceCards`, `BottomCTAStrip`, `SectionTitle`. Cada um com props mínimas e markup pixel-fiel ao design.
3. Criar `ProgramaLayout` (wrapper que aplica `bl-prog` + monta breadcrumb).

### Fase 2 — Praça Cervejeira ponta-a-ponta

1. Criar `PracaCervejeira.tsx` compondo os blocos da Fase 1 com conteúdo inline.
2. Adicionar `ProgramaLoader` em `routes.tsx` com mapa slug→componente; fallback para `PostDetail` quando slug não estiver mapeado.
3. Validar tipografia, espaçamentos, responsividade (mobile/tablet/desktop).
4. Garantir que listagem `/secretaria/programas-e-projetos` ainda funciona e linka pra cá.

### Fase 3 — Demais páginas (cada uma traz blocos novos)

1. **Edital de Fomento** — exige `HeroQuoteOverlay`, `KeyPointsCard`, `StatsRow`, `TimelineSteps`.
2. **Caminhando pela História** — exige variante de título escuro no `ProgramHero` + `PlaceCards` com overlay de ícone + `Gallery` (já existe).
3. **Educatur** — exige `PlaceCards` em grid 7-up + reuso de `StatsRow` e `TimelineSteps`.

### Fase 4 — Polish

1. Animações `reveal` (já existe `.reveal`/`.reveal-stagger` no `index.css`).
2. i18n: extrair strings hardcoded pros arquivos de tradução.
3. Imagens reais via Supabase Storage / Cloudflare R2 (ver memória [[project_storage_migration]]).

---

## 8. Riscos e notas

- **Hero "Caminhando pela História"**: o título é preto/escuro, não verde — `ProgramHero` precisa aceitar `titleColor?` como prop ou variant. Já planejado pra Fase 3.
- **Quote overlay (imagem 1)**: posicionamento absoluto sobre a imagem do hero — precisa testar como se comporta em mobile (provavelmente vira card abaixo da imagem). Fica pra Fase 3.
- **PlaceCards x IconCardGrid**: cuidado pra não criar duas coisas parecidas; revisar depois do MVP se podem virar um componente só com flag `withImage`.
- **Timeline mobile**: layout horizontal não cabe em <768px — vira coluna vertical com linha à esquerda. Atenção na Fase 3.
- **Listagem ainda usa o tema terracota**: só o detalhe muda para verde. Listagem pode receber redesign próprio em fase futura.

---

## 9. Próximo passo concreto

Começar Fase 1: adicionar tokens do tema verde no `index.css` e criar os 8 blocos MVP em `src/components/programa/`, cada um com markup pixel-fiel ao design e props mínimas. **Aguardar OK explícito** antes de escrever código — quero confirmar a paleta verde proposta na seção 5 (`#1B3D2F / #2E6F4E / #E2EBD3 / ...`) bate com o que o designer enviou, ou se ele tem hex exatos pra usar.
