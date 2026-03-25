# Descubra Juiz de Fora - Plano de Implementação

> **ESTE DOCUMENTO É DIRECIONADO PARA AGENTES DE IA.**
> Para a documentação humana do projeto (visão geral, infraestrutura, justificativas), consulte `DOCUMENTACAO.md`.

---

## Contexto do Projeto

Portal turístico oficial de Juiz de Fora (MG). Site público para visitantes + painel admin para a Setur (Secretaria de Turismo). O documento de referência de design e conteúdo é o PDF "Descubra Juiz de Fora - Mapa do Site.pdf" na raiz do projeto.

## Regras Gerais para o Agente

1. **Idioma do código**: Nomes de variáveis, componentes, funções e comentários em **inglês**. Conteúdo de texto voltado ao usuário (labels, títulos, placeholders) em **português brasileiro**.
2. **Sem bibliotecas extras**: Não instale dependências além das listadas na stack abaixo, a menos que o humano peça explicitamente.
3. **Sem over-engineering**: Implemente o mínimo necessário para cada tarefa. Não adicione features extras, abstrações prematuras ou "melhorias" não solicitadas.
4. **Estilo de código**: Functional components, hooks, named exports. Sem classes React. Sem `any` no TypeScript (use tipos explícitos).
5. **Arquivos pequenos**: Um componente por arquivo. Se um arquivo ultrapassar ~200 linhas, divida.
6. **Commits**: Só faça commits quando o humano pedir. Mensagens em português.
7. **Testes**: Não crie testes a menos que o humano peça.
8. **Imagens placeholder**: Quando não houver imagens reais, use cores sólidas ou placeholders com texto descritivo (não use serviços externos de placeholder).

---

## Stack Tecnológica (FIXA - não alterar)

```
FRONTEND:
  react: ^19
  react-dom: ^19
  typescript: ^5.7
  vite: ^6
  tailwindcss: ^4
  react-router: ^7 (import from "react-router")
  @tanstack/react-query: ^5
  react-leaflet: ^5 (mapas)
  leaflet: ^1.9
  swiper: ^11 (carrosséis)
  react-hook-form: ^7
  zod: ^3
  @hookform/resolvers: ^3 (integração zod + react-hook-form)
  lucide-react: ^0.460 (ícones)
  react-helmet-async: ^2 (SEO)
  react-i18next: ^15 (i18n - fase 7)
  i18next: ^24

BACKEND/SERVIÇOS:
  @supabase/supabase-js: ^2
  @clerk/clerk-react: ^5

DEV:
  @types/react: ^19
  @types/react-dom: ^19
  @types/leaflet: ^1.9
  eslint + prettier (configuração padrão Vite)
```

---

