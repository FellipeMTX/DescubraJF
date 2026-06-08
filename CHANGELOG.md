# Descubra Juiz de Fora - Changelog de Desenvolvimento

> Este documento registra cada etapa do desenvolvimento do projeto.
> Cada entrada documenta **o que** foi feito, **por que** foi feito e **quais decisões** foram tomadas.

---

## [2026-06-08] Home: "Sabores das Geraes" como cards de estabelecimentos

### O que foi feito
- **Seção de gastronomia da home** ([src/components/sections/HomeDining.tsx](src/components/sections/HomeDining.tsx)): reescrita para seguir a mesma estrutura das seções 01/02 (Atrativos/Hospedagem) — cabeçalho em duas colunas no topo (título à esquerda, descrição + botão à direita) em vez do antigo layout de sidebar *sticky*. Os antigos *tiles* de categoria deram lugar a **3 cards de estabelecimento**, cada um com badge de categoria, imagem (`AspectImage` com placeholder) e rodapé com número + nome + bairro com ícone de pin.
- **Fonte de dados**: passou de `useDiningCategories` para `useDiningEstablishments` (os 3 primeiros ativos por `ordem`).
- **Dedup por marca**: helper `pickDistinctBrands` mantém só um estabelecimento por marca (chave = 2 primeiras palavras do nome), evitando repetir redes multiunidade (ex.: 3× "Aceite Forneria", 2× "Berttu's Restaurante") na home.
- **i18n** (PT/EN/ES): `home.dining.cta` → "Ver todos os estabelecimentos", `empty` agora fala de estabelecimentos e a chave órfã `metaLabel` foi removida.

### Por que foi feito
Alinhar a seção ao design de referência (mesma linguagem visual das demais seções da home) e mostrar estabelecimentos reais em destaque, com variedade de marcas.

### Decisões técnicas
- **Sem campo de nota**: o print de referência mostrava uma avaliação (★), mas `estabelecimentos_gastronomia` não tem esse campo — o pill foi omitido em vez de inventar dado.
- **Dedup só na home**: a página `/onde-comer` continua listando todas as unidades (são listagens reais com endereços distintos); a deduplicação por marca vale apenas para o teaser.
- **Imagem real com placeholder**: usa `imagem_destaque` (com fallback de placeholder), em vez das ilustrações decorativas do mockup.

### Próximos passos
- (Opcional) modelar "marca/rede" no schema caso se queira agrupar unidades de forma robusta, em vez da heurística por nome.

## [2026-06-08] Rodapé, eventos em andamento e atrativos (parágrafos + múltiplas categorias)

### O que foi feito
- **Rodapé** ([src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)): redesenhado e passou a ser dirigido por `NAV_ITEMS` (mesma fonte da navbar). O tipo `NavItem` foi exportado de `constants.ts` e reutilizado no `Header`. Layout com o selo da Prefeitura/Setur ao lado das colunas de links e a frase do CADASTUR como nota de rodapé (chave `footer.cadastur` em PT/EN/ES). Removidas as chaves órfãs `footer.columns`/`footer.links` e `common.siteDescription`.
- **Home / eventos** ([src/hooks/useEvents.ts](src/hooks/useEvents.ts)): `useUpcomingEvents` passou a considerar `data_fim`, exibindo eventos **em andamento** (que ainda não terminaram) além dos futuros.
- **Descrição em parágrafos**: novo componente [src/components/ui/DescriptionText.tsx](src/components/ui/DescriptionText.tsx) divide a descrição em parágrafos com espaçamento (tratando inclusive texto legado *hard-wrapped*), aplicado nos modais de atrativos, hospedagem e gastronomia.
- **Múltiplas categorias por atrativo**: coluna `categoria_ids[]` ([supabase/add-experiencia-multi-categoria.sql](supabase/add-experiencia-multi-categoria.sql)). Os hooks de experiências resolvem as categorias num só lugar; novo [src/components/ui/CategoryPills.tsx](src/components/ui/CategoryPills.tsx) renderiza N badges (card, modal e admin); o admin troca o `select` único por chips de múltipla seleção.

### Por que foi feito
Ajustes de UX solicitados (rodapé alinhado à navbar, eventos mais fiéis ao que está acontecendo, descrição legível em parágrafos) e suporte a atrativos que pertencem a mais de uma categoria.

