# Descubra Juiz de Fora - Documentação do Projeto

> **Este documento é para você, humano, que está à frente do projeto.**
> Aqui você encontra a visão geral, infraestrutura, justificativas das escolhas tecnológicas e tudo que precisa saber para acompanhar e gerenciar o desenvolvimento.
>
> O documento técnico para agentes de IA está em `PLANO_IMPLEMENTACAO.md`.

---

## O que é o Projeto

O **Descubra Juiz de Fora** é o portal turístico oficial da cidade. O objetivo é:

- Promover os atrativos turísticos de JF
- Fornecer informações úteis para visitantes
- Manter uma agenda de eventos culturais, esportivos e festivos
- Listar onde comer, beber e se hospedar
- Disponibilizar mapas interativos e guias para download
- Ter um painel administrativo para a Setur gerenciar todo o conteúdo

O site segue o "Mapa do Site" (PDF) elaborado pela equipe de planejamento.

---

## Como a Infraestrutura Funciona

### Visão Simplificada

```
 Visitante acessa o site pelo navegador
          │
          ▼
 ┌────────────────────┐
 │      VERCEL         │  ← Onde o site "mora" na internet
 │  (hospedagem grátis)│
 │                     │
 │  Entrega o site     │
 │  para o navegador   │
 └────────┬───────────┘
          │
          │  O site carregado no navegador do visitante
          │  busca os dados automaticamente:
          │
          ▼
 ┌────────────────────┐
 │     SUPABASE        │  ← Onde ficam os dados e as fotos
 │  (banco de dados    │
 │   grátis na nuvem)  │
 │                     │
 │  • Lista de         │
 │    experiências     │
 │  • Eventos          │
 │  • Restaurantes     │
 │  • Hospedagens      │
 │  • Fotos            │
 │  • Textos das       │
 │    páginas          │
 └────────────────────┘

 Admin da Setur acessa /admin
          │
          ▼
 ┌────────────────────┐
 │       CLERK         │  ← Verifica se é admin autorizado
 │  (login seguro)     │
 └────────┬───────────┘
          │
          ▼
 Painel para criar, editar e excluir conteúdo
 (experiências, eventos, banners, etc.)
```

### Visão Técnica Detalhada

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
│                                                              │
│  Visitante ──────┐                                           │
│  (celular/PC)    │                                           │
│                  ▼                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               VERCEL (CDN Global)                    │    │
│  │                                                      │    │
│  │  O que faz:                                          │    │
│  │  • Hospeda o site (HTML, CSS, JavaScript)            │    │
│  │  • Distribui via CDN (servidores no mundo todo)      │    │
│  │  • HTTPS automático (cadeado verde)                  │    │
│  │  • Deploy automático a cada push no GitHub           │    │
│  │  • Edge Functions (lógica server-side)               │    │
│  │                                                      │    │
│  │  Custo: GRÁTIS (100GB tráfego/mês)                   │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│            ┌────────────┼────────────┐                       │
│            ▼            ▼            ▼                       │
│  ┌──────────────┐ ┌──────────┐ ┌──────────────┐             │
│  │   SUPABASE   │ │  CLERK   │ │ CLOUDINARY   │             │
│  │              │ │          │ │ (futuro)     │             │
│  │ PostgreSQL   │ │ Autentic.│ │              │             │
│  │ (banco de    │ │ dos      │ │ Otimização   │             │
│  │  dados)      │ │ admins   │ │ de imagens   │             │
│  │              │ │          │ │              │             │
│  │ Storage      │ │ Login    │ │ CDN de fotos │             │
│  │ (fotos e     │ │ seguro   │ │              │             │
│  │  arquivos)   │ │ com MFA  │ │ Free: 25GB   │             │
│  │              │ │          │ │ /mês         │             │
│  │ API REST     │ │ Free:    │ └──────────────┘             │
│  │ (automática) │ │ 10k      │                               │
│  │              │ │ usuários │                               │
│  │ Free: 500MB  │ │ /mês     │                               │
│  │ DB + 1GB     │ └──────────┘                               │
│  │ storage      │                                            │
│  └──────────────┘                                            │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    GITHUB                            │    │
│  │                                                      │    │
│  │  Repositório do código-fonte                         │    │
│  │  Cada push → Vercel faz deploy automático            │    │
│  │                                                      │    │
│  │  Custo: GRÁTIS                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo do Visitante (passo a passo)