## Estrutura de Pastas

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Cabeçalho global com nav, busca, idioma
│   │   ├── Footer.tsx           # Rodapé global com logos, links, redes sociais
│   │   ├── Layout.tsx           # Wrapper com Header + Outlet + Footer
│   │   ├── MobileMenu.tsx       # Menu drawer para mobile
│   │   └── NavDropdown.tsx      # Dropdown do menu principal
│   │
│   ├── ui/                      # Componentes genéricos reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx             # Card genérico (foto + título + badge)
│   │   ├── CategoryFilter.tsx   # Filtro de categorias com ícones
│   │   ├── DateFilter.tsx       # Seletor de mês + dias clicáveis
│   │   ├── ImageGallery.tsx     # Galeria de fotos com lightbox
│   │   ├── LoadingSpinner.tsx
│   │   ├── MapView.tsx          # Componente Leaflet reutilizável
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx        # Busca global (header)
│   │   ├── ShareButtons.tsx     # WhatsApp, Facebook, Twitter, copiar link
│   │   └── HeroBanner.tsx       # Banner rotativo (Swiper)
│   │
│   └── sections/                # Seções específicas da Home
│       ├── HomeHighlights.tsx   # Botões de destaque (Atrativos + Roteiros)
│       ├── HomeExperiences.tsx  # Carrossel "Tem tudo em JF!"
│       └── HomeEvents.tsx       # Seção "Acontece em JF"
│
├── pages/
│   ├── Home.tsx
│   ├── experiences/
│   │   ├── ExperienceList.tsx   # /experiencias
│   │   └── ExperienceDetail.tsx # /experiencias/:slug
│   ├── routes/
│   │   ├── RouteList.tsx        # /roteiros
│   │   └── RouteDetail.tsx      # /roteiros/:slug
│   ├── events/
│   │   ├── EventList.tsx        # /agenda
│   │   └── EventDetail.tsx      # /agenda/:slug
│   ├── dining/
│   │   ├── DiningList.tsx       # /onde-comer
│   │   └── DiningDetail.tsx     # /onde-comer/:slug
│   ├── lodging/
│   │   ├── LodgingList.tsx      # /onde-ficar
│   │   └── LodgingDetail.tsx    # /onde-ficar/:slug
│   ├── city/                    # Páginas "Juiz de Fora"
│   │   ├── History.tsx          # /juiz-de-fora/historia
│   │   ├── TouristInfo.tsx      # /juiz-de-fora/informacoes
│   │   ├── HowToGetHere.tsx     # /juiz-de-fora/como-chegar
│   │   ├── Press.tsx            # /juiz-de-fora/imprensa
│   │   └── AboutSetur.tsx       # /juiz-de-fora/setur
│   ├── MapsAndGuides.tsx        # /mapas-e-guias
│   ├── Contact.tsx              # /contato
│   ├── NotFound.tsx             # 404
│   └── admin/
│       ├── AdminLayout.tsx      # Layout do admin (sidebar + conteúdo)
│       ├── Dashboard.tsx        # Visão geral
│       ├── ExperienceAdmin.tsx  # CRUD experiências
│       ├── EventAdmin.tsx       # CRUD eventos
│       ├── RouteAdmin.tsx       # CRUD roteiros
│       ├── DiningAdmin.tsx      # CRUD gastronomia
│       ├── LodgingAdmin.tsx     # CRUD hospedagens
│       ├── BannerAdmin.tsx      # CRUD banners
│       ├── PageAdmin.tsx        # Editor de páginas de conteúdo
│       ├── DownloadAdmin.tsx    # CRUD materiais download
│       └── MessagesAdmin.tsx    # Visualizar mensagens de contato
│
├── hooks/
│   ├── useExperiences.ts        # Query hooks para experiências
│   ├── useEvents.ts
│   ├── useRoutes.ts
│   ├── useDining.ts
│   ├── useLodging.ts
│   ├── useBanners.ts
│   ├── usePages.ts
│   ├── useDownloads.ts
│   ├── useSearch.ts             # Busca global
│   └── useMessages.ts
│
├── lib/
│   ├── supabase.ts              # Cliente Supabase inicializado
│   ├── utils.ts                 # Helpers (formatDate, slugify, etc.)
│   └── constants.ts             # Constantes (categorias default, etc.)
│
├── types/
│   └── database.ts              # Tipos gerados do Supabase (ou manuais)
│
├── i18n/                        # Fase 7
│   ├── index.ts
│   ├── pt.json
│   ├── en.json
│   └── es.json
│
├── routes.tsx                   # Definição de todas as rotas
├── App.tsx                      # Providers (QueryClient, Clerk, Helmet, Router)
└── main.tsx                     # Entry point
```

---

## Banco de Dados (Supabase PostgreSQL)

### Tabelas e SQL de Criação

Execute na ordem abaixo (respeitar foreign keys).

#### 1. `categorias_experiencia`

```sql
CREATE TABLE categorias_experiencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icone TEXT,
  cor TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true
);

