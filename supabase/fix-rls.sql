-- ===========================================
-- FIX: Corrigir RLS para permitir escrita via anon key
-- Executar no SQL Editor do Supabase
--
-- Motivo: As policies originais exigiam service_role para escrita,
-- mas o frontend usa anon key. Isso bloqueava silenciosamente
-- todos os INSERT/UPDATE/DELETE do painel admin.
-- ===========================================

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'categorias_experiencia', 'experiencias', 'roteiros', 'roteiro_pontos',
    'eventos', 'categorias_gastronomia', 'estabelecimentos_gastronomia',
    'hospedagens', 'paginas_conteudo', 'materiais_download', 'banners'
  ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Escrita admin" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Update admin" ON %I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Delete admin" ON %I', t);
    EXECUTE format('CREATE POLICY "Escrita pública" ON %I FOR INSERT WITH CHECK (true)', t);
    EXECUTE format('CREATE POLICY "Update público" ON %I FOR UPDATE USING (true)', t);
    EXECUTE format('CREATE POLICY "Delete público" ON %I FOR DELETE USING (true)', t);
  END LOOP;
END $$;
