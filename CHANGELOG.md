# Descubra Juiz de Fora - Changelog de Desenvolvimento

> Este documento registra cada etapa do desenvolvimento do projeto.
> Cada entrada documenta **o que** foi feito, **por que** foi feito e **quais decisões** foram tomadas.

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