### Decisões técnicas
- Rodapé e navbar compartilham `NAV_ITEMS` para nunca dessincronizar.
- Categorias múltiplas via **coluna array** (Opção A), sem tabela de junção: resolução client-side a partir das categorias já carregadas, com `categoria_id` mantido como categoria principal/legado.
- `DescriptionText` detecta blocos *hard-wrapped* por comprimento de linha e os rejunta, quebrando parágrafo apenas em linhas curtas.

### Próximos passos
- Cadastrar 2+ categorias nos atrativos pelo /admin conforme necessário.

## [2026-06-03] Página de Roteiro editável (layout rico) + admin

### O que foi feito
- **Página pública de roteiro** ([src/pages/routes/RouteDetail.tsx](src/pages/routes/RouteDetail.tsx)) reescrita para um layout editorial rico e fiel ao design de referência: hero (eyebrow, título serifado com palavra em itálico, subtítulo, descrição, CTAs), barra de até 6 estatísticas, seção "Sobre" (texto + card de bullets), cards de "Destaques", seção de mapa (embed Google) + card de "Dicas" e CTA final. Cada seção é condicional — roteiros sem `layout` degradam para hero + mapa.
- **Componentes novos** em [src/components/roteiro/](src/components/roteiro/): `RoteiroHero`, `RoteiroStats`, `RoteiroInfoCard`, `RoteiroMap`. Reusam os componentes `programa/*` (`SectionTitle`, `TextWithSide`, `BottomCTAStrip`, `PlaceCards`) no **mesmo tema verde dos Programas** (`.bl-prog`), sem duplicar componentes.
- **Admin** ([src/pages/admin/RouteAdmin.tsx](src/pages/admin/RouteAdmin.tsx) + [src/components/admin/roteiro/](src/components/admin/roteiro/)): formulário por seções (hero, stats, sobre, destaques, mapa & dicas, CTA) com seletor de ícones compacto (`IconField`), listas repetíveis (`RepeatableList`) e upload de imagem por destaque. Grava o conteúdo em `roteiros.layout` (jsonb) e sincroniza os destaques em `roteiro_pontos`.
- **Modelo de dados**: coluna `roteiros.layout` (jsonb) + colunas `roteiro_pontos.imagem`/`.local`. Migração idempotente em [supabase/add-roteiro-layout.sql](supabase/add-roteiro-layout.sql) (cria a tabela se faltar, RLS, recarrega o cache do PostgREST). Seed de referência em [supabase/seed-roteiro-compras.sql](supabase/seed-roteiro-compras.sql).
- **Ícones**: `ICONS` de [src/components/ui/IconPicker.tsx](src/components/ui/IconPicker.tsx) exportado e ampliado (`clock`, `footprints`, `shopping-cart`, `sparkles`, `map`, `tag`, `gem`).
- **i18n**: novas chaves `routes.detail.*` em PT/EN/ES.

### Por que foi feito
Entregar o redesign de Roteiros (próximo passo do ciclo anterior) com um layout fixo e fiel ao design, mas com todo o conteúdo editável por roteiro no /admin — sem hardcode por página.

### Decisões técnicas
- **Mesmo tema dos Programas**: a página de roteiro usa o tema `.bl-prog` (paleta verde + tokens `--color-bl-prog-*`) e reaproveita os componentes `programa/*`, padronizando tipografia e cores entre Roteiros e Programas/Projetos.
- **JSONB + `roteiro_pontos`**: blocos do conteúdo em `layout` (jsonb); destaques (que também viram marcadores) na tabela `roteiro_pontos`, sincronizados por delete+insert no save.
- **Título do hero**: Space Grotesk em caixa-alta (mesmo padrão dos Programas), com a palavra de destaque no acento verde.
- **Mapa**: embed do Google My Maps; `RoteiroMap` normaliza URLs `viewer`/`edit` → `embed` (o Google bloqueia os dois primeiros em iframe).
- **Robustez**: `ImageUploadField` ganhou cleanup de blob URL e `RepeatableList` usa chave estável (evita preview trocado ao reordenar destaques).

