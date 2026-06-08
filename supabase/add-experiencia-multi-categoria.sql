-- Múltiplas categorias por atrativo (Opção A: coluna array)
-- Mantém categoria_id como categoria principal (legado) e adiciona categoria_ids[].

ALTER TABLE experiencias
  ADD COLUMN IF NOT EXISTS categoria_ids uuid[] NOT NULL DEFAULT '{}';

-- Migra a categoria única existente para o array
UPDATE experiencias
SET categoria_ids = ARRAY[categoria_id]
WHERE categoria_id IS NOT NULL
  AND categoria_ids = '{}';

-- Índice GIN para filtrar por categoria (operadores @> e &&)
CREATE INDEX IF NOT EXISTS experiencias_categoria_ids_idx
  ON experiencias USING GIN (categoria_ids);
