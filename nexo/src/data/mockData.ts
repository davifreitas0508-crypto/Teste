import type {
  Agendamento,
  Avaliacao,
  Categoria,
  Cliente,
  ConfiguracaoAgenda,
  Profissional,
  Promocao,
  Servico,
} from '../types';

export const categorias: Categoria[] = [
  { id: 'unhas', nome: 'Unhas', icone: 'Hand' },
  { id: 'cabelo', nome: 'Cabelo', icone: 'Scissors' },
  { id: 'maquiagem', nome: 'Maquiagem', icone: 'Palette' },
  { id: 'sobrancelhas', nome: 'Sobrancelhas', icone: 'Eye' },
  { id: 'cilios', nome: 'Cílios', icone: 'Sparkle' },
  { id: 'estetica', nome: 'Estética', icone: 'Flower2' },
  { id: 'outros', nome: 'Outros', icone: 'Gem' },
];

function agendaPadrao(): ConfiguracaoAgenda {
  const faixa = { inicio: '09:00', fim: '19:00' };
  return {
    disponibilidade: {
      0: null,
      1: faixa,
      2: faixa,
      3: faixa,
      4: faixa,
      5: faixa,
      6: { inicio: '09:00', fim: '16:00' },
    },
    intervaloAlmoco: { inicio: '12:00', fim: '13:00' },
    intervaloEntreAtendimentosMin: 10,
    diasFolga: [],
    feriados: ['2026-09-07', '2026-10-12'],
    bloqueiosManuais: [],
  };
}

export const profissionais: Profissional[] = [
  {
    id: 'prof-1',
    nome: 'Ateliê Bella Unha',
    tipo: 'salao',
    fotoPerfil:
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=300&h=300&fit=crop',
    fotoCapa:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&h=500&fit=crop',
    descricao:
      'Especializado em unhas em gel, esmaltação em gel e nail art. Ambiente aconchegante e materiais premium.',
    endereco: 'Rua das Flores, 245',
    bairro: 'Jardim Paulista',
    cidade: 'São Paulo',
    distanciaKm: 1.2,
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 312,
    categorias: ['unhas'],
    portfolio: [
      'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1632344004429-8d8d5d558dcb?w=400&h=400&fit=crop',
    ],
    configuracaoAgenda: agendaPadrao(),
    emDestaque: true,
  },
  {
    id: 'prof-2',
    nome: 'Camila Rocha • Hair Studio',
    tipo: 'individual',
    fotoPerfil:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    fotoCapa:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=900&h=500&fit=crop',
    descricao:
      'Cabeleireira há 12 anos, especialista em coloração, mechas e cortes modernos. Produtos veganos.',
    endereco: 'Av. Ibirapuera, 980',
    bairro: 'Moema',
    cidade: 'São Paulo',
    distanciaKm: 3.4,
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 187,
    categorias: ['cabelo'],
    portfolio: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop',
    ],
    configuracaoAgenda: agendaPadrao(),
    emDestaque: true,
  },
  {
    id: 'prof-3',
    nome: 'Studio Glam Makeup',
    tipo: 'individual',
    fotoPerfil:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop',
    fotoCapa:
      'https://images.unsplash.com/photo-1487412912498-0447579c8d40?w=900&h=500&fit=crop',
    descricao:
      'Maquiagem social, noiva e para eventos. Atendimento em domicílio disponível sob consulta.',
    endereco: 'Rua Oscar Freire, 1120',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    distanciaKm: 2.1,
    avaliacaoMedia: 5.0,
    totalAvaliacoes: 94,
    categorias: ['maquiagem'],
    portfolio: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
    ],
    configuracaoAgenda: agendaPadrao(),
    emDestaque: true,
  },
  {
    id: 'prof-4',
    nome: 'Sobrancelha Perfeita',
    tipo: 'salao',
    fotoPerfil:
      'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=300&h=300&fit=crop',
    fotoCapa:
      'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=900&h=500&fit=crop',
    descricao:
      'Design de sobrancelhas com henna, micropigmentação e laminação. Técnica fio a fio.',
    endereco: 'Rua Augusta, 3200',
    bairro: 'Cerqueira César',
    cidade: 'São Paulo',
    distanciaKm: 4.6,
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 158,
    categorias: ['sobrancelhas', 'cilios'],
    portfolio: [
      'https://images.unsplash.com/photo-1583001809873-a128495da465?w=400&h=400&fit=crop',
    ],
    configuracaoAgenda: agendaPadrao(),
  },
  {
    id: 'prof-5',
    nome: 'Espaço Renove Estética',
    tipo: 'salao',
    fotoPerfil:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=300&fit=crop',
    fotoCapa:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&h=500&fit=crop',
    descricao:
      'Limpeza de pele, massagens relaxantes e tratamentos faciais com tecnologia de ponta.',
    endereco: 'Alameda Santos, 780',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    distanciaKm: 2.9,
    avaliacaoMedia: 4.6,
    totalAvaliacoes: 76,
    categorias: ['estetica'],
    portfolio: [
      'https://images.unsplash.com/photo-1596178060810-72660fb35d40?w=400&h=400&fit=crop',
    ],
    configuracaoAgenda: agendaPadrao(),
  },
];

