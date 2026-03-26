# Descubra Juiz de Fora - Diretrizes para Agentes de IA

## Sobre o Projeto

Portal turístico oficial de Juiz de Fora (MG). Frontend React + Vite + TypeScript com Supabase como backend. O documento de referência completo é `PLANO_IMPLEMENTACAO.md`.

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

## Estrutura de Pastas

```
src/
├── components/
│   ├── layout/     → Header, Footer, Layout, MobileMenu
│   ├── ui/         → Componentes shadcn/ui (button, card, badge, etc.)
│   └── sections/   → Seções específicas da Home
├── pages/          → Páginas do site (uma pasta por seção)
├── hooks/          → Custom hooks (queries ao Supabase)
├── lib/            → supabase.ts, utils.ts, constants.ts
├── types/          → database.ts (tipos das tabelas)
└── i18n/           → Traduções (Fase 7)
```

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
