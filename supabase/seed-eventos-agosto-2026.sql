-- ===========================================
-- SEED: Eventos de Agosto 2026 (planilha "Eventos com potencial turístico 2026")
-- 1) Corrige data/local de 5 eventos ja existentes que divergiam da planilha
-- 2) Insere 64 eventos novos. Idempotente: ON CONFLICT (slug) DO NOTHING.
-- Excluido: "Raphael Castro Mota" (20/08) — marcado como "Não irá acontecer".
--
-- IMPORTANTE: o frontend formata datas no fuso do navegador (America/Sao_Paulo).
-- A convencao do app e gravar meia-noite de Brasilia (03:00 UTC). O SET abaixo
-- garante que literais de data sejam interpretados em BRT, senao eventos
-- aparecem um dia antes no site.
-- ===========================================

SET timezone = 'America/Sao_Paulo';

-- --- Correcoes de eventos existentes ---

-- Planilha: 01/08 e 02/08, Shopping Jardim Norte (DB tinha organizador no lugar do local e sem data_fim)
UPDATE eventos SET data_fim = '2026-08-02', local_nome = 'Shopping Jardim Norte'
WHERE slug = 'encontro-de-veiculos-antigos';

-- Planilha: 07/08 a 09/08, Associacao Portuguesa (DB tinha 01/08 sem fim e sem local)
UPDATE eventos SET data_inicio = '2026-08-07', data_fim = '2026-08-09', local_nome = 'Associação Portuguesa de Juiz de Fora'
WHERE slug = 'festa-portuguesa';

-- Planilha: 22/08, Terrazzo Centro de Eventos (DB tinha 14-16/08 na Praca Tarcisio Delgado)
UPDATE eventos SET data_inicio = '2026-08-22', data_fim = NULL, local_nome = 'Terrazzo Centro de Eventos'
WHERE slug = 'miss-brasil-gay';

-- Planilha: 07/08 a 09/08, Espaco Cultural do Mercado Municipal (DB tinha 14-16/08 no Shopping Jardim Norte)
UPDATE eventos SET data_inicio = '2026-08-07', data_fim = '2026-08-09', local_nome = 'Espaço Cultural do Mercado Municipal'
WHERE slug = 'harmoniza-iv-festival-de-vinhos-e-queijos-do-caminho-novo';

-- Planilha: 14/08 a 16/08 e 21/08 a 23/08 (DB tinha 21-30/08)
UPDATE eventos SET data_inicio = '2026-08-14', data_fim = '2026-08-23',
  descricao_curta = 'Festival gastronômico da KB Produções no estacionamento do Shopping Jardim Norte, nos fins de semana de 14 a 16/08 e 21 a 23/08.'
WHERE slug = 'festival-de-torresmo-e-costela';

-- Praca Antonio Carlos foi renomeada; planilha usa o nome oficial atual
UPDATE eventos SET local_nome = 'Praça Prefeito Tarcísio Delgado'
WHERE slug IN ('rainbow-fest', 'baile-do-manifesto');

-- --- Ajustes de fidelidade a planilha (2a rodada) ---

-- Titulos alinhados ao texto exato da planilha (as duas paradas sao eventos distintos: 08/08 GAG-MGM e 23/08 ASTRA)
UPDATE eventos SET titulo = 'Parada do Orgulho LGBT+ de Juiz de Fora' WHERE slug = 'parada-gay';
UPDATE eventos SET titulo = 'Encontro de Veículos Antigos AVAJF' WHERE slug = 'encontro-de-veiculos-antigos';
UPDATE eventos SET titulo = 'V Festa Portuguesa de Juiz de Fora' WHERE slug = 'festa-portuguesa';
UPDATE eventos SET titulo = 'Miss Brasil Gay 2026' WHERE slug = 'miss-brasil-gay';
UPDATE eventos SET titulo = 'IV Harmoniza – Festival de Vinhos e Queijos do Caminho Novo' WHERE slug = 'harmoniza-iv-festival-de-vinhos-e-queijos-do-caminho-novo';
UPDATE eventos SET titulo = 'Queen Celebration In Concert Symphonique' WHERE slug = 'queen-celebration-in-concert';

