-- ===========================================
-- Posts (Notícias)
-- Executar no SQL Editor do Supabase
-- ===========================================

-- 1. Tabela posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL CHECK (categoria IN ('noticia')),
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL,
  resumo TEXT,
  conteudo_html TEXT,
  imagem_capa TEXT,
  autor TEXT,
  publicado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (categoria, slug)
);

CREATE INDEX IF NOT EXISTS idx_posts_categoria_publicado
  ON posts (categoria, publicado, created_at DESC);

-- 2. RLS (mesmo padrão das outras tabelas do projeto)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON posts FOR SELECT USING (true);
CREATE POLICY "Escrita pública" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público" ON posts FOR UPDATE USING (true);
CREATE POLICY "Delete público" ON posts FOR DELETE USING (true);