### Próximos passos
- Preencher o `layout` dos roteiros existentes via /admin.
- (Opcional) extrair `HeroStat`/`CategoryChip`/`ScrollArrow` para módulo compartilhado em `src/components/listing/`.

---

## [2026-05-26] Redesign Atrativos, Onde Comer e Onde Ficar

### O que foi feito
- **Atrativos** ([src/pages/experiences/ExperienceList.tsx](src/pages/experiences/ExperienceList.tsx))
  - Hero full-bleed com `atrativosBanner.png` ocupando largura total da página
  - Stats card flutuante (3 cols: Atrativos · Categorias · Gratuitos) sobreposto ao banner em estilo glass-morphism escuro
  - Strip horizontal de chips de categoria com ícones (`getIconByName(cat.icone)`), setas de scroll funcionais e fade entre hero e conteúdo
  - Removido `PageHeader`, `StatsStrip` antigo, `FilterChips` (filtro duplicado), kicker, subtítulo e CTA do hero
- **Onde Comer** ([src/pages/dining/DiningList.tsx](src/pages/dining/DiningList.tsx)) — mesmo padrão usando `ondeComerBanner1.png`, stats 3 cols (Estabelecimentos · Categorias · Bairros), chips com ícones do banco
- **Onde Ficar** ([src/pages/lodging/LodgingList.tsx](src/pages/lodging/LodgingList.tsx)) — mesmo padrão usando `ondeFicarBanner1.png`, stats 3 cols (Hospedagens · Tipos · Bairros), chips com ícones mapeados por tipo (`Hotel`, `BedDouble`, `Users`, `Building2`)
- **Limpeza de assets** — removidas 14 imagens não usadas em [public/](public/): `DescubraHorizontalPretoSF.png`, `logoTurBranco.png`, `Foto 1/3/5/6/8.jpg`, `Linha do tempo_ 1936.jpg`, `OndeFicarBanner.jpeg`, `atrativosBanner.jpeg`, `icons.svg`, `ChegadaImigrantes-04.webp`, `ManchesterMineira-05.webp`, `ManschesterMineira-06.webp`
- **i18n** — novas chaves `experiences.list.exploreCta/exploreKicker/featuredCatsTitle/featuredCatsHighlight` e `dining.list.stats.hoodsEm/hoodsLabel` em PT/EN/ES

### Por que foi feito
Padronizar visualmente as três páginas de listagem (Atrativos, Onde Comer, Onde Ficar) seguindo o mesmo design system editorial do redesign anterior (Agenda e Onde Ficar). O hero full-bleed com stats overlay e chips horizontais navegáveis ficou validado nessa iteração e foi replicado para garantir consistência entre as listagens.

### Decisões técnicas
- **HeroStat horizontal**: ícone à esquerda + texto à direita (revertido de uma tentativa vertical que não agradou). Em telas `< 640px` o ícone some pra economizar espaço; sublabel some no mobile pelo mesmo motivo
- **Sempre 3 colunas** no stats card (sem stacking em mobile); padding, gap, ícone e fonts usam `clamp()` ou breakpoints `max-md`/`max-sm` para escalar
- **Card 15% menor** que a versão inicial (`max-w-5xl` → `max-w-4xl`, `rounded-3xl` → `rounded-2xl`, `p-6` → `p-5`, ícones `26` → `22`)
- **Filtro único por categoria**: removido o `FilterChips` antigo, mantido apenas o strip horizontal com ícones — evita confusão visual de dois filtros redundantes
- **Setas de scroll funcionais** com `useEffect` + `ResizeObserver` + scroll listener gerenciando `canScrollLeft`/`canScrollRight`; sem fade overlay (criava blob visível atrás do botão)
- **Lodging sem categorias no DB**: chips usam `TYPE_ICON_MAP` hardcoded já que os tipos (`hotel`, `pousada`, `hostel`, `flat`) são fixos no schema

### Próximos passos
- Aplicar o mesmo padrão de redesign em Roteiros
- Considerar mover o componente `HeroStat` + `CategoryChip` + `ScrollArrow` para um shared module em `src/components/listing/` para evitar duplicação entre as 3 páginas

---

## [2026-05-14] Redesign Agenda e Onde Ficar

