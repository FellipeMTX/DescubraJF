-- ===========================================
-- Descubra Juiz de Fora - Setup do Banco
-- Executar no SQL Editor do Supabase
-- ===========================================

-- 1. Categorias de Experiência
CREATE TABLE IF NOT EXISTS categorias_experiencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icone TEXT,
  cor TEXT,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true
);

INSERT INTO categorias_experiencia (nome, slug, icone, cor, ordem) VALUES
  ('Afroturismo', 'afroturismo', 'globe', '#8B4513', 1),
  ('Ao Ar Livre', 'ao-ar-livre', 'trees', '#228B22', 2),
  ('Aventura e Esportes', 'aventura-e-esportes', 'mountain', '#FF4500', 3),
  ('Artesanato e Compras', 'artesanato-e-compras', 'shopping-bag', '#DAA520', 4),
  ('História e Cultura', 'historia-e-cultura', 'landmark', '#4169E1', 5),
  ('Infantil e Família', 'infantil-e-familia', 'baby', '#FF69B4', 6),
  ('Mirantes e Vistas Panorâmicas', 'mirantes-e-vistas', 'eye', '#20B2AA', 7),
  ('Música e Arte', 'musica-e-arte', 'music', '#9370DB', 8),
  ('Religiosidade', 'religiosidade', 'church', '#CD853F', 9);

-- 2. Experiências
CREATE TABLE IF NOT EXISTS experiencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  categoria_id UUID REFERENCES categorias_experiencia(id),
  latitude DECIMAL,
  longitude DECIMAL,
  imagem_destaque TEXT,
  imagens TEXT[],
  horario_funcionamento JSONB,
  contato JSONB,
  endereco TEXT,
  bairro TEXT,
  acessibilidade BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  gratuito BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Roteiros
CREATE TABLE IF NOT EXISTS roteiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  imagem_destaque TEXT,
  imagens TEXT[],
  mapa_url TEXT,
  mapa_embed_id TEXT,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Pontos de Roteiro
CREATE TABLE IF NOT EXISTS roteiro_pontos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roteiro_id UUID REFERENCES roteiros(id) ON DELETE CASCADE,
  experiencia_id UUID REFERENCES experiencias(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  ordem INT DEFAULT 0,
  latitude DECIMAL,
  longitude DECIMAL
);

-- 5. Eventos
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ,
  local_nome TEXT,
  local_endereco TEXT,
  experiencia_id UUID REFERENCES experiencias(id) ON DELETE SET NULL,
  imagem_destaque TEXT,
  link_externo TEXT,
  categoria TEXT,
  gratuito BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Categorias de Gastronomia
CREATE TABLE IF NOT EXISTS categorias_gastronomia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icone TEXT,
  ordem INT DEFAULT 0
);

INSERT INTO categorias_gastronomia (nome, slug, icone, ordem) VALUES
  ('Cozinha Mineira', 'cozinha-mineira', 'utensils', 1),
  ('Restaurantes e Bistrôs', 'restaurantes-e-bistros', 'chef-hat', 2),
  ('Bares e Botecos', 'bares-e-botecos', 'beer', 3),
  ('Cafés e Confeitarias', 'cafes-e-confeitarias', 'coffee', 4),
  ('Pizzarias e Massas', 'pizzarias-e-massas', 'pizza', 5),
  ('Churrascarias e Carnes', 'churrascarias-e-carnes', 'flame', 6),
  ('Cervejarias e Drinks', 'cervejarias-e-drinks', 'wine', 7),
  ('Comida Rápida e Lanches', 'comida-rapida-e-lanches', 'sandwich', 8),
  ('Opções Saudáveis e Vegetarianas', 'opcoes-saudaveis', 'salad', 9),
  ('Bar na Rua', 'bar-na-rua', 'map-pin', 10);

-- 7. Estabelecimentos Gastronômicos
CREATE TABLE IF NOT EXISTS estabelecimentos_gastronomia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  categoria_gastronomia_id UUID REFERENCES categorias_gastronomia(id),
  imagem_destaque TEXT,
  imagens TEXT[],
  endereco TEXT,
  bairro TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  horario_funcionamento JSONB,
  contato JSONB,
  faixa_preco INT,
  estacionamento BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Hospedagens
CREATE TABLE IF NOT EXISTS hospedagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  tipo TEXT NOT NULL,
  estrelas INT,
  imagem_destaque TEXT,
  imagens TEXT[],
  endereco TEXT,
  bairro TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  contato JSONB,
  comodidades TEXT[],
  faixa_preco INT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Páginas de Conteúdo