INSERT INTO categorias_experiencia (nome, slug, icone, cor, ordem) VALUES
  ('Afroturismo', 'afroturismo', 'globe', '#8B4513', 1),
  ('Ao Ar Livre', 'ao-ar-livre', 'trees', '#228B22', 2),
  ('Aventura e Esportes', 'aventura-e-esportes', 'mountain', '#FF4500', 3),
  ('Artesanato e Compras', 'artesanato-e-compras', 'shopping-bag', '#DAA520', 4),
  ('História e Cultura', 'historia-e-cultura', 'landmark', '#4169E1', 5),
  ('Infantil e Família', 'infantil-e-familia', 'baby', '#FF69B4', 6),
  ('Mirantes e Vistas Panorâmicas', 'mirantes-e-vistas', 'eye', '#20B2AA', 7),
  ('Música e Arte', 'musica-e-arte', 'music', '#9370DB', 8),
  ('Religiosidade', 'religiosidade', 'church', '#CD853F', 9);
```

#### 2. `experiencias`

```sql
CREATE TABLE experiencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  categoria_id UUID REFERENCES categorias_experiencia(id),
  latitude DECIMAL,
  longitude DECIMAL,
  imagem_destaque TEXT,
  imagens TEXT[],
  horario_funcionamento JSONB,
  contato JSONB,
  endereco TEXT,
  bairro TEXT,
  acessibilidade BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  gratuito BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. `roteiros`

```sql
CREATE TABLE roteiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  imagem_destaque TEXT,
  imagens TEXT[],
  mapa_url TEXT,
  mapa_embed_id TEXT,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 4. `roteiro_pontos`

```sql
CREATE TABLE roteiro_pontos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roteiro_id UUID REFERENCES roteiros(id) ON DELETE CASCADE,
  experiencia_id UUID REFERENCES experiencias(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  ordem INT DEFAULT 0,
  latitude DECIMAL,
  longitude DECIMAL
);
```

#### 5. `eventos`

```sql
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ,
  local_nome TEXT,
  local_endereco TEXT,
  experiencia_id UUID REFERENCES experiencias(id) ON DELETE SET NULL,
  imagem_destaque TEXT,
  link_externo TEXT,
  categoria TEXT,
  gratuito BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 6. `categorias_gastronomia`

```sql
CREATE TABLE categorias_gastronomia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icone TEXT,
  ordem INT DEFAULT 0
);

INSERT INTO categorias_gastronomia (nome, slug, icone, ordem) VALUES
  ('Cozinha Mineira', 'cozinha-mineira', 'utensils', 1),
  ('Restaurantes e Bistrôs', 'restaurantes-e-bistros', 'chef-hat', 2),
  ('Bares e Botecos', 'bares-e-botecos', 'beer', 3),
  ('Cafés e Confeitarias', 'cafes-e-confeitarias', 'coffee', 4),
  ('Pizzarias e Massas', 'pizzarias-e-massas', 'pizza', 5),
  ('Churrascarias e Carnes', 'churrascarias-e-carnes', 'flame', 6),
  ('Cervejarias e Drinks', 'cervejarias-e-drinks', 'wine', 7),
  ('Comida Rápida e Lanches', 'comida-rapida-e-lanches', 'sandwich', 8),
  ('Opções Saudáveis e Vegetarianas', 'opcoes-saudaveis', 'salad', 9),
  ('Bar na Rua', 'bar-na-rua', 'map-pin', 10);
```

#### 7. `estabelecimentos_gastronomia`

```sql
CREATE TABLE estabelecimentos_gastronomia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  categoria_gastronomia_id UUID REFERENCES categorias_gastronomia(id),
  imagem_destaque TEXT,
  imagens TEXT[],
  endereco TEXT,
  bairro TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  horario_funcionamento JSONB,
  contato JSONB,
  faixa_preco INT,
  estacionamento BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 8. `hospedagens`

```sql
CREATE TABLE hospedagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  tipo TEXT NOT NULL,
  estrelas INT,
  imagem_destaque TEXT,
  imagens TEXT[],
  endereco TEXT,
  bairro TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  contato JSONB,
  comodidades TEXT[],
  faixa_preco INT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 9. `paginas_conteudo`

```sql
CREATE TABLE paginas_conteudo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  conteudo TEXT,
  imagem_destaque TEXT,
  imagens TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO paginas_conteudo (titulo, slug) VALUES
  ('História de Juiz de Fora', 'historia'),
  ('Informações Turísticas', 'informacoes-turisticas'),
  ('Como Chegar', 'como-chegar'),
  ('Assessoria de Imprensa', 'assessoria-de-imprensa'),
  ('Setur - JF', 'setur-jf');
```

