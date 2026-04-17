-- ===========================================
-- Página Institucional da Secretaria de Turismo
-- Executar no SQL Editor do Supabase
-- ===========================================

-- 1. Tabela setur_pagina (linha única — conteúdo da página institucional)
CREATE TABLE IF NOT EXISTS setur_pagina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Hero
  hero_imagem TEXT,
  hero_titulo TEXT NOT NULL,
  hero_subtitulo TEXT,

  -- Intro
  intro_texto_1 TEXT,
  intro_texto_2 TEXT,
  intro_titulo_secao TEXT,
  intro_texto_3 TEXT,

  -- Missão / Visão / Valores
  missao_texto TEXT,
  visao_texto TEXT,
  valores TEXT[] DEFAULT '{}',

  -- Localização
  endereco TEXT,
  cep TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  horario TEXT,
  telefone TEXT,
  email TEXT,

  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela setur_equipe (lista de membros da equipe)
CREATE TABLE IF NOT EXISTS setur_equipe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_setur_equipe_ordem ON setur_equipe (ativo, ordem);

-- 3. RLS (mesmo padrão das outras tabelas do projeto)
ALTER TABLE setur_pagina ENABLE ROW LEVEL SECURITY;
ALTER TABLE setur_equipe ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON setur_pagina FOR SELECT USING (true);
CREATE POLICY "Escrita pública" ON setur_pagina FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público"   ON setur_pagina FOR UPDATE USING (true);
CREATE POLICY "Delete público"   ON setur_pagina FOR DELETE USING (true);

CREATE POLICY "Leitura pública" ON setur_equipe FOR SELECT USING (true);
CREATE POLICY "Escrita pública" ON setur_equipe FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público"   ON setur_equipe FOR UPDATE USING (true);
CREATE POLICY "Delete público"   ON setur_equipe FOR DELETE USING (true);

-- 4. Seed inicial — conteúdo atual da página
INSERT INTO setur_pagina (
  hero_imagem, hero_titulo, hero_subtitulo,
  intro_texto_1, intro_texto_2, intro_titulo_secao, intro_texto_3,
  missao_texto, visao_texto, valores,
  endereco, cep, latitude, longitude, horario, telefone, email
)
SELECT
  '/PacoMunicipal-01.webp',
  'Secretaria de Turismo de Juiz de Fora (SETUR/JF)',
  'Turismo como ferramenta para transformar a cidade, fortalecer nossa identidade e acolher quem chega.',

  'A Secretaria de Turismo de Juiz de Fora (Setur) foi criada pela Lei nº 13.830/2019 e regulamentada pelo Decreto nº 14.353/2021, marcando um novo capítulo para o turismo na cidade. Desde então, vem trabalhando com um propósito: fazer do turismo uma ferramenta para transformar a cidade, fortalecer a identidade de Juiz de Fora e acolher quem chega.',
  'Mais do que promover lugares, nosso objetivo é criar experiências, fortalecer o sentimento de pertencimento e movimentar a economia local. Aqui acreditamos que turismo é sobre pessoas, histórias e o jeito mineiro de receber bem.',
  'O que fazemos?',
  'A Secretaria de Turismo atua para valorizar a cultura local e divulgar Juiz de Fora para o Brasil e o mundo, planejando e organizando ações estratégicas que conectam moradores, visitantes e a cidade.',

  'Fomentar o turismo como ferramenta de desenvolvimento econômico, social e cultural de Juiz de Fora, promovendo experiências autênticas e valorizando o que temos de melhor: nosso povo, nossas histórias e nossas belezas.',
  'Ser referência no turismo de cidades de médio porte, com roteiros criativos, estrutura de qualidade e uma cidade que encanta tanto quem chega quanto quem mora aqui.',
  ARRAY[
    'Cuidado com a cidade e com as pessoas',
    'Parceria com a comunidade e com os setores produtivos',
    'Promoção da diversidade cultural',
    'Sustentabilidade ambiental e respeito ao patrimônio',
    'Inovação, transparência e escuta ativa'
  ],

  'Av. Brasil, 2001 - Centro, Juiz de Fora - MG',
  '36060-010',
  -21.75745023215519,
  -43.34381674657759,
  'Segunda a sexta-feira | 8h às 18h',
  '+55 (32) 2104-8171',
  'seturjf@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM setur_pagina);

-- 5. Seed da equipe inicial
INSERT INTO setur_equipe (cargo, nome, email, ordem)
SELECT * FROM (VALUES
  ('Secretário Municipal de Turismo', 'Eduardo José Crochet', 'eduardojosecrochet@gmail.com', 1),
  ('Gerente de Gestão, Qualificação e Marketing de Experiências e Produtos Turísticos', 'Fernanda Pires de Araújo', 'fernanda.seturjf@gmail.com', 2),
  ('Gerente de Articulação, Captação, Parcerias e Investimentos no Turismo', 'Carolina Barbosa Toledo', 'carolina.toledo@pjf.mg.gov.br', 3),
  ('Gerente de Promoção de Eventos, Regionalização e Programas Turísticos', 'Mayara Cristina de Souza Paiva', 'mayaraseturjf@gmail.com', 4)
) AS v(cargo, nome, email, ordem)
WHERE NOT EXISTS (SELECT 1 FROM setur_equipe);