1. Visitante digita o endereço do site no navegador
2. **Vercel** entrega os arquivos do site (do servidor mais próximo, pode ser São Paulo)
3. O site carrega no navegador do visitante
4. O site faz chamadas ao **Supabase** para buscar experiências, eventos, etc.
5. Supabase retorna os dados em formato JSON
6. O site exibe os dados formatados com fotos, mapas, etc.

### Fluxo do Admin (passo a passo)

1. Admin acessa `/admin` no navegador
2. **Clerk** verifica se está logado → se não, mostra tela de login
3. Admin faz login com email + senha (opcionalmente com MFA)
4. Painel admin carrega com opções de gerenciamento
5. Admin cria/edita/exclui conteúdo → dados salvos no **Supabase**
6. Fotos enviadas vão para o **Supabase Storage**
7. Visitantes veem as mudanças instantaneamente (sem precisar de deploy)

---

## Tecnologias Escolhidas e Por Quê

### O que o Visitante Vê (Frontend)

| Tecnologia | O que faz | Por que essa? | Alternativa descartada |
|---|---|---|---|
| **React** | Constrói a interface do site | Maior ecossistema, fácil encontrar desenvolvedores, muitos componentes prontos | Vue, Angular (ecossistema menor no Brasil) |
| **TypeScript** | Adiciona tipos ao JavaScript | Previne erros, facilita manutenção a longo prazo | JavaScript puro (mais propenso a bugs) |
| **Vite** | Ferramenta de build | 10x mais rápido que alternativas, padrão atual do mercado | Create React App (lento, descontinuado) |
| **TailwindCSS** | Estilização (CSS) | Classes prontas, bundle pequeno, fácil manter | CSS puro (trabalhoso), Styled Components (mais pesado) |
| **React Router** | Navegação entre páginas | Padrão do mercado para React | Next.js (complexidade desnecessária para este projeto) |
| **React Query** | Cache de dados do servidor | Evita requisições duplicadas, loading automático | Redux (overkill para este caso) |
| **Leaflet** | Mapas interativos | 100% grátis, sem API key, usa OpenStreetMap | Google Maps (pago), Mapbox (limite de uso) |
| **Swiper** | Carrosséis e banners | Touch-friendly, leve, responsivo | Slick (mais antigo e pesado) |
| **React Helmet** | SEO (meta tags) | Meta tags dinâmicas essenciais para Google | Nenhuma (indispensável) |

### O que Fica na Nuvem (Backend/Infraestrutura)

| Tecnologia | O que faz | Por que essa? | Alternativa descartada |
|---|---|---|---|
| **Supabase** | Banco de dados + API + Storage | Tudo em um lugar, grátis, PostgreSQL confiável | Firebase (menos generoso para dados relacionais) |
| **Clerk** | Login dos administradores | Setup em 10 minutos, tela de login pronta, MFA | Auth0 (mais complexo de configurar) |
| **Vercel** | Hospedagem do site | Deploy automático, CDN global, HTTPS, grátis | Netlify (similar, mas Vercel é mais rápido) |
| **GitHub** | Repositório do código | Padrão do mercado, integração nativa com Vercel | GitLab (funciona, mas menos integrado) |

### Por que NÃO usamos um backend tradicional (Node.js, Python, etc.)

Um backend tradicional precisaria de:
- Servidor rodando 24/7 (custo)
- Manutenção de atualizações de segurança
- Configuração de banco de dados separado
- API escrita manualmente
- Deploy manual ou CI/CD complexo

O **Supabase elimina tudo isso**: o banco de dados já vem com uma API REST automática. O site fala direto com o Supabase, sem intermediários. Zero servidores para manter.