export const servicos: Servico[] = [
  // prof-1 - Unhas
  {
    id: 'serv-1',
    profissionalId: 'prof-1',
    categoriaId: 'unhas',
    nome: 'Unhas em Gel',
    descricao: 'Aplicação completa de unhas em gel com esmaltação à sua escolha.',
    preco: 120,
    duracaoMin: 90,
    foto: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-2',
    profissionalId: 'prof-1',
    categoriaId: 'unhas',
    nome: 'Manicure Tradicional',
    descricao: 'Cutilagem, lixamento e esmaltação tradicional.',
    preco: 45,
    duracaoMin: 45,
    foto: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-3',
    profissionalId: 'prof-1',
    categoriaId: 'unhas',
    nome: 'Pedicure Spa',
    descricao: 'Esfoliação, hidratação e esmaltação dos pés.',
    preco: 55,
    duracaoMin: 60,
    foto: 'https://images.unsplash.com/photo-1632344004429-8d8d5d558dcb?w=400&h=300&fit=crop',
  },
  // prof-2 - Cabelo
  {
    id: 'serv-4',
    profissionalId: 'prof-2',
    categoriaId: 'cabelo',
    nome: 'Corte Feminino',
    descricao: 'Corte personalizado com acabamento em escova.',
    preco: 90,
    duracaoMin: 60,
    foto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-5',
    profissionalId: 'prof-2',
    categoriaId: 'cabelo',
    nome: 'Coloração Completa',
    descricao: 'Coloração raiz a pontas com produtos veganos.',
    preco: 220,
    duracaoMin: 150,
    foto: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-6',
    profissionalId: 'prof-2',
    categoriaId: 'cabelo',
    nome: 'Escova Modelada',
    descricao: 'Escova com finalização e brilho.',
    preco: 70,
    duracaoMin: 50,
    foto: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
  },
  // prof-3 - Maquiagem
  {
    id: 'serv-7',
    profissionalId: 'prof-3',
    categoriaId: 'maquiagem',
    nome: 'Maquiagem Social',
    descricao: 'Maquiagem para festas e eventos, com cílios inclusos.',
    preco: 150,
    duracaoMin: 60,
    foto: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-8',
    profissionalId: 'prof-3',
    categoriaId: 'maquiagem',
    nome: 'Maquiagem para Noiva',
    descricao: 'Inclui teste prévio e maquiagem no dia do casamento.',
    preco: 380,
    duracaoMin: 90,
    foto: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
  },
  // prof-4 - Sobrancelhas / Cílios
  {
    id: 'serv-9',
    profissionalId: 'prof-4',
    categoriaId: 'sobrancelhas',
    nome: 'Design com Henna',
    descricao: 'Design fio a fio com henna para preenchimento.',
    preco: 60,
    duracaoMin: 40,
    foto: 'https://images.unsplash.com/photo-1583001809873-a128495da465?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-10',
    profissionalId: 'prof-4',
    categoriaId: 'cilios',
    nome: 'Extensão de Cílios Fio a Fio',
    descricao: 'Aplicação de extensão de cílios volume russo.',
    preco: 180,
    duracaoMin: 120,
    foto: 'https://images.unsplash.com/photo-1583001809873-a128495da465?w=400&h=300&fit=crop',
  },
  // prof-5 - Estética
  {
    id: 'serv-11',
    profissionalId: 'prof-5',
    categoriaId: 'estetica',
    nome: 'Limpeza de Pele Profunda',
    descricao: 'Higienização, esfoliação e extração com máscara calmante.',
    preco: 140,
    duracaoMin: 75,
    foto: 'https://images.unsplash.com/photo-1596178060810-72660fb35d40?w=400&h=300&fit=crop',
  },
  {
    id: 'serv-12',
    profissionalId: 'prof-5',
    categoriaId: 'estetica',
    nome: 'Massagem Relaxante',
    descricao: 'Massagem corporal relaxante de 60 minutos.',
    preco: 130,
    duracaoMin: 60,
    foto: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
  },
];

export const clienteDemo: Cliente = {
  id: 'cliente-1',
  nome: 'Fernanda Souza',
  email: 'comercial.davifreitas@gmail.com',
  telefone: '(11) 98888-7766',
  foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
  favoritos: ['prof-1', 'prof-3'],
  notificacoes: {
    confirmacao: true,
    lembretes: true,
    promocoes: false,
  },
};

