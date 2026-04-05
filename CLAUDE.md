# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre o Projeto

Portal turístico oficial de Juiz de Fora (MG). Frontend React + Vite + TypeScript com Supabase como backend. O documento de referência completo é `PLANO_IMPLEMENTACAO.md`.

## Comandos

```bash
npm run dev       # Dev server (Vite)
npm run build     # Type-check (tsc -b) + build
npm run lint      # ESLint
npm run preview   # Preview production build
```

Sem test runner configurado.

## Arquitetura

### Routing (`src/routes.tsx`)
- `createBrowserRouter` do React Router v7, todas as páginas lazy-loaded
- Duas árvores: `/` (público, envolto em `<Layout>`) e `/admin` (envolto em `<AdminLayout>`)
- Admin auth é feita dentro de `AdminLayout` via Clerk `<SignedIn>`/`<SignedOut>` — sem guard no router

### Data Layer
- **Supabase client** em `src/lib/supabase.ts` — usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- **Hooks** em `src/hooks/` — todos seguem o padrão: `useQuery` do React Query + `.select()` no Supabase, queryKey como `["tabela", filtro]`. Sem mutations — admin pages escrevem direto via Supabase client
- **Types** em `src/types/database.ts` — 8 entidades principais: Experiencia, Evento, Roteiro, Hospedagem, EstabelecimentoGastronomia, Servico, Banner, PaginaConteudo

### Auth (Clerk)
- `ClerkProvider` envolve o app em `App.tsx` (`VITE_CLERK_PUBLISHABLE_KEY`)
- Admin protegido por renderização condicional em `AdminLayout`, não por route guards

### Theming (`src/index.css`)
- TailwindCSS v4 — configuração via CSS `@theme` blocks (sem `tailwind.config.ts`)
- Design tokens centralizados no `@theme` block: paleta `primary-*`, `accent-*`, escala `font-size-*`
- Páginas públicas usam tokens de marca (`primary-*`, `accent-*`)
- Páginas admin usam tokens semânticos shadcn (`foreground`, `muted-foreground`, `border`, etc.)
- Para mudar cores/fontes/tamanhos do site inteiro: editar apenas `src/index.css`

### Admin Pattern
- `ServiceAdmin` é reutilizado para `/admin/servicos` e `/admin/passeios` via prop `tab`
- Sidebar nav hardcoded em `AdminLayout.tsx`

### Env vars necessárias (`.env.local`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`

## Regras de Código

1. **Idioma do código**: Variáveis, componentes, funções e comentários em **inglês**. Textos voltados ao usuário (labels, títulos, placeholders) em **português brasileiro**.
2. **Sem bibliotecas extras**: Não instale dependências além das que já estão no `package.json`, a menos que o humano peça.
3. **Sem over-engineering**: Implemente o mínimo necessário. Nada de abstrações prematuras, features extras ou "melhorias" não solicitadas.
4. **Estilo**: Functional components, hooks, named exports. Sem classes React. Sem `any` no TypeScript.
5. **Arquivos pequenos**: Um componente por arquivo. Máximo ~200 linhas.
6. **Componentes UI**: Usar componentes do **shadcn/ui** (`src/components/ui/`) sempre que possível antes de criar componentes customizados.
7. **Imports**: Usar alias `@/` para imports (ex: `import { cn } from "@/lib/utils"`).
8. **Imagens placeholder**: Quando não houver imagens reais, usar cores sólidas ou divs com texto descritivo.
9. **Testes**: Não crie testes a menos que o humano peça.
10. **Componentização obrigatória**: Antes de criar código novo, verifique se já existe um componente reutilizável. Se duas ou mais páginas/seções compartilham padrões visuais ou lógicos semelhantes (layout, cards, filtros, modais, listas), **extraia para um componente compartilhado**. Código duplicado é inaceitável — prefira sempre um componente genérico com props a copiar/colar entre arquivos.
11. **Limpeza contínua**: Após refatorações ou mudanças estruturais, **sempre faça uma revisão de código morto** — arquivos não importados, componentes não usados, rotas removidas mas arquivos mantidos, links apontando para rotas que não existem mais. Código morto deve ser deletado imediatamente, nunca mantido "para referência".
12. **Código enxuto**: Menos código é melhor código. Se uma abstração reduz duplicação sem adicionar complexidade desnecessária, faça. Se três linhas resolvem, não escreva dez. Priorize legibilidade e reaproveitamento.

## Regras de Commit e Documentação

**IMPORTANTE: A cada commit, OBRIGATORIAMENTE:**

1. **Mensagem de commit** em português, descritiva, seguindo o padrão:
   ```
   [Fase X.Y] Descrição curta do que foi feito

   - Detalhe 1
   - Detalhe 2
   ```

2. **Atualizar o CHANGELOG.md** adicionando uma entrada no topo com:
   - **Data** do commit
   - **Fase** correspondente do plano de implementação
   - **O que foi feito**: lista objetiva das mudanças
   - **Por que foi feito**: contexto e motivação
   - **Decisões técnicas**: qualquer escolha relevante e o motivo
   - **Próximos passos**: o que vem a seguir

3. **Atualizar o PLANO_IMPLEMENTACAO.md** marcando tasks como concluídas (`[x]`) quando aplicável.

4. **Só faça commits quando o humano pedir.**

## Stack (não alterar sem autorização)

- React 19 + Vite 8 + TypeScript 5.9
- TailwindCSS 4 + shadcn/ui
- React Router 7, React Query 5
- Supabase (banco + storage + auth)
- Clerk (auth admin)
- Leaflet (mapas), Swiper (carrosséis)
- Lucide React (ícones)

## Documentos de Referência

- `PLANO_IMPLEMENTACAO.md` → Plano técnico completo (para agentes de IA)
- `DOCUMENTACAO.md` → Documentação do projeto (para humanos)
- `CHANGELOG.md` → Histórico de desenvolvimento
- `Descubra Juiz de Fora - Mapa do Site.pdf` → Documento original de design