CREATE TABLE IF NOT EXISTS paginas_conteudo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  conteudo TEXT,
  imagem_destaque TEXT,
  imagens TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO paginas_conteudo (titulo, slug) VALUES
  ('História de Juiz de Fora', 'historia'),
  ('Informações Turísticas', 'informacoes-turisticas'),
  ('Como Chegar', 'como-chegar'),
  ('Assessoria de Imprensa', 'assessoria-de-imprensa'),
  ('Setur - JF', 'setur-jf');

-- 10. Materiais para Download
CREATE TABLE IF NOT EXISTS materiais_download (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_capa TEXT,
  arquivo_url TEXT NOT NULL,
  tipo TEXT,
  pagina TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  imagem_url TEXT NOT NULL,
  link TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Mensagens de Contato
CREATE TABLE IF NOT EXISTS contato_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  assunto TEXT,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Tabelas com leitura pública (apenas ativos) e escrita admin
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
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Leitura pública" ON %I FOR SELECT USING (true)', t);
    EXECUTE format('CREATE POLICY "Escrita pública" ON %I FOR INSERT WITH CHECK (true)', t);
    EXECUTE format('CREATE POLICY "Update público" ON %I FOR UPDATE USING (true)', t);
    EXECUTE format('CREATE POLICY "Delete público" ON %I FOR DELETE USING (true)', t);
  END LOOP;
END $$;

-- Contato: INSERT público, leitura somente admin
ALTER TABLE contato_mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Envio público" ON contato_mensagens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura admin" ON contato_mensagens
  FOR SELECT USING (auth.role() = 'service_role');

-- ===========================================
-- DADOS DE SEED (experiências de exemplo)
-- ===========================================

-- Buscar IDs das categorias para usar no seed
DO $$
DECLARE
  cat_historia UUID;
  cat_ar_livre UUID;
  cat_musica UUID;
  cat_mirantes UUID;
  cat_religiosidade UUID;
BEGIN
  SELECT id INTO cat_historia FROM categorias_experiencia WHERE slug = 'historia-e-cultura';
  SELECT id INTO cat_ar_livre FROM categorias_experiencia WHERE slug = 'ao-ar-livre';
  SELECT id INTO cat_musica FROM categorias_experiencia WHERE slug = 'musica-e-arte';
  SELECT id INTO cat_mirantes FROM categorias_experiencia WHERE slug = 'mirantes-e-vistas';
  SELECT id INTO cat_religiosidade FROM categorias_experiencia WHERE slug = 'religiosidade';

  INSERT INTO experiencias (nome, slug, descricao_curta, descricao, categoria_id, latitude, longitude, endereco, bairro, gratuito, acessibilidade, destaque, ordem) VALUES
  (
    'Museu Mariano Procópio',
    'museu-mariano-procopio',
    'Um dos museus mais importantes de Minas Gerais, com acervo histórico e artístico.',
    'O Museu Mariano Procópio (MMP) é um dos mais importantes museus de Minas Gerais. Fundado em 1921, possui um acervo de mais de 50 mil itens, incluindo pinturas, esculturas, mobiliário, armas, indumentárias e documentos históricos. O museu está instalado na Villa Ferreira Lage, um palacete em estilo renascentista cercado por um parque com espécies botânicas raras.',
    cat_historia, -21.7469, -43.3560,
    'Rua Mariano Procópio, 1100', 'Mariano Procópio',
    false, true, true, 1
  ),
  (
    'Parque da Lajinha',
    'parque-da-lajinha',
    'Área verde com trilhas, lagos e rica biodiversidade para toda a família.',
    'O Parque Natural Municipal da Lajinha é uma unidade de conservação com mais de 88 hectares de Mata Atlântica. Oferece trilhas ecológicas, lagos, playground, área para piquenique e uma rica biodiversidade. É o lugar perfeito para um passeio em família em contato com a natureza.',
    cat_ar_livre, -21.7810, -43.3725,
    'Av. Presidente Itamar Franco, 4001', 'São Pedro',
    true, true, true, 2
  ),
  (
    'Cine-Theatro Central',
    'cine-theatro-central',
    'Joia arquitetônica art déco, palco de grandes espetáculos culturais.',
    'O Cine-Theatro Central é um dos mais belos cinemas do Brasil. Inaugurado em 1929, o edifício em estilo art déco é tombado pelo patrimônio histórico e continua sendo palco de importantes eventos culturais, shows, peças de teatro e exibições de cinema. Sua fachada e interior são verdadeiras obras de arte.',
    cat_musica, -21.7612, -43.3496,
    'Av. Getúlio Vargas, 200', 'Centro',
    false, false, true, 3
  ),
  (
    'Morro do Imperador',
    'morro-do-imperador',
    'Vista panorâmica de 360° da cidade com o Cristo Redentor de Juiz de Fora.',
    'O Morro do Imperador, também conhecido como Morro do Cristo, oferece uma vista panorâmica de 360 graus de Juiz de Fora. No topo está a estátua do Cristo Redentor, um dos cartões-postais da cidade. É o ponto mais alto da área urbana, ideal para contemplar o pôr do sol e tirar fotos incríveis.',
    cat_mirantes, -21.7553, -43.3673,
    'Morro do Imperador', 'São Mateus',
    true, false, true, 4
  ),
  (
    'Catedral Metropolitana',
    'catedral-metropolitana',
    'Principal templo católico da cidade, com arquitetura imponente.',
    'A Catedral Metropolitana de Juiz de Fora, dedicada a Santo Antônio, é o principal templo católico da cidade. Sua construção em estilo eclético impressiona pela grandiosidade. O interior abriga belos vitrais e obras de arte sacra. Localizada no coração do centro, é parada obrigatória para quem aprecia arquitetura religiosa.',
    cat_religiosidade, -21.7620, -43.3472,
    'Av. Rio Branco, 2554', 'Centro',
    true, true, true, 5
  ),
  (
    'Parque Halfeld',
    'parque-halfeld',
    'Coração verde do centro da cidade, ponto de encontro dos juiz-foranos.',
    'O Parque Halfeld é o principal espaço de convivência do centro de Juiz de Fora. Com jardins bem cuidados, fontes, bancos e um coreto histórico, é o ponto de encontro tradicional dos moradores. Ao redor do parque estão importantes edifícios históricos e o comércio local.',
    cat_ar_livre, -21.7615, -43.3501,
    'Av. Rio Branco', 'Centro',
    true, true, true, 6
  );

  -- Banners de exemplo
  INSERT INTO banners (titulo, subtitulo, link, imagem_url, ordem) VALUES
  ('Museu Mariano Procópio', 'Descubra a história de Juiz de Fora', '/experiencias/museu-mariano-procopio', '/placeholder-banner.jpg', 1),
  ('Parque da Lajinha', 'Natureza e lazer para toda a família', '/experiencias/parque-da-lajinha', '/placeholder-banner.jpg', 2),
  ('Cine-Theatro Central', 'Uma joia da arquitetura art déco', '/experiencias/cine-theatro-central', '/placeholder-banner.jpg', 3);

  -- Eventos de exemplo
  INSERT INTO eventos (titulo, slug, descricao_curta, data_inicio, data_fim, local_nome, local_endereco, categoria, gratuito, destaque) VALUES
  ('Festival de Inverno', 'festival-de-inverno-2026', 'O maior festival cultural da cidade com shows, teatro e exposições.', '2026-07-10', '2026-07-20', 'Diversos locais', 'Centro e região', 'cultural', false, true),
  ('Feira de Artesanato', 'feira-artesanato-marco-2026', 'Artesanato local, gastronomia e música ao vivo.', '2026-04-05', '2026-04-06', 'Praça da Estação', 'Praça da Estação, Centro', 'cultural', true, true),
  ('Corrida de Rua JF', 'corrida-de-rua-jf-2026', 'Corrida de 5km e 10km pelas ruas históricas da cidade.', '2026-05-15', null, 'Parque Halfeld', 'Av. Rio Branco, Centro', 'esportivo', false, true),
  ('Mostra de Cinema', 'mostra-cinema-2026', 'Exibição de filmes nacionais e internacionais no Cine-Theatro Central.', '2026-06-01', '2026-06-07', 'Cine-Theatro Central', 'Av. Getúlio Vargas, 200', 'cultural', true, true),
  ('Bar na Rua', 'bar-na-rua-abril-2026', 'Festival gastronômico a céu aberto com cervejarias e food trucks.', '2026-04-19', null, 'Rua Halfeld', 'Rua Halfeld, Centro', 'gastronomico', true, true);
END $$;