#### 10. `materiais_download`

```sql
CREATE TABLE materiais_download (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_capa TEXT,
  arquivo_url TEXT NOT NULL,
  tipo TEXT,
  pagina TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 11. `banners`

```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  imagem_url TEXT NOT NULL,
  link TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 12. `contato_mensagens`

```sql
CREATE TABLE contato_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  assunto TEXT,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

Aplicar em TODAS as tabelas após criação:

```sql
-- Para cada tabela de conteúdo (experiencias, eventos, roteiros, etc.):
ALTER TABLE experiencias ENABLE ROW LEVEL SECURITY;

-- Leitura pública (apenas registros ativos)
CREATE POLICY "Leitura pública" ON experiencias
  FOR SELECT USING (ativo = true);

-- Escrita apenas via service_role (admin backend)
CREATE POLICY "Escrita admin" ON experiencias
  FOR ALL USING (auth.role() = 'service_role');

-- Repetir para: categorias_experiencia, roteiros, roteiro_pontos, eventos,
-- categorias_gastronomia, estabelecimentos_gastronomia, hospedagens,
-- paginas_conteudo, materiais_download, banners

-- contato_mensagens: apenas INSERT público, leitura via admin
ALTER TABLE contato_mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Envio público" ON contato_mensagens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura admin" ON contato_mensagens
  FOR SELECT USING (auth.role() = 'service_role');
```

---

## Rotas do Frontend

```tsx
// src/routes.tsx
import { createBrowserRouter } from "react-router";

// Lazy imports para code splitting
const Home = lazy(() => import("./pages/Home"));
const ExperienceList = lazy(() => import("./pages/experiences/ExperienceList"));
const ExperienceDetail = lazy(() => import("./pages/experiences/ExperienceDetail"));
const RouteList = lazy(() => import("./pages/routes/RouteList"));
const RouteDetail = lazy(() => import("./pages/routes/RouteDetail"));
const EventList = lazy(() => import("./pages/events/EventList"));
const EventDetail = lazy(() => import("./pages/events/EventDetail"));
const DiningList = lazy(() => import("./pages/dining/DiningList"));
const DiningDetail = lazy(() => import("./pages/dining/DiningDetail"));
const LodgingList = lazy(() => import("./pages/lodging/LodgingList"));
const LodgingDetail = lazy(() => import("./pages/lodging/LodgingDetail"));
const History = lazy(() => import("./pages/city/History"));
const TouristInfo = lazy(() => import("./pages/city/TouristInfo"));
const HowToGetHere = lazy(() => import("./pages/city/HowToGetHere"));
const Press = lazy(() => import("./pages/city/Press"));
const AboutSetur = lazy(() => import("./pages/city/AboutSetur"));
const MapsAndGuides = lazy(() => import("./pages/MapsAndGuides"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin (protegido por Clerk)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
// ... demais admin pages

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "experiencias", element: <ExperienceList /> },
      { path: "experiencias/:slug", element: <ExperienceDetail /> },
      { path: "roteiros", element: <RouteList /> },
      { path: "roteiros/:slug", element: <RouteDetail /> },
      { path: "agenda", element: <EventList /> },
      { path: "agenda/:slug", element: <EventDetail /> },
      { path: "onde-comer", element: <DiningList /> },
      { path: "onde-comer/:slug", element: <DiningDetail /> },
      { path: "onde-ficar", element: <LodgingList /> },
      { path: "onde-ficar/:slug", element: <LodgingDetail /> },
      { path: "juiz-de-fora/historia", element: <History /> },
      { path: "juiz-de-fora/informacoes", element: <TouristInfo /> },
      { path: "juiz-de-fora/como-chegar", element: <HowToGetHere /> },
      { path: "juiz-de-fora/imprensa", element: <Press /> },
      { path: "juiz-de-fora/setur", element: <AboutSetur /> },
      { path: "mapas-e-guias", element: <MapsAndGuides /> },
      { path: "contato", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "admin",
    element: <ClerkProtected><AdminLayout /></ClerkProtected>,
    children: [
      { index: true, element: <Dashboard /> },
      // ... demais rotas admin
    ],
  },
]);
```

---

## Componentes do Layout Global

### Header - Especificação

```
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO]  Juiz de Fora▾  O que Fazer▾  Onde Comer  Onde Ficar    │
│                         Mapas e Guias  Contato     🔍  PT EN ES │
└─────────────────────────────────────────────────────────────────┘