### O que foi feito
- **Agenda** ([src/pages/events/EventList.tsx](src/pages/events/EventList.tsx))
  - Novo carrossel rotativo de destaques ([src/components/events/EventFeaturedCarousel.tsx](src/components/events/EventFeaturedCarousel.tsx)) — usa eventos com `destaque=true` (fallback para 4 próximos eventos)
  - Toggle Lista/Calendário ao lado dos filtros
  - Nova view de calendário ([src/components/events/EventCalendar.tsx](src/components/events/EventCalendar.tsx)) — grid 7×6, foto + título nos dias com 1 evento, lista compacta com 2+, legenda de categorias, painel de eventos do dia selecionado
  - Eventos multi-dia ≤ 7 dias renderizam card cheio em todos os dias; > 7 dias apenas no dia de início + barra compacta nos seguintes
  - Contador italic accent ao lado do nome do mês na view de lista
- **Onde Ficar** ([src/pages/lodging/LodgingList.tsx](src/pages/lodging/LodgingList.tsx))
  - Rewrite completo: PageHeader · stats strip (4 cols) · hero destaque · filtros (type pills com count + bairro dropdown + view toggle grid/list) · listing com contador
  - Layout 2 colunas com mapa sticky à direita em ≥1100px ([src/components/lodging/LodgingMap.tsx](src/components/lodging/LodgingMap.tsx))
  - Markers pílula com nome da hospedagem, hover sync card↔mapa, popup com foto/estrelas
  - Cards limpos: foto, nome, estrelas, bairro, descrição, "Ver detalhes →"
  - Callout de bairros (fundo escuro) com counts dinâmicos
- **Utils** ([src/lib/utils.ts](src/lib/utils.ts)) — helpers `parseLocalDate` e `toIsoDay` para normalizar datas do Supabase (timestamp ISO → YYYY-MM-DD)
- **i18n** — novas chaves `events.list.*`, `events.calendar.*`, `lodging.list.*` em PT/EN/ES
- **CSS** ([src/index.css](src/index.css)) — estilos Leaflet customizados para markers pílula, popup, zoom controls

### Por que foi feito
Rebrand visual aplicando o design system editorial (warm cream + clay + terracotta) já consolidado na Home a duas páginas-chave do portal — Agenda e Onde Ficar. Designs originados de mockups HTML do Claude Design.

### Decisões técnicas
- **Modal vs rota de detalhe**: mantido modal na Onde Ficar (não existe rota `/onde-ficar/:slug`)
- **Heart de favorito** removido do mock — sem sistema de favoritos no backend, evita placeholder sem função
- **Pílulas de amenidade/preço** removidas dos cards de hospedagem — conforme última iteração do design
- **Eventos longos > 7 dias** ficam fechados nos dias de continuação para evitar ruído visual (caso real: "Comida Di Buteco" 24 dias)
- **Datas do Supabase** vêm como ISO timestamp; criados helpers `parseLocalDate` / `toIsoDay` para normalizar antes de operações de calendário

### Próximos passos
- Aplicar o mesmo padrão de redesign em Atrativos, Onde Comer e Roteiros
- Adicionar rota de detalhe `/onde-ficar/:slug` para substituir modal por página

---

## [2026-04-15] Notícias e Programas/Projetos com editor rich-text

### O que foi feito
- Criada tabela `posts` no Supabase com coluna `categoria` (`'noticia' | 'programa_projeto'`), unique constraint composto `(categoria, slug)` e flag `publicado`. SQL em `supabase/posts.sql`
- Adicionado tipo `Post` e `PostCategoria` em [src/types/database.ts](src/types/database.ts)
- Hook [src/hooks/usePosts.ts](src/hooks/usePosts.ts) com `usePosts(categoria)` e `usePostBySlug(categoria, slug)`
- Componente [src/components/admin/RichTextEditor.tsx](src/components/admin/RichTextEditor.tsx) baseado em **TipTap** com toolbar (negrito, itálico, h2, h3, listas, citação, link, upload de imagem, undo/redo)
- Upload de imagens do editor reaproveita `uploadImage` (bucket `images`, pasta `posts/`)
- Página [src/pages/admin/PostsAdmin.tsx](src/pages/admin/PostsAdmin.tsx) reutilizada para `/admin/noticias` e `/admin/programas-e-projetos` via prop `categoria` (mesmo padrão do `ServiceAdmin`)
- Páginas públicas [src/pages/secretaria/PostsList.tsx](src/pages/secretaria/PostsList.tsx) e [src/pages/secretaria/PostDetail.tsx](src/pages/secretaria/PostDetail.tsx) parametrizadas por categoria
- Rotas públicas: `/secretaria/noticias`, `/secretaria/noticias/:slug`, `/secretaria/programas-e-projetos`, `/secretaria/programas-e-projetos/:slug` (já estavam no nav)
- Links adicionados na sidebar admin
- Classe CSS `.post-content` em [src/index.css](src/index.css) para estilizar tanto o editor quanto o render público

