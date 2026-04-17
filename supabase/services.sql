-- ===========================================
-- Serviços e "A gente se vê por aí"
-- Executar no SQL Editor do Supabase
-- ===========================================

-- 1. Categorias (compartilhada entre as duas páginas)
CREATE TABLE IF NOT EXISTS categorias_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  icone TEXT,
  pagina TEXT NOT NULL DEFAULT 'servicos', -- 'servicos' ou 'passeios'
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true
);

-- 2. Itens de serviço/passeio
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  categoria_id UUID REFERENCES categorias_servicos(id) ON DELETE CASCADE,
  pagina TEXT NOT NULL DEFAULT 'servicos', -- 'servicos' ou 'passeios'
  imagem_destaque TEXT,
  endereco TEXT,
  bairro TEXT,
  contato JSONB,
  link_externo TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS
ALTER TABLE categorias_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON categorias_servicos FOR SELECT USING (true);
CREATE POLICY "Escrita pública" ON categorias_servicos FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público" ON categorias_servicos FOR UPDATE USING (true);
CREATE POLICY "Delete público" ON categorias_servicos FOR DELETE USING (true);

CREATE POLICY "Leitura pública" ON servicos FOR SELECT USING (true);
CREATE POLICY "Escrita pública" ON servicos FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público" ON servicos FOR UPDATE USING (true);
CREATE POLICY "Delete público" ON servicos FOR DELETE USING (true);
