-- ===========================================
-- Seed do roteiro "Caminho das Compras" (layout de referência)
-- Requer: add-roteiro-layout.sql já aplicado.
-- Reexecutável: apaga e recria o roteiro pelo slug (cascata nos pontos).
-- ===========================================

DO $$
DECLARE rid UUID;
BEGIN
  DELETE FROM roteiros WHERE slug = 'caminho-das-compras';

  INSERT INTO roteiros (nome, slug, descricao_curta, descricao, mapa_url, layout, ativo, destaque, ordem)
  VALUES (
    'Caminho das Compras',
    'caminho-das-compras',
    'O comércio tradicional e as galerias que fazem parte da história de Juiz de Fora.',
    'Um roteiro pelo coração comercial da cidade, onde a tradição do comércio central se encontra com a modernidade dos shoppings e centros comerciais.',
    'https://www.google.com/maps?q=Centro,+Juiz+de+Fora+-+MG&output=embed',
    '{
      "hero": {
        "eyebrow": "Caminhos pela cidade",
        "titulo": "Caminho das",
        "tituloAccent": "Compras",
        "subtitulo": "O comércio tradicional e as galerias que fazem parte da história de Juiz de Fora.",
        "descricao": "Um roteiro pelo coração comercial da cidade, onde a tradição do comércio central se encontra com a modernidade dos shoppings e centros comerciais.",
        "ctaPrimaryLabel": "Ver no mapa",
        "ctaSecondaryLabel": "Salvar roteiro"
      },
      "stats": [
        { "icon": "shopping-bag", "label": "Espaços comerciais", "value": "40+", "descricao": "nesta rota" },
        { "icon": "shopping-cart", "label": "Lojas e galerias", "value": "300+", "descricao": "opções" },
        { "icon": "clock", "label": "Duração sugerida", "value": "2h – 4h", "descricao": "roteiro a pé" },
        { "icon": "footprints", "label": "Modalidade", "value": "Caminhada", "descricao": "centro da cidade" },
        { "icon": "building", "label": "Ideal para", "value": "Compras, cafés", "descricao": "e experiências" },
        { "icon": "clock", "label": "Melhor horário", "value": "Manhã e tarde", "descricao": "dias de semana" }
      ],
      "sobre": {
        "titulo": "Sobre o roteiro",
        "paragrafos": [
          "Juiz de Fora tem características de um verdadeiro shopping a céu aberto, onde a tradição do comércio central contrasta com a modernidade dos shoppings e centros comerciais.",
          "No Caminho das Compras, o destaque é o centro da cidade, onde galerias interligam ruas, muitas delas exclusivas para pedestres, formando uma rede com cerca de 40 espaços comerciais.",
          "Entre lojas, cafés, salões e restaurantes, o percurso é também um convite para vivenciar o cotidiano local, seja para fazer compras, encontrar amigos ou simplesmente bater perna."
        ],
        "card": {
          "titulo": "Comércio que conta histórias",
          "descricao": "As galerias e lojas do centro guardam memórias de gerações. Muito mais que compras, este roteiro é sobre tradição, cultura e encontros.",
          "bullets": [
            { "icon": "landmark", "titulo": "Centro histórico", "descricao": "Ruas e galerias cheias de vida" },
            { "icon": "gem", "titulo": "Tradição e modernidade", "descricao": "Do comércio local aos grandes centros" },
            { "icon": "coffee", "titulo": "Experiências", "descricao": "Cafés, serviços e muito mais" },
            { "icon": "footprints", "titulo": "A pé", "descricao": "Roteiro pensado para ser feito caminhando" }
          ]
        }
      },
      "destaquesTitulo": "Destaques do roteiro",
      "dicas": {
        "titulo": "Dicas para aproveitar melhor",
        "items": [
          { "icon": "clock", "titulo": "Planeje sua rota", "descricao": "Use o mapa para organizar seu percurso e aproveitar melhor o dia." },
          { "icon": "coffee", "titulo": "Faça pausas", "descricao": "Aproveite os cafés e restaurantes do centro para relaxar." },
          { "icon": "shopping-bag", "titulo": "Explore sem pressa", "descricao": "Muitas lojas têm produtos regionais e marcas locais imperdíveis." },
          { "icon": "camera", "titulo": "Registre momentos", "descricao": "Cada esquina do centro guarda histórias e cenários instagramáveis!" }
        ]
      },
      "mapsLink": "https://www.google.com/maps/search/?api=1&query=Centro+Juiz+de+Fora+MG",
      "bottomCta": {
        "titulo": "Viva o centro, valorize o local",
        "descricao": "Apoie o comércio da nossa cidade e faça parte dessa história.",
        "label": "Ver outros roteiros"
      }
    }'::jsonb,
    true, true, 1
  ) RETURNING id INTO rid;

  INSERT INTO roteiro_pontos (roteiro_id, nome, descricao, local, ordem) VALUES
  (rid, 'Independência Shopping', 'Um dos mais tradicionais centros comerciais da cidade.', 'Centro', 0),
  (rid, 'Galeria Pio X', 'Galeria histórica com ótimo comércio e serviços.', 'Centro', 1),
  (rid, 'Marechal Center', 'Referência em variedade de lojas no centro.', 'Centro', 2),
  (rid, 'Mister Shopping', 'Clássico do comércio central de Juiz de Fora.', 'Centro', 3),
  (rid, 'Rua Halfeld', 'A principal rua de compras e passeio da cidade.', 'Centro', 4);
END $$;
