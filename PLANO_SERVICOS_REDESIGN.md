# Plano — Página de Serviços (redesign)

Comparação entre o design enviado (Magazine Overlay com sidebar + painel) e o que já está implementado/disponível no banco. Objetivo: identificar exatamente o que dá pra entregar com os dados de hoje e o que exigiria evolução de schema.

---

## 1. Estado atual (já entregue)

Implementado em [src/pages/services/ServiceList.tsx](src/pages/services/ServiceList.tsx) + [src/pages/services/ServiceModal.tsx](src/pages/services/ServiceModal.tsx):

- Layout sidebar (categorias) + painel de conteúdo (cards).
- Chip rail horizontal no mobile.
- Cover header escuro do painel com ícone + título + descrição da categoria.
- `ResourceCard` clicável (eyebrow uppercase + nome serif + descrição truncada + footer com bairro + pill "Mais detalhes").
- `ServiceModal` (shadcn Dialog) com header escuro, descrição completa, card de unidade única (endereço, telefone, email, instagram), botões "Ligar agora" / "Abrir no mapa" / "Instagram", e footer com link do site.

Fontes de dados: tabelas `categorias_servicos` e `servicos` no Supabase.

---

## 2. Análise: design vs dados

### 2.1 Categoria

| Campo no design (`CATEGORIES[]`) | Campo no banco (`categorias_servicos`) | Status |
| --- | --- | --- |
| `id`, `title`, `icon`, `desc` | `id`, `nome`, `icone`, `descricao` | ✅ Equivalente |
| **`lead`** — parágrafo introdutório longo no topo do painel | ❌ Não existe | ❌ Faltando |

### 2.2 Recurso/serviço

| Campo no design (`resource`) | Campo no banco (`servicos`) | Status |
| --- | --- | --- |
| `k` (eyebrow uppercase, ex.: "Hospital universitário") | `descricao_curta` | ✅ Pode reusar |
| `nm` (nome) | `nome` | ✅ |
| `desc` (descrição curta) | `descricao` | ✅ |
| `url` (domínio para mostrar no footer do modal) | `contato.site` ou `link_externo` | ✅ |
| **`units[]`** — array de **múltiplas unidades por recurso** | ❌ Cada `Servico` tem só 1 endereço, 1 telefone, 1 e-mail | ❌ Faltando |
| **"Última atualização · abr 2026"** no footer do modal | `updated_at` | ⚠️ Existe, mas só faria sentido se virasse "Atualizado em {mês}/{ano}" |

### 2.3 Unidade (sub-item de recurso) — totalmente faltando no banco

| Campo da unidade no design | Banco | Status |
| --- | --- | --- |
| `name` (ex.: "Unidade Dom Bosco") | ❌ | Não existe |
| `addr` (endereço) | `endereco` (existe só 1 por servico) | ⚠️ Conflita com "múltiplas unidades" |
| `phone` | `contato.telefone` | ⚠️ Idem |
| `hours` (ex.: "24 horas", "Seg–Sex · 10–15h") | ❌ | Não existe |
| `tag` (ex.: "24h", "Pronto-socorro", "Shopping") | ❌ | Não existe |

**Implicação importante**: o design assume que **1 serviço** (ex.: HU-UFJF) pode ter **várias unidades físicas** (Dom Bosco, Therezinha de Jesus). Hoje cada `Servico` é exatamente uma unidade — ou seja, o "recurso pai" não existe como entidade própria no nosso schema.

---

## 3. Conflitos com instruções anteriores

Durante a iteração anterior você pediu:

- Remover o contador "X contatos úteis" do canto direito do cover header
- Diminuir ícone e fonte do cover header

O **novo design** mostra:

- Contador `04` + "CONTATOS ÚTEIS" italic terracota — **restaurado**
- Ícone grande (64×64), título grande (38px serif) no cover header — **maiores que o atual**

Antes de mexer, preciso saber se vale reverter essas duas reduções para encaixar no novo design, ou se elas continuam valendo (e ignoro o contador e mantenho as fontes menores).

---

## 4. O que dá pra entregar AGORA (sem mexer em dados)

Tudo isso usa só campos já existentes ou contadores derivados:

| # | Mudança | Origem do dado | Custo |
| --- | --- | --- | --- |
| A | Restaurar contador `XX` + label `CONTATOS ÚTEIS` no cover header | `items.length` (já vem do hook) | 1 arquivo, ~15 linhas |
| B | Aumentar ícone e título do cover header para 64px / 38px (se aceito o item 3) | — | 1 arquivo, ajustes inline |
| C | Trocar "1 local" / "X locais" no footer do card por algo que faça sentido com dado real: **`item.bairro`** ou label da categoria | `bairro` (já existe) | já está assim |
| D | Adicionar pequena linha "Atualizado em {Mês/Ano}" no footer do modal | `updated_at` | 1 arquivo, ~5 linhas |
| E | Lead paragraph do painel — **opcional**: omitir ou usar `categoria.descricao` como fallback (mesmo texto que já está no cover sub) | `categoria.descricao` | discutível |

Recomendo entregar **A** + **D** sem qualquer mudança de dados. **B** depende da decisão da seção 3. **E** vale só se quiser arriscar duplicar a descrição da categoria.

---

## 5. O que exige evolução de schema (médio prazo)

Para entregar o design ao pé da letra, precisaríamos modelar **"recurso ↔ unidade"** como entidades separadas. Duas opções:

### Opção A — Coluna `unidades jsonb` em `servicos`

Mais barata. Adiciona uma coluna JSON ao `servicos` existente:

```sql
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS unidades JSONB DEFAULT '[]'::jsonb;
```

Shape:
```ts
type Unidade = { nome: string; endereco?: string; bairro?: string;
                 telefone?: string; horario?: string; tag?: string };
```

Admin: editor de array de unidades dentro do form de Serviço.

**Trade-off**: rompe a regra "1 serviço = 1 endereço" do banco. Cada serviço passa a ter um endereço **principal** (campos atuais) + lista de unidades extras (JSON). Pra Saúde / Bancos faz sentido. Pra Agências de turismo (1 unidade só) sobra estrutura vazia.

### Opção B — Nova tabela `servico_unidades`

Mais cara, mais correta. 1:N entre `servicos` e `servico_unidades`. Migra `endereco`/`telefone` atual para a primeira unidade.

```sql
CREATE TABLE servico_unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  endereco TEXT, bairro TEXT,
  telefone TEXT, horario TEXT, tag TEXT,
  ordem INT DEFAULT 0
);
```

Admin: tela aninhada dentro do form de Serviço, com CRUD inline.

**Trade-off**: mais código no admin, migration de dados existentes precisa rodar (criar 1 unidade pra cada serviço já cadastrado).

### Lead da categoria

```sql
ALTER TABLE categorias_servicos ADD COLUMN IF NOT EXISTS lead TEXT;
```

E adicionar textarea no admin de categorias (que hoje provavelmente só edita nome/descricao). Baixo custo.

### Horário

Mesmo que não criemos "unidades" agora, dá pra adicionar **só `horario`** em `servicos`:

```sql
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS horario TEXT;
```

E mostrar no modal junto com endereço/telefone. **Bom retorno por baixo esforço** — cobre 50% do que as "units" trazem visualmente.

---

## 6. Recomendação

**Fase 1 — entrega imediata (sem mudança de banco)**
1. Decisão na seção 3: reverter ou manter cover header menor.
2. Implementar A + D + (B se aceito).
3. Resultado: ~80% visual do design, sem qualquer risco de dados.

**Fase 2 — quando tiver disposição de mexer no admin**
1. Adicionar `lead` em `categorias_servicos` + textarea no admin.
2. Adicionar `horario` em `servicos` + input no admin.
3. Mostrar lead no painel + horario no modal.

**Fase 3 — só se virar prioridade real**
1. Decidir entre Opção A (jsonb) e Opção B (tabela 1:N) para `unidades`.
2. Migration de dados existentes.
3. UI no admin pra editar lista.
4. Modal passa a renderizar lista de unidades.

---

## 7. Perguntas para destravar

1. **D1**: Vale reverter as reduções anteriores do cover header (ícone/título/contador)?
   - (a) Sim, segue o design novo
   - (b) Não, mantém compacto como ficou
2. **D2**: Implementar Fase 1 já (sem mexer em banco)?
   - (a) Sim, segue
   - (b) Espera — quero discutir Fase 2/3 primeiro
3. **D3**: Quer abrir um ticket separado para Fase 2 (lead + horario) ou agrupar tudo numa rodada futura?
4. **D4**: Sobre `unidades` — opção (a) jsonb ou (b) tabela 1:N? Ou deixar essa decisão pra mais tarde?