Dropdown "Juiz de Fora":        Dropdown "O que Fazer":
├── História                    ├── Experiências
├── Informações Turísticas      ├── Roteiros
├── Como Chegar                 └── Agenda
├── Assessoria de Imprensa
└── Setur - JF

Mobile: hambúrguer → drawer lateral com todos os links
Logo: clicável, leva para /
Busca (🔍): abre input overlay, busca global
Idioma: PT ativo por padrão, EN/ES desabilitados até Fase 7
```

### Footer - Especificação

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo Prefeitura]  [Logo Setur]                                 │
│                                                                 │
│ JUIZ DE FORA    O QUE FAZER    ONDE COMER    ONDE FICAR         │
│ História        Experiências   (link direto)  (link direto)     │
│ Informações     Roteiros                                        │
│ Como Chegar     Agenda         MAPAS E GUIAS  CONTATO           │
│ Imprensa                       (link direto)  (link direto)     │
│ Setur-JF                                                        │
│                                                                 │
│ [Twitter] [Facebook] [Instagram] [YouTube]                      │
│                                                                 │
│ © 2026 Descubra Juiz de Fora - Setur                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fases de Implementação

### FASE 1: Fundação + Home + Experiências (MVP)

**Pré-requisitos do humano** (ver checklist em DOCUMENTACAO.md):
- Contas criadas: Supabase, Vercel, Clerk, GitHub
- Variáveis de ambiente fornecidas: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`
- Logo do "Descubra Juiz de Fora" disponível
- Pelo menos 5 experiências com fotos para seed

**Tarefas**:

1.1 - Setup do projeto
- [ ] `npm create vite@latest . -- --template react-ts`
- [ ] Instalar dependências da stack
- [ ] Configurar TailwindCSS v4
- [ ] Configurar React Router v7 com as rotas acima
- [ ] Configurar React Query provider
- [ ] Criar `src/lib/supabase.ts` com cliente inicializado
- [ ] Criar `src/types/database.ts` com tipos das tabelas
- [ ] Criar `.env.local` (não commitar) com variáveis Supabase + Clerk
- [ ] Executar SQL de criação das tabelas 1-5 e 11 no Supabase
- [ ] Configurar RLS
- [ ] Deploy inicial no Vercel conectado ao GitHub

1.2 - Layout global
- [ ] Criar `Layout.tsx` com Header + `<Outlet />` + Footer
- [ ] Criar `Header.tsx` conforme especificação acima
- [ ] Criar `Footer.tsx` conforme especificação acima
- [ ] Criar `MobileMenu.tsx` (drawer lateral)
- [ ] Responsividade: mobile-first, breakpoints sm/md/lg/xl

1.3 - Home
- [ ] `HeroBanner.tsx`: Swiper com banners da tabela `banners`, autoplay 5s, indicadores
- [ ] `HomeHighlights.tsx`: 2 botões lado a lado (Atrativos Turísticos / Caminhando pela História)
- [ ] `HomeExperiences.tsx`: carrossel horizontal de cards, dados de `experiencias` onde `destaque=true`
- [ ] `HomeEvents.tsx`: lista simples dos próximos 5 eventos, botão "Agenda completa"
- [ ] Hook `useBanners.ts`, `useExperiences.ts`, `useEvents.ts`