### Por que foi feito
A Secretaria de Turismo precisa publicar notícias e apresentar programas/projetos. Em vez de criar duas infraestruturas separadas, uma única tabela `posts` com coluna `categoria` atende ambas com o mesmo admin, hooks e páginas públicas reaproveitadas — evitando duplicação.

### Decisões técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Editor rich-text | TipTap | Headless, integra bem com shadcn/Tailwind, extensível por extensões tree-shakeable |
| Tabela única `posts` | Ao invés de `noticias` + `programas_projetos` separadas | Schema e lógica idênticos — coluna `categoria` discrimina. Componentização em vez de duplicação |
| Storage de imagens | Bucket `images` existente, pasta `posts/` | Reutiliza infra de upload já pronta; migração pra R2 fica pra depois |
| Sanitização | Confiar no output do TipTap + `dangerouslySetInnerHTML` | Somente admin autenticado (Clerk) escreve; DOMPurify seria overhead sem ganho real |
| Typography | CSS custom `.post-content` | Evita instalar `@tailwindcss/typography` só pra isso |
| Slug | Unique composto `(categoria, slug)` | Permite mesmo slug em categorias diferentes sem colisão |

### Próximos passos
- Rodar `supabase/posts.sql` no SQL Editor do Supabase
- Testar criação/edição/publicação de um post pelo admin
- Considerar: paginação na listagem quando tiver muitos posts, SEO meta tags, RSS feed

---

## [2026-03-25] Fase 1.5 - Painel Administrativo

### O que foi feito
- Configurado Clerk como provider de autenticação no App.tsx
- Criado `AdminLayout` com sidebar, navegação e proteção por login (SignedIn/SignedOut)
- Criado `Dashboard` com contadores de experiências, eventos, banners e mensagens
- Criado CRUD completo de Experiências (`ExperienceAdmin`):
  - Tabela com imagem, nome, categoria, badges de status
  - Dialog para criar/editar com todos os campos
  - Upload de foto principal para Supabase Storage
  - Exclusão com confirmação
- Criado CRUD completo de Banners (`BannerAdmin`):
  - Lista visual com preview de imagem, título e link
  - Dialog para criar/editar com upload de imagem
  - Campo de ordem para controlar sequência
- Criado visualizador de Mensagens (`MessagesAdmin`):
  - Lista de mensagens do formulário de contato
  - Indicador visual de não lida / lida
  - Botão "Marcar como lida"
- Criado `storage.ts` com funções `uploadImage` e `deleteImage` para Supabase Storage
- Adicionadas rotas admin no routes.tsx (/admin, /admin/experiencias, /admin/banners, /admin/mensagens)

### Por que foi feito
O painel admin permite que a equipe da Setur gerencie todo o conteúdo do portal sem precisar acessar o Supabase diretamente ou escrever SQL. Com isso, o MVP está completo — site público + gerenciamento.

### Decisões técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Clerk SignedIn/SignedOut | Ao invés de middleware ou route guard | Mais simples, renderização condicional direta, sem server-side |
| Dialog para formulários | Ao invés de páginas separadas /admin/experiencias/nova | Menos rotas, fluxo mais rápido para o admin |
| Upload client-side | Direto do browser para Supabase Storage | Sem necessidade de backend intermediário, mais simples |
| `slugify` automático | Gerado a partir do nome | Admin não precisa se preocupar com URLs amigáveis |
| Sem `asChild` nos triggers | DialogTrigger com className direto | shadcn v4 (base-ui) não suporta asChild como v3 (radix) |

### Próximos passos
- Criar bucket "images" no Supabase Storage (público)
- Criar conta de admin no Clerk e testar fluxo de login
- Fase 2: Agenda de Eventos + Roteiros

