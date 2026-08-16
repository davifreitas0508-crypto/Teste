// Entidades principais do app de agendamento de beleza

export type CategoriaId =
  | 'unhas'
  | 'cabelo'
  | 'maquiagem'
  | 'sobrancelhas'
  | 'cilios'
  | 'estetica'
  | 'outros';

export interface Categoria {
  id: CategoriaId;
  nome: string;
  icone: string; // nome do ícone lucide
}

export interface Servico {
  id: string;
  profissionalId: string;
  categoriaId: CategoriaId;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMin: number;
  foto: string;
}

export interface FaixaHorario {
  inicio: string; // "09:00"
  fim: string; // "18:00"
}

export interface DisponibilidadeSemana {
  // 0 = domingo ... 6 = sábado
  [diaSemana: number]: FaixaHorario | null;
}

export interface ConfiguracaoAgenda {
  disponibilidade: DisponibilidadeSemana;
  intervaloAlmoco: FaixaHorario | null;
  intervaloEntreAtendimentosMin: number;
  diasFolga: string[]; // datas ISO "2026-08-20"
  feriados: string[];
  bloqueiosManuais: { data: string; inicio: string; fim: string; motivo?: string }[];
}

export interface Profissional {
  id: string;
  nome: string;
  tipo: 'individual' | 'salao';
  fotoPerfil: string;
  fotoCapa: string;
  descricao: string;
  endereco: string;
  bairro: string;
  cidade: string;
  distanciaKm: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  categorias: CategoriaId[];
  portfolio: string[];
  configuracaoAgenda: ConfiguracaoAgenda;
  emDestaque?: boolean;
}

export type StatusAgendamento =
  | 'confirmado'
  | 'concluido'
  | 'cancelado';

export type FormaPagamento = 'credito' | 'debito' | 'pix';

export interface Agendamento {
  id: string;
  clienteId: string;
  profissionalId: string;
  servicoId: string;
  data: string; // ISO "2026-08-20"
  horaInicio: string; // "14:00"
  horaFim: string;
  status: StatusAgendamento;
  valorServico: number;
  taxaServico: number;
  valorTotal: number;
  formaPagamento: FormaPagamento;
  criadoEm: string;
  avaliado?: boolean;
}

export interface Avaliacao {
  id: string;
  agendamentoId: string;
  clienteId: string;
  profissionalId: string;
  servicoId: string;
  nota: number; // 1-5
  comentario: string;
  criadoEm: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto: string;
  favoritos: string[]; // ids de profissionais
  notificacoes: {
    confirmacao: boolean;
    lembretes: boolean;
    promocoes: boolean;
  };
}

export interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  profissionalId?: string;
  desconto: string;
  corFundo: string;
}

export type FormaPagamentoLabel = Record<FormaPagamento, string>;
