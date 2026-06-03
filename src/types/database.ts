export type CategoriaExperiencia = {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  cor: string | null;
  ordem: number;
  ativo: boolean;
};

export type Experiencia = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  categoria_id: string | null;
  latitude: number | null;
  longitude: number | null;
  imagem_destaque: string | null;
  imagens: string[] | null;
  horario_funcionamento: Record<string, string> | null;
  contato: {
    telefone?: string;
    email?: string;
    site?: string;
    instagram?: string;
    waze_link?: string;
    maps_link?: string;
  } | null;
  endereco: string | null;
  bairro: string | null;
  acessibilidade: boolean;
  pet_friendly: boolean;
  gratuito: boolean;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  categoria?: CategoriaExperiencia;
};

/** Item com ícone (nome kebab-case de `getIconByName`) + textos. */
export type RoteiroIconItem = {
  icon: string;
  titulo: string;
  descricao?: string;
};

/** Conteúdo rico da página de um roteiro, editável no /admin (coluna jsonb). */
export type RoteiroLayout = {
  hero: {
    eyebrow?: string;
    titulo: string;
    tituloAccent?: string;
    subtitulo?: string;
    descricao?: string;
    ctaPrimaryLabel?: string;
    ctaSecondaryLabel?: string;
  };
  stats: { icon: string; label: string; value: string; descricao?: string }[];
  sobre: {
    titulo: string;
    paragrafos: string[];
    card: {
      titulo: string;
      descricao?: string;
      bullets: RoteiroIconItem[];
    };
  };
  destaquesTitulo?: string;
  dicas: {
    titulo: string;
    items: RoteiroIconItem[];
  };
  /** Link externo para "Abrir roteiro no Google Maps". */
  mapsLink?: string;
  bottomCta: {
    titulo: string;
    descricao?: string;
    label?: string;
  };
};

export type Roteiro = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  imagem_destaque: string | null;
  imagens: string[] | null;
  mapa_url: string | null;
  mapa_embed_id: string | null;
  layout: RoteiroLayout | null;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
};

/** Ponto/parada de um roteiro — alimenta os cards de "Destaques". */
export type RoteiroPonto = {
  id: string;
  roteiro_id: string;
  experiencia_id: string | null;
  nome: string;
  descricao: string | null;
  local: string | null;
  imagem: string | null;
  ordem: number;
  latitude: number | null;
  longitude: number | null;
};

export type Evento = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  data_inicio: string;
  data_fim: string | null;
  local_nome: string | null;
  local_endereco: string | null;
  experiencia_id: string | null;
  imagem_destaque: string | null;
  link_externo: string | null;
  categoria: string | null;
  gratuito: boolean;
  destaque: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoriaGastronomia = {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  ordem: number;
};

export type EstabelecimentoGastronomia = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  imagem_destaque: string | null;
  imagens: string[] | null;
  endereco: string | null;
  bairro: string | null;
  latitude: number | null;
  longitude: number | null;
  horario_funcionamento: Record<string, string> | null;
  contato: {
    telefone?: string;
    email?: string;
    site?: string;
    instagram?: string;
    waze_link?: string;
    maps_link?: string;
  } | null;
  faixa_preco: number | null;
  estacionamento: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  categorias?: CategoriaGastronomia[];
};

export type Hospedagem = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  tipo: "hotel" | "pousada" | "hostel" | "flat";
  estrelas: number | null;
  imagem_destaque: string | null;
  imagens: string[] | null;
  endereco: string | null;
  bairro: string | null;
  latitude: number | null;
  longitude: number | null;
  contato: {
    telefone?: string;
    email?: string;
    site?: string;
    booking_url?: string;
    instagram?: string;
  } | null;
  comodidades: string[] | null;
  faixa_preco: number | null;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
};

export type PaginaConteudo = {
  id: string;
  titulo: string;
  slug: string;
  conteudo: string | null;
  imagem_destaque: string | null;
  imagens: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  ativo: boolean;
  updated_at: string;
};

export type MaterialDownload = {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_capa: string | null;
  arquivo_url: string;
  tipo: string | null;
  pagina: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
};

export type CategoriaServico = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  icone: string | null;
  pagina: "servicos" | "passeios";
  ordem: number;
  ativo: boolean;
};

export type Servico = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  categoria_id: string | null;
  pagina: "servicos" | "passeios";
  imagem_destaque: string | null;
  endereco: string | null;
  bairro: string | null;
  contato: {
    telefone?: string;
    email?: string;
    site?: string;
    instagram?: string;
  } | null;
  link_externo: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  categoria?: CategoriaServico;
};

export type PostCategoria = "noticia" | "programa_projeto";

export type Post = {
  id: string;
  categoria: PostCategoria;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo_html: string | null;
  imagem_capa: string | null;
  autor: string | null;
  publicado: boolean;
  /** Data de publicação escolhida pelo admin. Quando NULL, usar `created_at` como fallback. */
  data_publicacao: string | null;
  created_at: string;
  updated_at: string;
};

export type Banner = {
  id: string;
  titulo: string;
  subtitulo: string | null;
  imagem_url: string;
  link: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
};

export type SeturPagina = {
  id: string;
  hero_imagem: string | null;
  hero_titulo: string;
  hero_subtitulo: string | null;
  intro_texto_1: string | null;
  intro_texto_2: string | null;
  intro_titulo_secao: string | null;
  intro_texto_3: string | null;
  missao_texto: string | null;
  visao_texto: string | null;
  valores: string[];
  endereco: string | null;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
  horario: string | null;
  telefone: string | null;
  email: string | null;
  updated_at: string;
};

export type SeturMembro = {
  id: string;
  cargo: string;
  nome: string;
  email: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

