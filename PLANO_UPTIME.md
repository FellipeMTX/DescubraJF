# Plano: Monitoramento de Uptime com UptimeRobot

Documento de referência para configurar monitoramento gratuito do portal e prevenir pausa do Supabase free tier.

## Por que

O plano free do Supabase **pausa o projeto após 7 dias sem atividade no banco**. Para um portal turístico, isso significa: qualquer período sem visitantes (feriados, baixa temporada, site recém-lançado) e o banco dorme — o primeiro visitante a voltar vê erro até a reativação manual.

Solução escolhida: **UptimeRobot** (gratuito, sem código, sem dependência de GitHub Actions).

Ganhos:
- ✅ Banco do Supabase nunca pausa
- ✅ Alerta por email se o site cair
- ✅ Status page pública opcional
- ✅ Histórico de uptime/downtime de 3 meses

## Pré-requisitos

- [ ] Conta de email para receber alertas
- [ ] URL do projeto Supabase (`VITE_SUPABASE_URL` no `.env.local`)
- [ ] Anon key do Supabase (`VITE_SUPABASE_ANON_KEY` no `.env.local`)
- [ ] Domínio do site em produção (Vercel ou customizado)

## Passos

### 1. Criar conta
- Acessar [uptimerobot.com](https://uptimerobot.com)
- Sign Up grátis (não pede cartão)
- Confirmar email

### 2. Configurar Monitor #1 — Keep-alive do Supabase

Garante que o banco recebe queries regulares e nunca pausa.

| Campo | Valor |
|---|---|
| **Monitor Type** | HTTP(s) |
| **Friendly Name** | `Supabase - Keep Alive` |
| **URL** | `https://SEU-PROJETO.supabase.co/rest/v1/experiencias?select=id&limit=1` |
| **Monitoring Interval** | 5 minutes |
| **HTTP Method** | GET |
| **Custom HTTP Headers** | `apikey: SUA_ANON_KEY` |
| **Alert Contacts** | Email principal |

> Obs: a anon key já é pública (vai pro bundle do frontend), então não há risco em usá-la aqui.

### 3. Configurar Monitor #2 — Frontend

Garante que o site público está no ar (Vercel + DNS + SPA carregando).

| Campo | Valor |
|---|---|
| **Monitor Type** | Keyword |
| **Friendly Name** | `DescubraJF - Frontend` |
| **URL** | `https://descubrajf.com` (ou domínio Vercel) |
| **Monitoring Interval** | 5 minutes |
| **Keyword Type** | Should be present |
| **Keyword** | `Descubra Juiz de Fora` (ou outro texto fixo no `<title>` ou layout) |
| **Alert Contacts** | Email principal |

> Pegadinha: SPAs servem HTML estático e renderizam o conteúdo via JS. O UptimeRobot **não executa JS**, então a keyword precisa estar presente no HTML inicial — `<title>`, meta tags ou texto do app shell. Não usar texto que só aparece após fetch do Supabase.

### 4. Validar

- [ ] Aguardar 5-10 min após criar os monitores
- [ ] Status deve estar **Up** (verde) em ambos
- [ ] No painel, ver "Last Check" sendo atualizado
- [ ] Forçar um teste de alerta: pausar manualmente um monitor e verificar email

### 5. (Opcional) Status Page pública

Se quiser uma página tipo `status.descubrajf.com` mostrando uptime histórico:

- Em UptimeRobot: **Status Pages → Add New Status Page**
- Selecionar os 2 monitores
- Pode usar subdomínio gratuito (`descubrajf.statuspage.io`) ou apontar CNAME próprio
- Útil pra comunicar incidentes pra Setur/usuários

## Quando os alertas chegam

### "Monitor is down" no Supabase Keep-Alive
- Banco pausado: entrar em [app.supabase.com](https://app.supabase.com) e clicar em **Restore project**
- Banco quebrado: ver logs no painel do Supabase
- Excedeu limite (egress, MAU, etc): ver tabela em `Settings → Usage`

### "Monitor is down" no Frontend
- Erro de deploy: ver logs no painel da Vercel
- DNS quebrado: verificar registros no provedor de domínio
- Build falhou: ver Actions/CI no GitHub

## Custo previsto

**R$ 0,00 / mês.**

UptimeRobot Free comporta:
- Até 50 monitores (usaremos 2)
- Intervalo mínimo de 5 min (suficiente — Supabase precisa de 1 ping a cada 7 dias)
- Email ilimitado

## Quando considerar upgrade

Migrar para plano pago do UptimeRobot só faria sentido se:
- Precisar de intervalo < 5 min (improvável)
- Precisar de SMS/voice automatizados (improvável pra turismo)
- Mais que 1 status page

Cenário mais provável: nunca precisar pagar.

## Quando descontinuar este plano

Quando o Supabase for migrado para o plano **Pro ($25/mês)**, o keep-alive do Supabase pode ser removido (Pro não pausa por inatividade). O monitor de frontend continua útil pra uptime monitoring geral.

## Referências

- [UptimeRobot Pricing](https://uptimerobot.com/pricing/)
- [Supabase Free Tier — Pause Policy](https://supabase.com/pricing)
- [Supabase Docs — Pausing](https://supabase.com/docs/guides/platform/billing-faq)

## Status

- [ ] Plano não iniciado
- [ ] Conta UptimeRobot criada
- [ ] Monitor Supabase configurado
- [ ] Monitor Frontend configurado
- [ ] Status page criada (opcional)
- [ ] Alerta testado
testestestestse