### Por que NÃO usamos WordPress

- WordPress é pesado e lento
- Requer hospedagem PHP (não é grátis de qualidade)
- Vulnerável a ataques (precisa de manutenção constante)
- Limitado em personalização de layout
- Não atende os requisitos de mapa interativo e calendário dinâmico

### Por que NÃO usamos Next.js

Next.js adiciona Server-Side Rendering (SSR), que é útil para SEO. Porém:
- O React com React Helmet Async resolve o SEO suficientemente bem para este projeto
- SSR adiciona complexidade no deploy e manutenção
- Para um portal turístico com conteúdo que muda pouco, SPA + bom cache é suficiente
- Se no futuro precisarmos de SSR, a migração é possível

---

## Quanto Custa

### Agora: R$ 0,00/mês

| Serviço | O que é grátis | Limite |
|---|---|---|
| **Vercel** | Hospedagem + CDN + HTTPS | 100GB de tráfego/mês (~100 mil visitas) |
| **Supabase** | Banco de dados + Storage + API | 500MB dados + 1GB fotos |
| **Clerk** | Autenticação admin | 10.000 usuários ativos/mês |
| **GitHub** | Repositório de código | Ilimitado para repos públicos |
| **Leaflet/OpenStreetMap** | Mapas | Totalmente ilimitado |
| **Domínio .gov.br** | Endereço do site | Grátis para órgãos públicos |

### Se o site crescer muito (>100k visitas/mês)

| Serviço | Plano pago | Custo estimado |
|---|---|---|
| Vercel Pro | 1TB tráfego | ~US$ 20/mês |
| Supabase Pro | 8GB dados + 100GB storage | ~US$ 25/mês |
| Cloudinary | Otimização de imagens | ~US$ 0 (free tier é generoso) |

**Nota**: Esses custos só seriam necessários com muito sucesso. Para a realidade de JF, o free tier é mais que suficiente.

---

## O que Cada Tabela do Banco de Dados Guarda

| Tabela | O que guarda | Quem alimenta |
|---|---|---|
| `experiencias` | Atrativos turísticos (museus, parques, etc.) | Admin via painel |
| `categorias_experiencia` | Tipos: Afroturismo, Ao Ar Livre, etc. | Pré-configurado (9 categorias) |
| `roteiros` | Caminhos temáticos (das Compras, da Cultura, etc.) | Admin via painel |
| `roteiro_pontos` | Pontos/paradas de cada roteiro | Admin via painel |
| `eventos` | Eventos culturais, shows, festas, etc. | Admin via painel |
| `estabelecimentos_gastronomia` | Restaurantes, bares, cafés | Admin via painel |
| `categorias_gastronomia` | Tipos: Cozinha Mineira, Botecos, etc. | Pré-configurado (10 categorias) |
| `hospedagens` | Hotéis, pousadas, hostels, flats | Admin via painel |
| `paginas_conteudo` | Textos das páginas (História, Como Chegar, etc.) | Admin via editor |
| `materiais_download` | PDFs, mapas, guias, press kits | Admin via painel |
| `banners` | Imagens do banner rotativo da home | Admin via painel |
| `contato_mensagens` | Mensagens recebidas pelo formulário de contato | Visitantes (automático) |

---

## Páginas do Site e o que Cada Uma Faz

### Públicas (visitantes)

