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
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  pontos?: RoteiroPonto[];
};

export type RoteiroPonto = {
  id: string;
  roteiro_id: string;
  experiencia_id: string | null;
  nome: string;
  descricao: string | null;
  ordem: number;
  latitude: number | null;
  longitude: number | null;
  experiencia?: Experiencia;
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
  categoria_gastronomia_id: string | null;
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
  categoria?: CategoriaGastronomia;
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

