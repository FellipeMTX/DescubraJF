-- Adiciona a categoria "Museus" aos Atrativos e marca os 5 museus nela.
-- categoria_ids é uuid[] (multi-categoria), então os museus continuam também
-- em "História e Cultura" — nada é removido.
-- Idempotente: pode rodar mais de uma vez sem duplicar.
-- Aplicar no SQL Editor do Supabase (projeto de produção).

-- 1) Categoria "Museus" (ordem 10, ícone "palette" = Arte)
INSERT INTO categorias_experiencia (nome, slug, icone, ordem, ativo)
SELECT 'Museus', 'museus', 'palette', 10, true
WHERE NOT EXISTS (
  SELECT 1 FROM categorias_experiencia WHERE slug = 'museus'
);

-- 2) Marca os 5 museus com a categoria "Museus" (append, mantém as existentes)
UPDATE experiencias e
SET categoria_ids = (
  SELECT ARRAY(SELECT DISTINCT unnest(e.categoria_ids || ARRAY[m.id]))
  FROM categorias_experiencia m
  WHERE m.slug = 'museus'
)
WHERE e.id IN (
  '55398671-6cca-425c-b623-a84bd5da4bfe', -- Museu de Artes Murilo Mendes
  'd445b9ff-a9c1-4cc8-98c6-4fb4fd3b6c00', -- Museu de Etnologia Indígena e História Natural
  '8d407014-098d-4ae2-8f76-96744721a98e', -- Museu do Crédito Real
  '589a7c97-c7f6-4258-86e1-9e45323da403', -- Museu Ferroviário
  '093dca74-7505-4c91-bee3-94df7121c595'  -- Museu Mariano Procópio
)
AND NOT (
  e.categoria_ids @> (SELECT ARRAY[id] FROM categorias_experiencia WHERE slug = 'museus')
);

-- Conferência (opcional):
-- SELECT nome, slug, icone, ordem FROM categorias_experiencia WHERE slug = 'museus';
-- SELECT e.nome FROM experiencias e, categorias_experiencia m
--   WHERE m.slug = 'museus' AND e.categoria_ids @> ARRAY[m.id];