| Página | URL | Descrição |
|---|---|---|
| **Home** | `/` | Banner rotativo, destaques, carrossel de experiências, agenda resumida |
| **Experiências** | `/experiencias` | Lista filtrada por categoria de todos os atrativos turísticos |
| **Detalhe Experiência** | `/experiencias/museu-mariano-procopio` | Fotos, descrição, mapa, horários, contato |
| **Roteiros** | `/roteiros` | Lista de caminhos temáticos (Compras, Cultura, Origens, etc.) |
| **Detalhe Roteiro** | `/roteiros/caminho-das-origens` | Mapa com pins, descrição de cada parada |
| **Agenda** | `/agenda` | Calendário de eventos com filtro por data e gratuidade |
| **Detalhe Evento** | `/agenda/festival-de-inverno-2026` | Detalhes do evento, local, link externo |
| **Onde Comer** | `/onde-comer` | Guia gastronômico filtrado por categoria |
| **Detalhe Restaurante** | `/onde-comer/restaurante-x` | Info completa do estabelecimento |
| **Onde Ficar** | `/onde-ficar` | Lista de hospedagens filtrada por tipo |
| **Detalhe Hospedagem** | `/onde-ficar/hotel-x` | Info completa, contato, comodidades |
| **História** | `/juiz-de-fora/historia` | Linha do tempo e história da cidade |
| **Informações** | `/juiz-de-fora/informacoes` | Transporte, saúde, segurança, clima |
| **Como Chegar** | `/juiz-de-fora/como-chegar` | Aeroporto, rodoviária, rodovias, mapa |
| **Imprensa** | `/juiz-de-fora/imprensa` | Releases e materiais para download |
| **Setur** | `/juiz-de-fora/setur` | Sobre a Secretaria de Turismo |
| **Mapas e Guias** | `/mapas-e-guias` | Mapa interativo com pins + guias para download |
| **Contato** | `/contato` | Formulário + telefone + email + endereço |

### Admin (apenas para a Setur)

| Página | URL | O que faz |
|---|---|---|
| **Dashboard** | `/admin` | Visão geral (totais, últimas atualizações) |
| **Experiências** | `/admin/experiencias` | Criar, editar, excluir atrativos turísticos |
| **Eventos** | `/admin/eventos` | Gerenciar agenda de eventos |
| **Roteiros** | `/admin/roteiros` | Gerenciar caminhos temáticos |
| **Gastronomia** | `/admin/gastronomia` | Gerenciar restaurantes, bares, etc. |
| **Hospedagens** | `/admin/hospedagens` | Gerenciar hotéis, pousadas, etc. |
| **Banners** | `/admin/banners` | Gerenciar banner rotativo da home |
| **Páginas** | `/admin/paginas` | Editar textos (História, Como Chegar, etc.) |
| **Downloads** | `/admin/downloads` | Gerenciar materiais para download |
| **Mensagens** | `/admin/mensagens` | Ver mensagens do formulário de contato |

---

## Fases de Implementação (visão para o gestor)

O desenvolvimento é dividido em 7 fases. **O site pode ir ao ar a partir da Fase 1.** Cada fase seguinte adiciona funcionalidades.

### Fase 1 - MVP (o mínimo para ir ao ar)

**O que entrega:**
- Site no ar com visual completo (header, footer, home)
- Banner rotativo com fotos de JF
- Carrossel de experiências na home
- Página completa de experiências (lista + detalhe de cada atrativo)
- Painel admin para gerenciar experiências e banners
- Deploy automático

**O que você precisa providenciar:**
- [ ] Criar conta no Supabase (supabase.com)
- [ ] Criar conta no Vercel (vercel.com)
- [ ] Criar conta no Clerk (clerk.com)
- [ ] Criar repositório no GitHub
- [ ] Logo "Descubra Juiz de Fora" (PNG ou SVG)
- [ ] Logos da Prefeitura e Setur para o rodapé
- [ ] Pelo menos 5-10 experiências com:
  - Nome, descrição curta e completa
  - 1-3 fotos de boa qualidade
  - Endereço, horário, contato
  - Categoria (Afroturismo, Ao Ar Livre, etc.)
  - Coordenadas (latitude/longitude) - pode pegar do Google Maps
- [ ] 3-5 fotos para o banner rotativo da home
- [ ] Links das redes sociais oficiais
- [ ] Paleta de cores e identidade visual

---

### Fase 2 - Agenda + Roteiros

**O que entrega:**
- Calendário de eventos com filtros por data
- Página de roteiros/caminhos com mapa interativo
- Seção de agenda na home com dados reais

