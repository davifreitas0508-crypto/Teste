export type MetodoPagamento = 'pix' | 'cartao' | 'boleto';

export type StatusCobranca = 'pendente' | 'pago' | 'vencido' | 'cancelado';

export type Recorrencia = 'unica' | 'mensal' | 'semanal';

export type CanalEnvio = 'email' | 'whatsapp';

export interface Cliente {
  id: string;
  nome: string;
  documento: string;
  email: string;
  whatsapp: string;
  criadoEm: string;
}

export interface Cobranca {
  id: string;
  clienteId: string;
  descricao: string;
  valor: number;
  vencimento: string;
  metodo: MetodoPagamento;
  status: StatusCobranca;
  recorrencia: Recorrencia;
  canais: CanalEnvio[];
  criadoEm: string;
  pixCopiaCola?: string;
  ultimoEnvio?: string;
}