---

## [2026-03-25] Fase 1.4 - Página de Experiências (lista + detalhe)

### O que foi feito
- Criado `CategoryFilter` - filtro de categorias com ícones Lucide mapeados por nome
- Criado `ExperienceCard` - card reutilizável com imagem, badges de categoria/gratuito, hover effect
- Criado `MapView` - componente Leaflet reutilizável (aceita center, zoom, markers)
- Implementada `ExperienceList` - página `/experiencias` com:
  - Filtro por categorias dinâmico (dados do Supabase)
  - Grid responsivo 1/2/3/4 colunas
  - Skeleton loading durante carregamento
  - Mensagem quando nenhuma experiência encontrada
- Implementada `ExperienceDetail` - página `/experiencias/:slug` com:
  - Breadcrumb de navegação
  - Imagem principal + galeria
  - Badges: Gratuito, Acessível, Pet Friendly
  - Descrição completa
  - Horário de funcionamento
  - Endereço com bairro
  - Contato (telefone, email, site, Instagram)
  - Mapa Leaflet com pin da localização
  - Botões Google Maps, Waze e Compartilhar
  - Tela de erro/404 quando experiência não encontrada

### Por que foi feito
A página de experiências é o core do portal — é onde o visitante descobre os atrativos turísticos. O filtro por categoria permite navegação rápida. A página de detalhe reúne todas as informações que um turista precisa em um só lugar.

### Decisões técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Fix ícones do Leaflet | Import manual dos PNGs + `mergeOptions` | Bug conhecido do React-Leaflet: ícones default quebram com bundlers |
| ICON_MAP no CategoryFilter | Mapeamento string→componente | Permite que o nome do ícone salvo no banco (`"trees"`) seja convertido para o componente Lucide correspondente |
| `line-clamp-2` na descrição curta | Truncar em 2 linhas | Mantém cards com altura uniforme no grid |
| `scrollWheelZoom={false}` no mapa | Desabilitar zoom com scroll | Evita scroll acidental quando o usuário está rolando a página |

### Próximos passos
- Painel Admin com Clerk (CRUD de experiências + upload de fotos)
- Página de Agenda/Eventos
- Página de Roteiros

---

## [2026-03-25] Fase 1.3 - Home Page completa com dados reais

### O que foi feito
- Criado script SQL completo para setup do banco (`supabase/setup.sql`) com:
  - 12 tabelas com todas as colunas, foreign keys e constraints
  - Row Level Security (RLS) em todas as tabelas
  - Seed de 9 categorias de experiência e 10 de gastronomia
  - Seed de 6 experiências reais de JF (Museu Mariano Procópio, Parque da Lajinha, Cine-Theatro Central, Morro do Imperador, Catedral Metropolitana, Parque Halfeld)
  - Seed de 3 banners e 5 eventos de exemplo
  - 5 páginas de conteúdo pré-cadastradas (História, Informações, Como Chegar, Imprensa, Setur)
- Criados hooks de dados com React Query:
  - `useBanners` - busca banners ativos ordenados
  - `useExperiences` - lista com filtro por categoria
  - `useFeaturedExperiences` - experiências em destaque para a Home
  - `useExperienceBySlug` - detalhe de uma experiência
  - `useExperienceCategories` - lista de categorias
  - `useUpcomingEvents` - próximos eventos (com limit)
  - `useEvents` - todos os eventos
  - `useEventBySlug` - detalhe de um evento
- Implementados componentes de seção da Home:
  - `HeroBanner` - Banner rotativo com Swiper (autoplay 5s, indicadores, loop)
  - `HomeHighlights` - 2 botões de destaque (Atrativos Turísticos + Caminhando pela História)
  - `HomeExperiences` - Carrossel horizontal de experiências em destaque com badges de categoria
  - `HomeEvents` - Seção "Acontece em JF" com cards de eventos, badges de gratuidade e data
- Montada Home.tsx compondo todas as seções
- Adicionada declaração de tipos para CSS do Swiper (`swiper.d.ts`)

### Por que foi feito
A Home é o "cartão de visitas" do portal. Precisa estar atrativa e funcional para o MVP ir ao ar. Ter dados reais do seed permite validar o fluxo completo (banco → hook → componente → tela).