**O que você precisa providenciar:**
- [ ] Lista de eventos com: título, data, local, foto, categoria
- [ ] Roteiros existentes (Caminho das Compras, da Cultura, etc.) com descrição
- [ ] Links dos mapas Google My Maps de cada roteiro

---

### Fase 3 - Onde Comer + Onde Ficar

**O que entrega:**
- Guia gastronômico completo
- Lista de hospedagens

**O que você precisa providenciar:**
- [ ] Lista de estabelecimentos gastronômicos com: nome, endereço, categoria, foto, horário, contato
- [ ] Lista de hospedagens com: nome, tipo, endereço, foto, contato, estrelas

---

### Fase 4 - Páginas Institucionais

**O que entrega:**
- Todas as páginas do menu "Juiz de Fora" (História, Informações, Como Chegar, Imprensa, Setur)
- Sistema de materiais para download

**O que você precisa providenciar:**
- [ ] Texto da página "História de Juiz de Fora"
- [ ] Texto da página "Informações Turísticas"
- [ ] Texto da página "Como Chegar"
- [ ] Releases e press kits para a página de Imprensa
- [ ] Texto sobre a Setur (missão, valores, equipe)
- [ ] Fotos de apoio para cada página

---

### Fase 5 - Mapas, Contato e Busca

**O que entrega:**
- Mapa interativo com TODOS os atrativos como pins clicáveis
- Formulário de contato funcional
- Busca global no header

**O que você precisa providenciar:**
- [ ] Telefone, email e endereço da Setur para a página de contato
- [ ] Guias/mapas em PDF para a página de downloads

---

### Fase 6 - SEO e Performance

**O que entrega:**
- Site otimizado para aparecer no Google
- Compartilhamento bonito em redes sociais (WhatsApp, Facebook)
- Site rápido e acessível

**O que você precisa providenciar:**
- [ ] Descrição curta do site para o Google (~160 caracteres)
- [ ] Descrição curta de cada página para o Google

---

### Fase 7 - Internacionalização

**O que entrega:**
- Site disponível em Português, Inglês e Espanhol
- Funcionalidades avançadas (PWA, analytics)

**O que você precisa providenciar:**
- [ ] Traduções dos textos da interface para EN e ES
- [ ] Decisão sobre traduzir conteúdo (experiências, eventos, etc.) ou manter só em PT

---

## Segurança

### O que já está protegido por padrão

- **HTTPS**: Vercel fornece automaticamente (cadeado verde no navegador)
- **Autenticação**: Apenas admins logados via Clerk podem alterar dados
- **Row Level Security**: O banco de dados no Supabase tem regras que impedem alterações não autorizadas
- **Rate Limiting**: Vercel limita automaticamente requisições excessivas (proteção contra ataques)
- **CORS**: Apenas o domínio oficial pode acessar a API

### Recomendações

- Usar senhas fortes para as contas admin
- Ativar MFA (autenticação em dois fatores) no Clerk
- Não compartilhar as chaves do Supabase publicamente
- Revisar periodicamente quem tem acesso admin

---

## Monitoramento

| Ferramenta | O que monitora | Custo |
|---|---|---|
| **Vercel Dashboard** | Visitas, performance, uso de bandwidth | Grátis (incluído) |
| **Supabase Dashboard** | Uso do banco de dados, requisições | Grátis (incluído) |
| **UptimeRobot** | Se o site está no ar (alerta por email se cair) | Grátis (50 monitores) |
| **Sentry** (opcional) | Erros JavaScript no site | Grátis (5000 eventos/mês) |

---

## Glossário (para não-técnicos)

