-- ===========================================
-- Adiciona campo de data de publicação aos posts
-- Rodar no SQL Editor do Supabase
-- ===========================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS data_publicacao TIMESTAMPTZ;

COMMENT ON COLUMN posts.data_publicacao IS
  'Data de publicação escolhida pelo admin. Quando NULL, o frontend usa created_at como fallback.';