export const promocoes: Promocao[] = [
  {
    id: 'promo-1',
    titulo: '20% OFF em Unhas em Gel',
    descricao: 'Ateliê Bella Unha • válido até domingo',
    profissionalId: 'prof-1',
    desconto: '20%',
    corFundo: 'from-[#F7C9D4] to-[#F3AFC0]',
  },
  {
    id: 'promo-2',
    titulo: 'Combo Escova + Sobrancelha',
    descricao: 'Agende os dois serviços e ganhe 15% de desconto',
    desconto: '15%',
    corFundo: 'from-[#FBE3E9] to-[#F5C9D6]',
  },
  {
    id: 'promo-3',
    titulo: 'Primeira Maquiagem com Studio Glam',
    descricao: 'R$30 de desconto para novas clientes',
    profissionalId: 'prof-3',
    desconto: 'R$30',
    corFundo: 'from-[#F3D9E4] to-[#EBB8CE]',
  },
];

function dataFutura(diasAFrente: number): string {
  const d = new Date();
  d.setDate(d.getDate() + diasAFrente);
  return d.toISOString().slice(0, 10);
}

function dataPassada(diasAtras: number): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return d.toISOString().slice(0, 10);
}

export const agendamentosDemo: Agendamento[] = [
  {
    id: 'ag-1',
    clienteId: 'cliente-1',
    profissionalId: 'prof-1',
    servicoId: 'serv-1',
    data: dataFutura(2),
    horaInicio: '14:00',
    horaFim: '15:30',
    status: 'confirmado',
    valorServico: 120,
    taxaServico: 3.5,
    valorTotal: 123.5,
    formaPagamento: 'pix',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'ag-2',
    clienteId: 'cliente-1',
    profissionalId: 'prof-3',
    servicoId: 'serv-7',
    data: dataFutura(9),
    horaInicio: '10:00',
    horaFim: '11:00',
    status: 'confirmado',
    valorServico: 150,
    taxaServico: 4.5,
    valorTotal: 154.5,
    formaPagamento: 'credito',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'ag-3',
    clienteId: 'cliente-1',
    profissionalId: 'prof-2',
    servicoId: 'serv-4',
    data: dataPassada(12),
    horaInicio: '11:00',
    horaFim: '12:00',
    status: 'concluido',
    valorServico: 90,
    taxaServico: 2.5,
    valorTotal: 92.5,
    formaPagamento: 'debito',
    criadoEm: new Date().toISOString(),
    avaliado: true,
  },
  {
    id: 'ag-4',
    clienteId: 'cliente-1',
    profissionalId: 'prof-4',
    servicoId: 'serv-9',
    data: dataPassada(25),
    horaInicio: '09:30',
    horaFim: '10:10',
    status: 'concluido',
    valorServico: 60,
    taxaServico: 2,
    valorTotal: 62,
    formaPagamento: 'pix',
    criadoEm: new Date().toISOString(),
    avaliado: false,
  },
  {
    id: 'ag-5',
    clienteId: 'outra-cliente',
    profissionalId: 'prof-1',
    servicoId: 'serv-2',
    data: dataFutura(2),
    horaInicio: '10:00',
    horaFim: '10:45',
    status: 'confirmado',
    valorServico: 45,
    taxaServico: 1.5,
    valorTotal: 46.5,
    formaPagamento: 'pix',
    criadoEm: new Date().toISOString(),
  },
];

export const avaliacoesDemo: Avaliacao[] = [
  {
    id: 'aval-1',
    agendamentoId: 'ag-old-1',
    clienteId: 'cliente-2',
    profissionalId: 'prof-1',
    servicoId: 'serv-1',
    nota: 5,
    comentario: 'Amei o resultado, unhas ficaram lindas e duraram muito!',
    criadoEm: dataPassada(5),
  },
  {
    id: 'aval-2',
    agendamentoId: 'ag-old-2',
    clienteId: 'cliente-3',
    profissionalId: 'prof-1',
    servicoId: 'serv-2',
    nota: 5,
    comentario: 'Atendimento impecável, ambiente super aconchegante.',
    criadoEm: dataPassada(10),
  },
  {
    id: 'aval-3',
    agendamentoId: 'ag-3',
    clienteId: 'cliente-1',
    profissionalId: 'prof-2',
    servicoId: 'serv-4',
    nota: 4,
    comentario: 'Corte ótimo, só demorou um pouco além do esperado.',
    criadoEm: dataPassada(11),
  },
  {
    id: 'aval-4',
    agendamentoId: 'ag-old-4',
    clienteId: 'cliente-4',
    profissionalId: 'prof-3',
    servicoId: 'serv-7',
    nota: 5,
    comentario: 'Maquiagem perfeita, durou a noite toda!',
    criadoEm: dataPassada(3),
  },
];

export function getProfissional(id: string) {
  return profissionais.find((p) => p.id === id);
}

export function getServico(id: string) {
  return servicos.find((s) => s.id === id);
}

export function getServicosDoProfissional(profissionalId: string) {
  return servicos.filter((s) => s.profissionalId === profissionalId);
}

export function getCategoria(id: string) {
  return categorias.find((c) => c.id === id);
}

export function getAvaliacoesDoProfissional(profissionalId: string) {
  return avaliacoesDemo.filter((a) => a.profissionalId === profissionalId);
}