| Termo | O que significa |
|---|---|
| **CDN** | Rede de servidores distribuídos pelo mundo que entrega o site do servidor mais próximo do visitante |
| **Deploy** | Publicar uma nova versão do site na internet |
| **API** | Interface que permite o site buscar dados do banco de dados |
| **SPA** | Single Page Application - o site carrega uma vez e navega sem recarregar a página |
| **HTTPS** | Protocolo seguro (cadeado verde) que criptografa a comunicação |
| **MFA** | Autenticação em dois fatores (senha + código no celular) |
| **RLS** | Row Level Security - regras no banco que controlam quem pode ler/escrever dados |
| **Slug** | Versão amigável do nome para URLs (ex: "Museu Mariano Procópio" → `museu-mariano-procopio`) |
| **Free tier** | Plano gratuito de um serviço, com limites generosos |
| **Frontend** | A parte visual do site que o visitante vê e interage |
| **Backend** | A parte "invisível" que guarda os dados e processa informações |
| **BaaS** | Backend as a Service - backend pronto na nuvem, sem precisar programar servidor |

---

## Estrutura de Arquivos do Projeto

```
descubraJF/
│
├── PLANO_IMPLEMENTACAO.md    ← Documento técnico para agentes de IA
├── DOCUMENTACAO.md           ← Este documento (para humanos)
├── Mapa do Site.pdf          ← Documento original de planejamento
│
├── public/                   ← Arquivos estáticos (logo, favicon)
│
├── src/                      ← Código-fonte do site
│   ├── components/           ← Peças reutilizáveis (botões, cards, etc.)
│   │   ├── layout/           ← Header, Footer
│   │   ├── ui/               ← Componentes visuais genéricos
│   │   └── sections/         ← Seções da home
│   │
│   ├── pages/                ← Uma pasta por página do site
│   │   ├── Home.tsx
│   │   ├── experiences/      ← /experiencias
│   │   ├── events/           ← /agenda
│   │   ├── routes/           ← /roteiros
│   │   ├── dining/           ← /onde-comer
│   │   ├── lodging/          ← /onde-ficar
│   │   ├── city/             ← /juiz-de-fora/*
│   │   └── admin/            ← Painel administrativo
│   │
│   ├── hooks/                ← Lógica de busca de dados
│   ├── lib/                  ← Configurações e utilitários
│   ├── types/                ← Definições de tipos de dados
│   └── i18n/                 ← Traduções (Fase 7)
│
├── .env.local                ← Chaves secretas (NÃO vai para o GitHub)
├── package.json              ← Lista de dependências do projeto
└── vite.config.ts            ← Configuração do build
```

---

## Perguntas Frequentes

### O site precisa de manutenção?

Mínima. As plataformas (Vercel, Supabase, Clerk) são gerenciadas. A única manutenção periódica recomendada é:
- Atualizar dependências de segurança (~1x/mês, ~30 minutos)
- Limpar eventos antigos periodicamente (pode ser automatizado)
- Manter o conteúdo atualizado via painel admin

### E se o site ficar fora do ar?

O UptimeRobot envia um email de alerta. A Vercel tem 99.9% de uptime. Se houver problema, geralmente se resolve sozinho em minutos. Se persistir, verificar o dashboard da Vercel e do Supabase.

### Posso trocar as fotos e textos sem programar?

Sim! Todo o conteúdo é gerenciado pelo painel admin (`/admin`). Basta fazer login e usar os formulários para criar, editar ou excluir conteúdo. As mudanças aparecem instantaneamente no site.

### Posso adicionar novas categorias de experiências?

Sim, pelo painel admin. As categorias são dinâmicas - você pode criar, renomear ou desativar pelo admin.

### E se eu quiser mudar o visual do site?

Mudanças visuais requerem alteração no código. Você precisará de um desenvolvedor (ou agente de IA) para isso. Mas trocar cores e textos no código com TailwindCSS é relativamente simples.

### E se quisermos um domínio próprio?

Basta registrar o domínio (ex: `descubrajf.jf.gov.br`) e configurá-lo na Vercel. O processo leva ~15 minutos e a Vercel gera o certificado HTTPS automaticamente.

### Como faço backup dos dados?

O Supabase faz backups automáticos diários no plano gratuito. Para backup manual, você pode exportar os dados via painel do Supabase a qualquer momento.

---

**Última atualização:** 25/03/2026
**Versão:** 1.0
