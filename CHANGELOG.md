# Descubra Juiz de Fora - Changelog de Desenvolvimento

> Este documento registra cada etapa do desenvolvimento do projeto.
> Cada entrada documenta **o que** foi feito, **por que** foi feito e **quais decisões** foram tomadas.

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
