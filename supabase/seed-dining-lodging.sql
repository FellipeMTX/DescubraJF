-- ===========================================
-- SEED: Estabelecimentos Gastronômicos e Hospedagens
-- Executar no SQL Editor do Supabase após setup.sql
-- ===========================================

DO $$
DECLARE
  cat_mineira UUID;
  cat_bares UUID;
  cat_cafes UUID;
  cat_pizzarias UUID;
  cat_cervejarias UUID;
  cat_bar_rua UUID;
  cat_restaurantes UUID;
  cat_churrascarias UUID;
BEGIN
  SELECT id INTO cat_mineira FROM categorias_gastronomia WHERE slug = 'cozinha-mineira';
  SELECT id INTO cat_bares FROM categorias_gastronomia WHERE slug = 'bares-e-botecos';
  SELECT id INTO cat_cafes FROM categorias_gastronomia WHERE slug = 'cafes-e-confeitarias';
  SELECT id INTO cat_pizzarias FROM categorias_gastronomia WHERE slug = 'pizzarias-e-massas';
  SELECT id INTO cat_cervejarias FROM categorias_gastronomia WHERE slug = 'cervejarias-e-drinks';
  SELECT id INTO cat_bar_rua FROM categorias_gastronomia WHERE slug = 'bar-na-rua';
  SELECT id INTO cat_restaurantes FROM categorias_gastronomia WHERE slug = 'restaurantes-e-bistros';
  SELECT id INTO cat_churrascarias FROM categorias_gastronomia WHERE slug = 'churrascarias-e-carnes';

  -- Estabelecimentos Gastronômicos
  INSERT INTO estabelecimentos_gastronomia (nome, slug, descricao_curta, descricao, categoria_gastronomia_id, endereco, bairro, latitude, longitude, faixa_preco, estacionamento, ativo, ordem) VALUES
  (
    'Restaurante Dona Felicidade',
    'dona-felicidade',
    'Comida mineira tradicional feita no fogão a lenha.',
    'O Dona Felicidade é referência em culinária mineira em Juiz de Fora. Funciona há mais de 30 anos servindo pratos tradicionais como tutu, feijão tropeiro, frango com quiabo e torresmo. O ambiente rústico e acolhedor remete às fazendas mineiras. O buffet de almoço é farto e o preço justo.',
    cat_mineira, 'Rua Halfeld, 828', 'Centro',
    -21.7608, -43.3489, 1, false, true, 1
  ),
  (
    'Bar do Gomez',
    'bar-do-gomez',
    'Boteco tradicional com petiscos e cerveja gelada.',
    'O Bar do Gomez é um dos botecos mais tradicionais de Juiz de Fora. Conhecido pelo ambiente descontraído, petiscos generosos e cerveja sempre gelada. O bolinho de bacalhau e a porção de linguiça são os carros-chefe. Ponto de encontro de amigos e famílias nos fins de semana.',
    cat_bares, 'Av. Rio Branco, 1540', 'Centro',
    -21.7635, -43.3512, 1, false, true, 2
  ),
  (
    'Café com Letras',
    'cafe-com-letras',
    'Café artesanal com ambiente literário e bolos caseiros.',
    'O Café com Letras une a paixão por café especial e literatura. O espaço possui estantes com livros para troca, mesas aconchegantes e uma vitrine de bolos e tortas caseiras que é impossível resistir. Os cafés são preparados com grãos de torrefações locais. Ideal para trabalho remoto ou leitura.',
    cat_cafes, 'Rua Santo Antônio, 1190', 'São Mateus',
    -21.7572, -43.3548, 2, false, true, 3
  ),
  (
    'Pizzaria Matheus',
    'pizzaria-matheus',
    'Pizzas artesanais com massa de fermentação natural.',
    'A Pizzaria Matheus se destaca pela massa de fermentação natural de 72 horas e ingredientes selecionados. O forno a lenha garante o sabor defumado característico. A pizza de muçarela de búfala com rúcula e a calabresa com cebola roxa são as mais pedidas. Ambiente informal e aconchegante.',
    cat_pizzarias, 'Rua Espírito Santo, 870', 'Centro',
    -21.7598, -43.3475, 2, false, true, 4
  ),
  (
    'Cervejaria Albanos',
    'cervejaria-albanos',
    'Cervejaria artesanal com rótulos premiados e petiscos.',
    'A Cervejaria Albanos é uma das pioneiras da cena cervejeira artesanal de Juiz de Fora. Com rótulos premiados em concursos nacionais, oferece desde IPAs aromáticas até Stouts encorpadas. O espaço tem um brewpub aconchegante com petiscos harmonizados. Visitas guiadas à fábrica disponíveis.',
    cat_cervejarias, 'Rua Marechal Deodoro, 450', 'São Mateus',
    -21.7560, -43.3520, 2, true, true, 5
  ),
  (
    'Bar na Rua JF',
    'bar-na-rua-jf',
    'Festival gastronômico a céu aberto na Rua Halfeld.',
    'O Bar na Rua é um evento gastronômico que acontece periodicamente na Rua Halfeld, no coração de Juiz de Fora. Reúne food trucks, cervejarias artesanais, música ao vivo e muita animação. É um dos eventos mais esperados da cidade, atraindo milhares de pessoas a cada edição.',
    cat_bar_rua, 'Rua Halfeld', 'Centro',
    -21.7615, -43.3501, 1, false, true, 6
  ),
  (
    'Bistrô da Serra',
    'bistro-da-serra',
    'Gastronomia autoral com ingredientes da região.',
    'O Bistrô da Serra propõe uma culinária autoral que valoriza ingredientes locais e sazonais. O chef trabalha com produtores da região da Zona da Mata Mineira. O menu degustação é uma experiência completa, com harmonização de vinhos nacionais. Ambiente sofisticado mas sem formalidade excessiva.',
    cat_restaurantes, 'Rua Benjamin Constant, 1020', 'Centro',
    -21.7590, -43.3465, 3, true, true, 7
  ),
  (
    'Churrascaria Fogo de Chão',
    'churrascaria-fogo-de-chao',
    'Rodízio de carnes nobres com buffet completo.',
    'A Churrascaria Fogo de Chão oferece um rodízio completo com cortes nobres como picanha, costela, cordeiro e fraldinha. O buffet frio e quente complementa com saladas, massas e acompanhamentos variados. O atendimento é atencioso e o ambiente comporta eventos e confraternizações.',
    cat_churrascarias, 'Av. Presidente Itamar Franco, 2800', 'São Mateus',
    -21.7545, -43.3590, 3, true, true, 8
  );

  -- Hospedagens
  INSERT INTO hospedagens (nome, slug, descricao_curta, descricao, tipo, estrelas, endereco, bairro, latitude, longitude, faixa_preco, comodidades, ativo, ordem) VALUES
  (
    'Hotel Imperador',
    'hotel-imperador',
    'Hotel clássico no centro com vista para o Parque Halfeld.',
    'O Hotel Imperador é um dos mais tradicionais de Juiz de Fora. Localizado no coração da cidade, oferece quartos confortáveis com vista para o Parque Halfeld. O café da manhã regional com pão de queijo, broa e frutas da estação é um destaque. Próximo a restaurantes, comércio e pontos turísticos.',
    'hotel', 4,
    'Av. Rio Branco, 2000', 'Centro',
    -21.7620, -43.3500, 2,
    ARRAY['wifi', 'estacionamento', 'café da manhã', 'ar condicionado', 'tv'],
    true, 1
  ),
  (
    'Pousada Morro do Cristo',
    'pousada-morro-do-cristo',
    'Pousada charmosa com vista panorâmica da cidade.',
    'A Pousada Morro do Cristo está localizada próximo ao mirante mais famoso de Juiz de Fora. Os quartos são decorados com estilo mineiro contemporâneo e oferecem vistas deslumbrantes. O jardim com rede e a lareira na sala comum tornam a estadia ainda mais especial. Ideal para casais e viajantes que buscam tranquilidade.',
    'pousada', 3,
    'Rua do Mirante, 150', 'São Mateus',
    -21.7553, -43.3670, 2,
    ARRAY['wifi', 'café da manhã', 'jardim', 'lareira'],
    true, 2
  ),
  (
    'JF Hostel',
    'jf-hostel',
    'Hostel moderno e econômico para mochileiros e viajantes.',
    'O JF Hostel oferece dormitórios compartilhados e quartos privativos a preços acessíveis. A cozinha compartilhada, o espaço de convivência com jogos e a localização central fazem dele a melhor opção para viajantes econômicos. O staff organiza walking tours gratuitos pela cidade.',
    'hostel', 2,
    'Rua Halfeld, 600', 'Centro',
    -21.7605, -43.3495, 1,
    ARRAY['wifi', 'cozinha compartilhada', 'lavanderia', 'armários'],
    true, 3
  ),
  (
    'Flat Juiz de Fora Residence',
    'flat-jf-residence',
    'Apartamentos equipados para estadias curtas e longas.',
    'O Flat Juiz de Fora Residence oferece apartamentos completos com cozinha, sala e área de trabalho. Ideal para viagens de negócios ou estadias prolongadas. Cada unidade tem máquina de lavar, micro-ondas e utensílios de cozinha. O prédio conta com academia, piscina e estacionamento coberto.',
    'flat', 4,
    'Av. Presidente Itamar Franco, 3200', 'São Mateus',
    -21.7538, -43.3610, 2,
    ARRAY['wifi', 'cozinha completa', 'academia', 'piscina', 'estacionamento', 'lavanderia'],
    true, 4
  ),
  (
    'Hotel Serra Negra',
    'hotel-serra-negra',
    'Hotel executivo com centro de convenções.',
    'O Hotel Serra Negra atende tanto turistas quanto viajantes corporativos. Possui centro de convenções com capacidade para 200 pessoas, restaurante próprio e bar no rooftop com vista da cidade. Os quartos executivos incluem escritório e frigobar. Localização estratégica próxima à BR-040.',
    'hotel', 5,
    'BR-040, km 780', 'Cascatinha',
    -21.7400, -43.3700, 3,
    ARRAY['wifi', 'estacionamento', 'centro de convenções', 'restaurante', 'bar', 'room service', 'ar condicionado'],
    true, 5
  ),
  (
    'Pousada das Hortênsias',
    'pousada-das-hortensias',
    'Refúgio rural a 20 minutos do centro.',
    'A Pousada das Hortênsias é um refúgio em meio à natureza, cercada por jardins de hortênsias e Mata Atlântica. Oferece trilhas ecológicas, café colonial e atividades ao ar livre. Os chalés são rústicos mas confortáveis, com lareira e varanda privativa. Perfeita para desconectar da rotina.',
    'pousada', 3,
    'Estrada do Sarandira, km 8', 'Sarandira',
    -21.8000, -43.4200, 2,
    ARRAY['wifi', 'café colonial', 'trilhas', 'lareira', 'estacionamento'],
    true, 6
  );

END $$;
