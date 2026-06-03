-- ===========================================
-- Roteiros: layout rico editável + pontos de destaque
-- Executar no SQL Editor do Supabase (idempotente, pode rodar de novo).
--
-- Adiciona:
--   roteiros.layout       -> JSONB com todo o conteúdo da página
--                            (hero, stats, sobre, dicas, CTA)
--   roteiro_pontos.imagem -> foto do card de destaque
--   roteiro_pontos.local  -> rótulo de localização ("Centro")
-- ===========================================

-- 1. Coluna de layout em roteiros
ALTER TABLE roteiros ADD COLUMN IF NOT EXISTS layout JSONB;

-- 2. Garante a tabela de pontos (caso este banco nunca tenha rodado o setup.sql)
CREATE TABLE IF NOT EXISTS roteiro_pontos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roteiro_id UUID REFERENCES roteiros(id) ON DELETE CASCADE,
  experiencia_id UUID REFERENCES experiencias(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  local TEXT,
  imagem TEXT,
  ordem INT DEFAULT 0,
  latitude DECIMAL,
  longitude DECIMAL
);

-- 3. Colunas novas (caso a tabela já existisse sem elas)
ALTER TABLE roteiro_pontos ADD COLUMN IF NOT EXISTS imagem TEXT;
ALTER TABLE roteiro_pontos ADD COLUMN IF NOT EXISTS local TEXT;

-- 4. RLS: leitura pública + escrita aberta (admin protegido por Clerk no front)
ALTER TABLE roteiro_pontos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Leitura pública" ON roteiro_pontos;
DROP POLICY IF EXISTS "Escrita pública" ON roteiro_pontos;
DROP POLICY IF EXISTS "Update público" ON roteiro_pontos;
DROP POLICY IF EXISTS "Delete público" ON roteiro_pontos;
CREATE POLICY "Leitura pública" ON roteiro_pontos FOR SELECT USING (true);
CREATE POLICY "Escrita pública" ON roteiro_pontos FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público" ON roteiro_pontos FOR UPDATE USING (true);
CREATE POLICY "Delete público" ON roteiro_pontos FOR DELETE USING (true);

-- 5. Recarrega o cache de schema do PostgREST (senão a API não enxerga as mudanças)
NOTIFY pgrst, 'reload schema';