1.4 - Experiências
- [ ] `ExperienceList.tsx`: título, subtítulo, `CategoryFilter` no topo, grid 4 colunas (responsive)
- [ ] `Card.tsx`: imagem com overlay escuro no hover, badge de categoria, título
- [ ] `ExperienceDetail.tsx`: galeria, descrição, badges (acessibilidade/pet/gratuito), horários, mapa Leaflet com pin, contato, compartilhar
- [ ] `MapView.tsx`: componente Leaflet reutilizável (recebe lat/lng e markers)
- [ ] `CategoryFilter.tsx`: ícones clicáveis, "Todos" como default

1.5 - Admin básico
- [ ] Configurar Clerk provider em `App.tsx`
- [ ] `AdminLayout.tsx`: sidebar com links, área de conteúdo
- [ ] CRUD genérico: table view (listar), formulário (criar/editar), confirmação (excluir)
- [ ] `ExperienceAdmin.tsx`: CRUD completo com upload de imagens
- [ ] `BannerAdmin.tsx`: CRUD com upload de imagem
- [ ] Upload de imagens via Supabase Storage (bucket `images`, público)

**Entregável**: Site funcional com Home, listagem/detalhe de experiências, painel admin.

---

### FASE 2: Eventos + Roteiros

- [ ] Executar SQL tabelas `eventos`, `roteiros`, `roteiro_pontos` (se não feito na fase 1)
- [ ] `EventList.tsx`: título "Acontece em JF", filtro por mês/dia, filtro gratuidade, cards
- [ ] `EventDetail.tsx`: detalhes, link externo, mapa do local
- [ ] `DateFilter.tsx`: seletor de mês + dias da semana como chips clicáveis
- [ ] Atualizar `HomeEvents.tsx` com dados reais + filtro de data
- [ ] `RouteList.tsx`: título "Caminhando pela História", grid de cards
- [ ] `RouteDetail.tsx`: descrição, mapa Leaflet com múltiplos pins (pontos do roteiro), lista de pontos
- [ ] Admin: `EventAdmin.tsx`, `RouteAdmin.tsx`

---

### FASE 3: Onde Comer + Onde Ficar

- [ ] Executar SQL tabelas `categorias_gastronomia`, `estabelecimentos_gastronomia`, `hospedagens`
- [ ] `DiningList.tsx`: título, subtítulo, filtro categorias, grid cards, opcional mapa com pins
- [ ] `DiningDetail.tsx`: info completa do estabelecimento
- [ ] `LodgingList.tsx`: título, subtítulo, filtro por tipo, grid cards com estrelas
- [ ] `LodgingDetail.tsx`: info completa da hospedagem
- [ ] Admin: `DiningAdmin.tsx`, `LodgingAdmin.tsx`

---

### FASE 4: Páginas de Conteúdo (Juiz de Fora)

- [ ] Executar SQL tabelas `paginas_conteudo`, `materiais_download`
- [ ] Componente `ContentPage.tsx`: renderiza conteúdo Markdown/HTML de `paginas_conteudo`
- [ ] `History.tsx`: busca slug `historia`, layout blog post
- [ ] `TouristInfo.tsx`: busca slug `informacoes-turisticas`
- [ ] `HowToGetHere.tsx`: busca slug `como-chegar`, inclui mapa embed
- [ ] `Press.tsx`: busca slug `assessoria-de-imprensa` + lista `materiais_download` onde `pagina='assessoria-de-imprensa'`
- [ ] `AboutSetur.tsx`: busca slug `setur-jf`
- [ ] Admin: `PageAdmin.tsx` (editor de conteúdo), `DownloadAdmin.tsx`

---

### FASE 5: Mapas, Contato e Busca

- [ ] Executar SQL tabela `contato_mensagens`
- [ ] `MapsAndGuides.tsx`: mapa Leaflet fullwidth com TODOS os atrativos como pins, popups clicáveis, filtro categorias. Seção de downloads.
- [ ] `Contact.tsx`: formulário (React Hook Form + Zod), insert no Supabase, info de contato, mapa Setur
- [ ] `SearchBar.tsx` funcional: busca em múltiplas tabelas via Supabase full-text search, resultados em dropdown agrupados por tipo
- [ ] Admin: `MessagesAdmin.tsx` (lista mensagens, marcar como lida)

