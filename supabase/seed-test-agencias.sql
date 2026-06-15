-- ===========================================
-- Dados de TESTE — 5 agências de turismo
-- Rodar no SQL Editor do Supabase
-- Pra remover depois, descomente o bloco DELETE no final
-- ===========================================

INSERT INTO servicos (nome, slug, descricao, descricao_curta, categoria_id, pagina, endereco, bairro, contato, link_externo, ativo, ordem)
VALUES
  (
    'Mata da Serra Turismo',
    'mata-da-serra-turismo',
    'Receptivo especializado em roteiros pela Serra da Mantiqueira, com guias bilíngues e transporte próprio. Operação desde 2008 com foco em ecoturismo e turismo cultural na região da Zona da Mata mineira.',
    'Receptivo e ecoturismo na Mantiqueira',
    (SELECT id FROM categorias_servicos WHERE slug = 'agencias' AND pagina = 'servicos' LIMIT 1),
    'servicos',
    'Rua Halfeld, 414 — Sala 803',
    'Centro',
    '{"telefone": "(32) 3215-7820", "email": "contato@matadaserra.tur.br", "site": "https://matadaserra.tur.br", "instagram": "https://instagram.com/matadaserra"}'::jsonb,
    'https://matadaserra.tur.br',
    true,
    100
  ),
  (
    'Roteiros JF Receptivo',
    'roteiros-jf-receptivo',
    'Agência de turismo receptivo com city tours guiados, passeios temáticos pelo patrimônio histórico de Juiz de Fora e pacotes para grupos e eventos corporativos.',
    'City tours e roteiros culturais',
    (SELECT id FROM categorias_servicos WHERE slug = 'agencias' AND pagina = 'servicos' LIMIT 1),
    'servicos',
    'Av. Barão do Rio Branco, 2.288 — Loja 12',
    'Centro',
    '{"telefone": "(32) 3026-4499", "email": "reservas@roteirosjf.com.br", "site": "https://roteirosjf.com.br", "instagram": "https://instagram.com/roteirosjf"}'::jsonb,
    'https://roteirosjf.com.br',
    true,
    101
  ),
  (
    'Caminhos do Café Expedições',
    'caminhos-do-cafe-expedicoes',
    'Expedições pela rota do café da Zona da Mata, com visitas a fazendas históricas, degustação de cafés especiais e oficinas de torra. Saídas semanais com transporte e refeições inclusas.',
    'Expedições pela rota do café',
    (SELECT id FROM categorias_servicos WHERE slug = 'agencias' AND pagina = 'servicos' LIMIT 1),
    'servicos',
    'Rua Santo Antônio, 765',
    'Granbery',
    '{"telefone": "(32) 99812-3344", "email": "ola@caminhosdocafe.tur.br", "site": "https://caminhosdocafe.tur.br", "instagram": "https://instagram.com/caminhosdocafe"}'::jsonb,
    'https://caminhosdocafe.tur.br',
    true,
    102
  ),
  (
    'Trilha & Aventura JF',
    'trilha-aventura-jf',
    'Aventura outdoor com trilhas guiadas, cachoeirismo, rapel e cicloturismo nas serras ao redor de Juiz de Fora. Equipamentos inclusos e níveis para iniciantes e experientes.',
    'Trilhas, rapel e cicloturismo',
    (SELECT id FROM categorias_servicos WHERE slug = 'agencias' AND pagina = 'servicos' LIMIT 1),
    'servicos',
    'Rua Mister Moore, 110',
    'São Mateus',
    '{"telefone": "(32) 99701-5566", "email": "vamos@trilhaaventurajf.com.br", "instagram": "https://instagram.com/trilhaaventurajf"}'::jsonb,
    NULL,
    true,
    103
  ),
  (
    'JF Cultural Tours',
    'jf-cultural-tours',
    'Tours culturais a pé pelo centro histórico, com foco em arquitetura, vida noturna e gastronomia local. Saídas diárias em português, inglês e espanhol.',
    'Walking tours pelo centro histórico',
    (SELECT id FROM categorias_servicos WHERE slug = 'agencias' AND pagina = 'servicos' LIMIT 1),
    'servicos',
    'Praça da Estação, s/n',
    'Centro',
    '{"telefone": "(32) 3022-8810", "email": "hello@jfculturaltours.com", "site": "https://jfculturaltours.com"}'::jsonb,
    'https://jfculturaltours.com',
    true,
    104
  );

-- ===========================================
-- Remover quando não precisar mais (descomente):
-- ===========================================
-- DELETE FROM servicos WHERE slug IN (
--   'mata-da-serra-turismo',
--   'roteiros-jf-receptivo',
--   'caminhos-do-cafe-expedicoes',
--   'trilha-aventura-jf',
--   'jf-cultural-tours'
-- );