### Decisões técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| RLS com loop PL/pgSQL | Automatizado para todas as tabelas | Evita repetir 11 blocos de CREATE POLICY manualmente, menos erro humano |
| `buttonVariants` em vez de `asChild` | Link com classes do Button | shadcn v4 usa @base-ui/react que não suporta `asChild` como v3 |
| Swiper CSS types | `swiper.d.ts` manual | Swiper não exporta tipos para seus CSS modules, declaração manual resolve o build |
| Fallback no banner | Fundo azul sólido quando imagem é path local | Banners de seed usam paths placeholder, fallback garante visual aceitável sem fotos reais |
| Seed com dados reais de JF | Nomes, coordenadas e descrições verdadeiras | Validação mais realista, conteúdo aproveitável no lançamento |

### Próximos passos
- Implementar página de Experiências (lista com filtros + detalhe)
- Refinar Header/Footer usando componentes shadcn (Sheet, DropdownMenu)
- Upload de fotos reais para substituir placeholders
- Painel admin básico com Clerk

---

## [2026-03-25] Fase 1.1 - Setup inicial do projeto

### O que foi feito
- Inicializado repositório Git conectado ao GitHub (FellipeMTX/DescubraJF)
- Scaffold do projeto com React 19 + Vite 8 + TypeScript 5.9
- Configurado TailwindCSS v4 com plugin Vite
- Configurado path aliases (`@/` → `src/`)
- Instalado e configurado **shadcn/ui** com 12 componentes base
- Criada toda a estrutura de pastas conforme plano de implementação
- Criados tipos TypeScript para as 12 tabelas do banco de dados
- Criado cliente Supabase (`src/lib/supabase.ts`)
- Criadas funções utilitárias (`cn`, `slugify`, `formatDate`)
- Criadas constantes do site (menu de navegação, links sociais)
- Configurado sistema de rotas com React Router v7 e lazy loading (19 rotas)
- Criado layout global: Header (desktop + mobile) e Footer
- Criadas 19 páginas placeholder (Home, Experiências, Eventos, Roteiros, etc.)
- Configurado `.env.example`, `.npmrc` e `.gitignore`
- Build testado e passando sem erros

### Por que foi feito
Esta é a fundação do projeto. Sem ela, nenhuma feature pode ser construída. O objetivo é ter a estrutura completa para que qualquer agente de IA ou desenvolvedor consiga navegar o projeto e começar a implementar features imediatamente.

### Decisões técnicas

| Decisão | Escolha | Motivo |
|---|---|---|
| Framework | React + Vite (SPA) | Simplicidade, custo zero, suficiente para portal turístico |
| CSS | TailwindCSS v4 + shadcn/ui | Classes utilitárias + componentes prontos e customizáveis |
| Roteamento | React Router v7 | Padrão do mercado para React SPAs |
| Ícones | Lucide React | Leve, tree-shakeable, integrado ao shadcn |
| Ícones sociais | Placeholder genérico (Globe/ExternalLink) | Lucide não tem ícones de marca (Instagram, Facebook). Serão substituídos por SVGs customizados ou via react-icons quando necessário |
| Path aliases | `@/` | Convenção do shadcn/ui, evita imports relativos longos (`../../..`) |
| Lazy loading | Todas as páginas | Code splitting automático - cada página é um chunk JS separado, reduz bundle inicial |
| `.npmrc` com `legacy-peer-deps` | Necessário | `react-helmet-async` ainda não declara suporte a React 19 nos peer deps, mas funciona corretamente |
| Tipos manuais vs gerados | Manuais em `database.ts` | Mais controle, evita dependência de CLI do Supabase no dev. Pode migrar para tipos gerados futuramente |

### Componentes shadcn/ui instalados
`button`, `card`, `badge`, `input`, `textarea`, `select`, `dialog`, `sheet`, `dropdown-menu`, `navigation-menu`, `skeleton`, `separator`

### Próximos passos
- Conectar Supabase (aguardando chaves do humano)
- Implementar Home completa (banner Swiper, carrossel experiências, seção agenda)
- Implementar página de Experiências com filtro por categorias
- Implementar painel admin básico com Clerk

---

*Fim do changelog até o momento.*