---

### FASE 6: SEO + Performance

- [ ] React Helmet em todas as páginas (title, description, og:image, og:title, og:description)
- [ ] Gerar `sitemap.xml` (script ou Vercel Edge Function)
- [ ] `robots.txt` no public/
- [ ] JSON-LD em experiências e eventos (schema.org/TouristAttraction, schema.org/Event)
- [ ] `ShareButtons.tsx` em todas as páginas de detalhe
- [ ] Lazy loading de imagens (`loading="lazy"`)
- [ ] Otimizar imagens no upload admin (resize client-side antes de enviar)
- [ ] Verificar acessibilidade (ARIA, keyboard nav, contraste)

---

### FASE 7: i18n + Features Avançadas

- [ ] Configurar react-i18next com namespaces (common, home, experiences, etc.)
- [ ] Extrair todos os textos fixos para arquivos de tradução pt.json, en.json, es.json
- [ ] Ativar seletor de idioma no Header
- [ ] Adicionar campos `nome_en`, `nome_es`, `descricao_en`, `descricao_es` nas tabelas (ou tabela `traducoes`)
- [ ] Carrossel de experiências na Home com filtro por categoria (estilo Houston)
- [ ] PWA: manifest.json + service worker básico
- [ ] Analytics: Vercel Analytics ou Plausible script

---

## Variáveis de Ambiente

```env
# .env.local (NÃO commitar)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## Mapeamento Completo: Mapa do Site → Implementação

| # | Seção do Mapa do Site | Rota | Fase | Componente Principal |
|---|---|---|---|---|
| 1 | Cabeçalho | global | 1 | Header.tsx |
| 2 | Rodapé | global | 1 | Footer.tsx |
| 3 | Home - Banner | / | 1 | HeroBanner.tsx |
| 4 | Home - Destaques | / | 1 | HomeHighlights.tsx |
| 5 | Home - Carrossel Experiências | / | 1 | HomeExperiences.tsx |
| 6 | Home - Agenda resumo | / | 1/2 | HomeEvents.tsx |
| 7 | Experiências (lista) | /experiencias | 1 | ExperienceList.tsx |
| 8 | Experiências (detalhe) | /experiencias/:slug | 1 | ExperienceDetail.tsx |
| 9 | Agenda (lista) | /agenda | 2 | EventList.tsx |
| 10 | Agenda (detalhe) | /agenda/:slug | 2 | EventDetail.tsx |
| 11 | Roteiros (lista) | /roteiros | 2 | RouteList.tsx |
| 12 | Roteiros (detalhe) | /roteiros/:slug | 2 | RouteDetail.tsx |
| 13 | Onde Comer (lista) | /onde-comer | 3 | DiningList.tsx |
| 14 | Onde Comer (detalhe) | /onde-comer/:slug | 3 | DiningDetail.tsx |
| 15 | Onde Ficar (lista) | /onde-ficar | 3 | LodgingList.tsx |
| 16 | Onde Ficar (detalhe) | /onde-ficar/:slug | 3 | LodgingDetail.tsx |
| 17 | História | /juiz-de-fora/historia | 4 | History.tsx |
| 18 | Informações Turísticas | /juiz-de-fora/informacoes | 4 | TouristInfo.tsx |
| 19 | Como Chegar | /juiz-de-fora/como-chegar | 4 | HowToGetHere.tsx |
| 20 | Assessoria de Imprensa | /juiz-de-fora/imprensa | 4 | Press.tsx |
| 21 | Setur-JF | /juiz-de-fora/setur | 4 | AboutSetur.tsx |
| 22 | Mapas e Guias | /mapas-e-guias | 5 | MapsAndGuides.tsx |
| 23 | Contato | /contato | 5 | Contact.tsx |
| 24 | Busca Global | header | 5 | SearchBar.tsx |
| 25 | SEO / Open Graph | todas | 6 | React Helmet |
| 26 | Internacionalização | todas | 7 | react-i18next |

---

**Versão:** 3.0
**Última atualização:** 25/03/2026