-- Divergencias encontradas fora de agosto na conferencia geral contra a planilha
UPDATE eventos SET titulo = 'São João de Fora' WHERE slug = 'sao-joao-de-foro'; -- typo "Foro"
UPDATE eventos SET titulo = 'Seu Mercado Gastronomia 2026', data_inicio = '2026-04-30', data_fim = '2026-05-03' WHERE slug = 'seu-mercado-2026'; -- planilha: 30/04 a 03/05
UPDATE eventos SET titulo = 'Semana do Orgulho LGBTQIAPN+ de Juiz de Fora', data_inicio = '2026-06-27', data_fim = '2026-06-28' WHERE slug = 'semana-do-orgulho-lgbtqiapn'; -- planilha: 27 e 28/06

-- Evento sem correspondencia na planilha (removido a pedido)
DELETE FROM eventos WHERE slug = 'caminhando-pela-historia-no-mr-tugas';

-- --- Eventos novos ---

INSERT INTO eventos (titulo, slug, descricao_curta, data_inicio, data_fim, local_nome, local_endereco, link_externo, categoria, gratuito, destaque, ativo) VALUES
('20º Torneio Leiteiro e Amostra de Bezerras de Valadares', '20-torneio-leiteiro-e-amostra-de-bezerras-de-valadares', 'Torneio leiteiro e amostra de bezerras no Campo de Futebol de Valadares, público entre 1.001 e 3.000 pessoas.', '2026-07-30', '2026-08-02', 'Campo de Futebol de Valadares', NULL, NULL, 'festivo', true, false, true),
('Jantar, Colação e Baile - Formatura Medicina AVICENA T65', 'formatura-medicina-avicena-t65', 'Jantar, colação de grau e baile de formatura da turma AVICENA T65 no Expominas.', '2026-07-30', '2026-08-01', 'Expominas', NULL, NULL, 'festivo', false, false, true),
('Festival: Orquestra da USP', 'festival-orquestra-da-usp', 'Apresentação da Orquestra da USP pelo Centro Cultural Pró-Música no Cine Theatro Central.', '2026-08-01', NULL, 'Cine Theatro Central', NULL, NULL, 'show', false, false, true),
('28º Festival de Bandas Novas', '28-festival-de-bandas-novas', 'Festival de bandas novas na Praça Prefeito Tarcísio Delgado, primeira data.', '2026-08-01', NULL, 'Praça Prefeito Tarcísio Delgado', NULL, NULL, 'cultural', true, false, true),
('28º Festival de Bandas Novas', '28-festival-de-bandas-novas-15-08', 'Festival de bandas novas na Praça Prefeito Tarcísio Delgado, segunda data.', '2026-08-15', NULL, 'Praça Prefeito Tarcísio Delgado', NULL, NULL, 'cultural', true, false, true),
('Feira de Produtos Artesanais', 'feira-de-produtos-artesanais-08', 'Feira de produtos artesanais na Praça Poeta Daltemar Lima.', '2026-08-01', NULL, 'Praça Poeta Daltemar Lima', NULL, NULL, 'cultural', true, false, true),
('Cortejo dos Artistas da 22ª Campanha de Popularização do Teatro e Dança', 'cortejo-dos-artistas-22-campanha-teatro-e-danca', 'Cortejo da APAC com concentração no Parque Halfeld, descendo a Rua Halfeld até a Praça Prefeito Tarcísio Delgado.', '2026-08-01', NULL, 'Centro de Juiz de Fora', NULL, NULL, 'cultural', true, false, true),
('Brigada Quadrangular', 'brigada-quadrangular', 'Evento religioso da Igreja do Evangelho Quadrangular na Praça do Democrata.', '2026-08-01', NULL, 'Praça do Democrata', NULL, NULL, 'cultural', true, false, true),
('Baila Conmigo – Aniversário Madame Geváh', 'baila-conmigo-aniversario-madame-gevah', 'Festa de aniversário da Madame Geváh Produções no Cultural Bar.', '2026-08-01', NULL, 'Cultural Bar', NULL, NULL, 'festivo', false, false, true),
('Show Oriente', 'show-oriente', 'Show da banda Oriente no Lacueva Pub, público entre 251 e 1.000 pessoas.', '2026-08-01', NULL, 'Lacueva Pub', NULL, NULL, 'show', false, false, true),
('UniSocial', 'unisocial', 'Ação religiosa e social na praça da Rua Fausto Moreira Teixeira, zona norte.', '2026-08-02', NULL, 'Praça da Rua Fausto Moreira Teixeira - Zona Norte', NULL, NULL, 'cultural', true, false, true),
('Baile da Terceira Idade', 'baile-da-terceira-idade-08', 'Baile da terceira idade no Clube Sírio Libanês, aos domingos de agosto (02, 09, 16, 23 e 30/08).', '2026-08-02', '2026-08-30', 'Clube Sírio Libanês', NULL, NULL, 'festivo', false, false, true),
('Ação Truck Unicesumar', 'acao-truck-unicesumar', 'Ação itinerante da Unicesumar na Praça Cel. Jeremias Garcia, em Benfica.', '2026-08-04', NULL, 'Praça Cel. Jeremias Garcia - Benfica', NULL, NULL, 'cultural', true, false, true),
('Feira de Livros Promolivro', 'feira-de-livros-promolivro', 'Feira de livros da S&N Livraria e Papelaria no Shopping Jardim Norte.', '2026-08-05', '2026-08-20', 'Shopping Jardim Norte', NULL, NULL, 'cultural', true, false, true),
('11º Torneio Leiteiro de Angolinha', '11-torneio-leiteiro-de-angolinha', 'Torneio leiteiro no campo de futebol da comunidade de Angolinha, zona rural de Juiz de Fora.', '2026-08-06', '2026-08-09', 'Campo de Futebol de Angolinha - Zona Rural', NULL, NULL, 'festivo', true, false, true),
('Loja Itinerante Casas Bahia', 'loja-itinerante-casas-bahia', 'Loja itinerante das Casas Bahia na Praça Cel. Jeremias Garcia, em Benfica.', '2026-08-06', '2026-08-09', 'Praça Cel. Jeremias Garcia - Benfica', NULL, NULL, 'cultural', true, false, true),
('5º Festival Beer do Bem', '5-festival-beer-do-bem', 'Festival beneficente da Rede Feminina de Combate ao Câncer na Praça Poeta Daltemar Lima, Bom Pastor.', '2026-08-07', '2026-08-09', 'Praça Poeta Daltemar Lima - Bom Pastor', NULL, NULL, 'gastronomico', true, false, true),
('Gilsons - Tour Eu Vejo Luz', 'gilsons-tour-eu-vejo-luz', 'Show dos Gilsons pela Feat Produções no Cine-Theatro Central.', '2026-08-07', NULL, 'Cine-Theatro Central', NULL, NULL, 'show', false, false, true),
('Festa da Colheita', 'festa-da-colheita-nilo-sotto-maior', 'Festa da colheita na Praça Nilo Sotto Maior.', '2026-08-08', NULL, 'Praça Nilo Sotto Maior', NULL, NULL, 'festivo', true, false, true),
('Arraiá do Lalado 2026', 'arraia-do-lalado-2026', 'Arraiá na Rua João Pires de Almeida, Jardim Esperança, público entre 251 e 1.000 pessoas.', '2026-08-08', NULL, 'Rua João Pires de Almeida - Jardim Esperança', NULL, NULL, 'festivo', true, false, true),
('Arraial do JK', 'arraial-do-jk', 'Arraial na Rua Aleixo Magaldi, bairro JK.', '2026-08-08', NULL, 'Rua Aleixo Magaldi - JK', NULL, NULL, 'festivo', true, false, true),
('Festa Agostina', 'festa-agostina-colegio-avancar', 'Festa agostina do Colégio Avançar no Barão de Juiz de Fora.', '2026-08-08', NULL, 'Barão de Juiz de Fora', NULL, NULL, 'festivo', false, false, true),
('Feira Guava Mercado Municipal', 'feira-guava-mercado-municipal', 'Feira Guava no Mercado Municipal, público entre 251 e 1.000 pessoas.', '2026-08-08', NULL, 'Mercado Municipal', NULL, NULL, 'cultural', true, false, true),
('Distrito Infernal', 'distrito-infernal-teatro', 'Espetáculo teatral "Distrito Infernal" no Teatro Paschoal Carlos Magno.', '2026-08-08', NULL, 'Teatro Paschoal Carlos Magno', NULL, NULL, 'cultural', false, false, true),
('Baile da Antiga Melody', 'baile-da-antiga-melody', 'Baile da antiga melody na Praça M. Elidia, São Benedito.', '2026-08-08', NULL, 'Praça M. Elidia - São Benedito', NULL, NULL, 'festivo', true, false, true),
('8 Anos do Projeto Rodrigues', '8-anos-do-projeto-rodrigues', 'Comemoração dos 8 anos do Projeto Rodrigues na Tenda Music.', '2026-08-08', NULL, 'Tenda Music', NULL, NULL, 'cultural', false, false, true),
('Festa da Colheita', 'festa-da-colheita-santa-cruz', 'Festa da colheita na Rua Nilo Peçanha, Santa Cruz.', '2026-08-08', '2026-08-09', 'Rua Nilo Peçanha, 180 - Santa Cruz', NULL, NULL, 'festivo', true, false, true),
('Corrida For Run – VidaAtiva e Black Fitness', 'corrida-for-run-vidaativa-e-black-fitness', 'Corrida da Black Fitness com percurso pela Via São Pedro e Centro de Futebol Zico.', '2026-08-09', NULL, 'Via São Pedro / Centro de Futebol Zico', NULL, NULL, 'esportivo', false, false, true),
('Festa Agostina da Associação de Moradores', 'festa-agostina-da-associacao-de-moradores', 'Festa agostina na Rua Filomena Carlota de Jesus.', '2026-08-09', NULL, 'Rua Filomena Carlota de Jesus', NULL, NULL, 'festivo', true, false, true),
('Patrulha Canina Super Poderes', 'patrulha-canina-super-poderes', 'Espetáculo infantil Patrulha Canina Super Poderes no Cine-Theatro Central.', '2026-08-09', NULL, 'Cine-Theatro Central', NULL, NULL, 'show', false, false, true),
('Festival Kids', 'festival-kids', 'Festival infantil no Independência Shopping.', '2026-08-09', NULL, 'Independência Shopping', NULL, NULL, 'festivo', false, false, true),
('10º Torneio Leiteiro e 13ª Agrofest da Vila Almeida', '10-torneio-leiteiro-e-13-agrofest-da-vila-almeida', 'Torneio leiteiro e Agrofest promovidos pela PJF no Campo de Futebol da Vila Almeida.', '2026-08-13', '2026-08-16', 'Campo de Futebol da Vila Almeida', NULL, NULL, 'festivo', true, false, true),
('Trilhas Sonoras', 'trilhas-sonoras', 'Concerto Trilhas Sonoras do Centro Cultural Pró-Música no Cine Theatro Central.', '2026-08-14', NULL, 'Cine Theatro Central', NULL, NULL, 'show', false, false, true),
('Colação de Grau Med XXXIII', 'colacao-de-grau-med-xxxiii', 'Colação de grau da turma Med XXXIII no Expominas.', '2026-08-14', NULL, 'Expominas', NULL, NULL, 'festivo', false, false, true),
('Corrida da Advocacia', 'corrida-da-advocacia', 'Corrida da OAB Seccional MG na Universidade Federal de Juiz de Fora.', '2026-08-15', '2026-08-16', 'Universidade Federal de Juiz de Fora', NULL, NULL, 'esportivo', false, false, true),
('Ares Juiz de Fora', 'ares-juiz-de-fora', 'Evento da Nossa Senhora das Produções na Praça Poeta Daltemar Lima, Bom Pastor.', '2026-08-15', NULL, 'Praça Poeta Daltemar Lima - Bom Pastor', NULL, NULL, 'festivo', true, false, true),
('Festa da Roça IBCE', 'festa-da-roca-ibce', 'Festa da roça do IBCE na Rua Pitangui, Nossa Senhora das Graças.', '2026-08-15', NULL, 'Rua Pitangui, 132 - Nossa Senhora das Graças', NULL, NULL, 'festivo', true, false, true),
('Sons da Zona Norte', 'sons-da-zona-norte', 'Evento cultural Sons da Zona Norte no Parque Halfeld.', '2026-08-15', NULL, 'Parque Halfeld', NULL, NULL, 'cultural', true, false, true),
('Tradicional Festa em Honra de Nossa Senhora do Livramento', 'festa-nossa-senhora-do-livramento', 'Festa religiosa na Rua da Matriz, ao lado da Igreja Matriz.', '2026-08-15', NULL, 'Rua da Matriz - ao lado da Igreja Matriz', NULL, NULL, 'festivo', true, false, true),
('Disk Racismo', 'disk-racismo', 'Evento cultural na quadra de futebol do Jóquei Clube III.', '2026-08-15', NULL, 'Rua Fausto Moreira, 88 - Jóquei Clube III', NULL, NULL, 'cultural', true, false, true),
('Bang!', 'bang', 'Evento na Pista de Skate Rusível Silva, Viaduto Augusto Franco.', '2026-08-15', NULL, 'Pista de Skate Rusível Silva - Vd. Augusto Franco', NULL, NULL, 'cultural', true, false, true),
('Sidney Magal', 'sidney-magal', 'Show de Sidney Magal pela BlueShow Entretenimento no Cine-Theatro Central.', '2026-08-15', NULL, 'Cine-Theatro Central', NULL, NULL, 'show', false, false, true),
('2ª Corrida do Policiamento Especializado', '2-corrida-do-policiamento-especializado', 'Corrida no 2º Batalhão de Polícia Militar, público entre 1.001 e 3.000 pessoas.', '2026-08-16', NULL, '2º Batalhão de Polícia Militar', NULL, NULL, 'esportivo', false, false, true),
('Procissão da Festa de Nossa Senhora da Glória', 'procissao-da-festa-de-nossa-senhora-da-gloria', 'Procissão saindo da Igreja da Glória, atravessando a Av. dos Andradas e retornando à igreja.', '2026-08-16', NULL, 'Igreja da Glória', NULL, NULL, 'cultural', true, false, true),
('13º Torneio Leiteiro e Mostra de Novilhas de Paula Lima', '13-torneio-leiteiro-e-mostra-de-novilhas-de-paula-lima', 'Torneio leiteiro no Parque Estrela, Paula Lima.', '2026-08-20', '2026-08-23', 'Rua Vicente Hauck, Parque Estrela - Paula Lima', NULL, NULL, 'festivo', true, false, true),
('Ronaldo Hirata em Juiz de Fora', 'ronaldo-hirata-em-juiz-de-fora', 'Palestra de Ronaldo Hirata promovida pelo CRO-MG no Cine Theatro Central.', '2026-08-20', NULL, 'Cine Theatro Central', NULL, NULL, 'cultural', false, false, true),
('Antigos na Praça', 'antigos-na-praca', 'Encontro de veículos antigos na Praça Poeta Daltemar Lima, Bom Pastor.', '2026-08-22', NULL, 'Praça Poeta Daltemar Lima - Bom Pastor', NULL, NULL, 'cultural', true, false, true),
('Terceira Edição Cruzada Evangelista', 'terceira-edicao-cruzada-evangelista', 'Cruzada evangelista na Praça Deputado Clodesmidt Riani.', '2026-08-22', NULL, 'Praça Deputado Clodesmidt Riani', NULL, NULL, 'cultural', true, false, true),
('Flow Roots', 'flow-roots', 'Evento de música na Rua Leopoldo Schimidt, 200.', '2026-08-22', NULL, 'Rua Leopoldo Schimidt, 200', NULL, NULL, 'show', false, false, true),
('Festa da Colheita', 'festa-da-colheita-vida-nova', 'Festa da colheita da Casa de Oração Pentecostal Vida Nova, no Retiro.', '2026-08-22', NULL, 'Rua Adelaide Delgado de Almeida - Retiro', NULL, NULL, 'festivo', true, false, true),
('Encontro de Lendas Nacional', 'encontro-de-lendas-nacional', 'Convenção Encontro de Lendas Brasil no Trade Hotel Juiz de Fora.', '2026-08-22', NULL, 'Trade Hotel Juiz de Fora', NULL, NULL, 'cultural', false, false, true),
('IV Festa D''Italia de JF', 'iv-festa-d-italia-de-jf', 'Festa italiana da Associação Casa d''Italia e COMITES MG na Casa d''Italia.', '2026-08-22', '2026-08-23', 'Casa d''Italia', NULL, NULL, 'festivo', false, false, true),
('Bravo Tenores in Concert', 'bravo-tenores-in-concert', 'Concerto Bravo Tenores pela Vidaliere Music no Cine Theatro Central.', '2026-08-23', NULL, 'Cine Theatro Central', NULL, NULL, 'show', false, false, true),
('XXXVII Corrida Duque de Caxias', 'xxxvii-corrida-duque-de-caxias', 'Corrida Duque de Caxias no 4º GAC, público entre 1.001 e 3.000 pessoas.', '2026-08-23', NULL, '4º GAC', NULL, NULL, 'esportivo', false, false, true),
('Parada LGBTQIA+ de Juiz de Fora', 'parada-lgbtqia-de-juiz-de-fora', 'Parada da ASTRA-JF na Av. Rio Branco e Av. Presidente Itamar Franco, público entre 3.001 e 10.000 pessoas.', '2026-08-23', NULL, 'Av. Rio Branco e Av. Presidente Itamar Franco', NULL, NULL, 'festivo', true, false, true),
('Pré-Lançamento da Rota da Cerveja Artesanal Petrópolis-Juiz de Fora', 'pre-lancamento-rota-da-cerveja-artesanal-petropolis-jf', 'Pré-lançamento da rota da cerveja artesanal, por Sebrae Minas e Unicerva, no ZM Cultural Bar.', '2026-08-26', NULL, 'ZM Cultural Bar', NULL, NULL, 'gastronomico', false, false, true),
('ON Marketing Imobi', 'on-marketing-imobi', 'Evento de marketing imobiliário do Grupo Emídia no Trade Hotel Juiz de Fora.', '2026-08-26', NULL, 'Trade Hotel Juiz de Fora', NULL, NULL, 'cultural', false, false, true),
('2ª Semana da Cerveja Mineira', '2-semana-da-cerveja-mineira', 'Semana da cerveja mineira da Associação das Cervejas da Zona da Mata no Estacionamento do Estádio Municipal.', '2026-08-27', '2026-08-30', 'Estacionamento do Estádio Municipal', NULL, NULL, 'gastronomico', false, false, true),
('Culto de Louvor e Adoração (Ao Ar Livre Orando por JF)', 'culto-de-louvor-e-adoracao-orando-por-jf', 'Culto ao ar livre na Praça Pe. Geraldo Pelzers, Santa Luzia.', '2026-08-29', NULL, 'Praça Pe. Geraldo Pelzers - Santa Luzia', NULL, NULL, 'cultural', true, false, true),
('Festival Laços Araujo', 'festival-lacos-araujo', 'Festival cultural na Praça Prefeito Tarcísio Delgado, público entre 1.001 e 3.000 pessoas.', '2026-08-29', NULL, 'Praça Prefeito Tarcísio Delgado', NULL, NULL, 'cultural', true, false, true),
('Luan Santana – Além do Registro', 'luan-santana-alem-do-registro', 'Show de Luan Santana no Sport Club Juiz de Fora, público entre 3.001 e 10.000 pessoas.', '2026-08-29', NULL, 'Sport Club Juiz de Fora', NULL, NULL, 'show', false, false, true),
('Feijoada OAB/JF', 'feijoada-oab-jf', 'Feijoada da OAB/MG Subseção Juiz de Fora na Vibrare Eventos.', '2026-08-29', NULL, 'Vibrare Eventos', NULL, NULL, 'gastronomico', false, false, true),
('Planta & Raiz', 'planta-e-raiz', 'Show do Planta & Raiz no Cultural Bar.', '2026-08-29', NULL, 'Cultural Bar', NULL, NULL, 'show', false, false, true),
('Unicorn Summit (Edição Sul-Americana)', 'unicorn-summit-edicao-sul-americana', 'Summit de inovação em parceria com a Pró-Reitoria de Inovação da UFJF, na UFJF e atrações turísticas da cidade.', '2026-08-30', '2026-09-02', 'UFJF e atrações turísticas da cidade', NULL, NULL, 'cultural', false, false, true)
ON CONFLICT (slug) DO NOTHING;
