import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Agendamento,
  Avaliacao,
  Cliente,
  ConfiguracaoAgenda,
  FormaPagamento,
  Servico,
} from '../types';
import {
  agendamentosDemo,
  avaliacoesDemo,
  clienteDemo,
  profissionais,
  servicos as servicosSeed,
} from '../data/mockData';

type Sessao = { tipo: 'cliente' } | { tipo: 'profissional'; profissionalId: string } | null;

interface ToastItem {
  id: number;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'info';
}

interface AppContextValue {
  sessao: Sessao;
  entrarComoCliente: () => void;
  entrarComoProfissional: (profissionalId: string) => void;
  sair: () => void;

  cliente: Cliente;
  atualizarCliente: (dados: Partial<Cliente>) => void;
  alternarFavorito: (profissionalId: string) => void;

  agendamentos: Agendamento[];
  criarAgendamento: (dados: {
    profissionalId: string;
    servicoId: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    valorServico: number;
    formaPagamento: FormaPagamento;
  }) => Agendamento;
  cancelarAgendamento: (id: string) => void;
  remarcarAgendamento: (id: string, novaData: string, novoHorario: string, novoFim: string) => void;

  avaliacoes: Avaliacao[];
  adicionarAvaliacao: (dados: {
    agendamentoId: string;
    profissionalId: string;
    servicoId: string;
    nota: number;
    comentario: string;
  }) => void;

  servicosPro: Servico[];
  criarServico: (dados: Omit<Servico, 'id'>) => void;
  atualizarServico: (id: string, dados: Partial<Servico>) => void;
  removerServico: (id: string) => void;

  configuracoesAgenda: Record<string, ConfiguracaoAgenda>;
  getConfiguracaoAgenda: (profissionalId: string) => ConfiguracaoAgenda;
  atualizarConfiguracaoAgenda: (profissionalId: string, parcial: Partial<ConfiguracaoAgenda>) => void;

  toasts: ToastItem[];
  notificar: (mensagem: string, tipo?: ToastItem['tipo']) => void;
  removerToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function carregar<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function salvar<T>(chave: string, valor: T) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

const TAXA_PERCENTUAL = 0.03;

export function AppProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao>(() => carregar('belle_sessao', null));
  const [cliente, setCliente] = useState<Cliente>(() => carregar('belle_cliente', clienteDemo));
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() =>
    carregar('belle_agendamentos', agendamentosDemo),
  );
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(() =>
    carregar('belle_avaliacoes', avaliacoesDemo),
  );
  const [servicosPro, setServicosPro] = useState<Servico[]>(() =>
    carregar('belle_servicos', servicosSeed),
  );
  const [configuracoesAgenda, setConfiguracoesAgenda] = useState<Record<string, ConfiguracaoAgenda>>(
    () =>
      carregar(
        'belle_config_agenda',
        Object.fromEntries(profissionais.map((p) => [p.id, p.configuracaoAgenda])),
      ),
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notificar = useCallback((mensagem: string, tipo: ToastItem['tipo'] = 'sucesso') => {
    const id = Date.now() + Math.random();
    setToasts((atual) => [...atual, { id, mensagem, tipo }]);
    setTimeout(() => {
      setToasts((atual) => atual.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removerToast = useCallback((id: number) => {
    setToasts((atual) => atual.filter((t) => t.id !== id));
  }, []);

  const entrarComoCliente = useCallback(() => {
    const nova: Sessao = { tipo: 'cliente' };
    setSessao(nova);
    salvar('belle_sessao', nova);
  }, []);

  const entrarComoProfissional = useCallback((profissionalId: string) => {
    const nova: Sessao = { tipo: 'profissional', profissionalId };
    setSessao(nova);
    salvar('belle_sessao', nova);
  }, []);

  const sair = useCallback(() => {
    setSessao(null);
    salvar('belle_sessao', null);
  }, []);

  const atualizarCliente = useCallback((dados: Partial<Cliente>) => {
    setCliente((atual) => {
      const novo = { ...atual, ...dados };
      salvar('belle_cliente', novo);
      return novo;
    });
  }, []);

  const alternarFavorito = useCallback((profissionalId: string) => {
    setCliente((atual) => {
      const jaFavorito = atual.favoritos.includes(profissionalId);
      const favoritos = jaFavorito
        ? atual.favoritos.filter((id) => id !== profissionalId)
        : [...atual.favoritos, profissionalId];
      const novo = { ...atual, favoritos };
      salvar('belle_cliente', novo);
      return novo;
    });
  }, []);

  const criarAgendamento = useCallback<AppContextValue['criarAgendamento']>((dados) => {
    const taxaServico = Math.round(dados.valorServico * TAXA_PERCENTUAL * 100) / 100;
    const novo: Agendamento = {
      id: `ag-${Date.now()}`,
      clienteId: 'cliente-1',
      profissionalId: dados.profissionalId,
      servicoId: dados.servicoId,
      data: dados.data,
      horaInicio: dados.horaInicio,
      horaFim: dados.horaFim,
      status: 'confirmado',
      valorServico: dados.valorServico,
      taxaServico,
      valorTotal: Math.round((dados.valorServico + taxaServico) * 100) / 100,
      formaPagamento: dados.formaPagamento,
      criadoEm: new Date().toISOString(),
    };
    setAgendamentos((atual) => {
      const novaLista = [...atual, novo];
      salvar('belle_agendamentos', novaLista);
      return novaLista;
    });
    return novo;
  }, []);

  const cancelarAgendamento = useCallback((id: string) => {
    setAgendamentos((atual) => {
      const novaLista = atual.map((a) => (a.id === id ? { ...a, status: 'cancelado' as const } : a));
      salvar('belle_agendamentos', novaLista);
      return novaLista;
    });
  }, []);

  const remarcarAgendamento = useCallback(
    (id: string, novaData: string, novoHorario: string, novoFim: string) => {
      setAgendamentos((atual) => {
        const novaLista = atual.map((a) =>
          a.id === id ? { ...a, data: novaData, horaInicio: novoHorario, horaFim: novoFim } : a,
        );
        salvar('belle_agendamentos', novaLista);
        return novaLista;
      });
    },
    [],
  );

  const adicionarAvaliacao = useCallback<AppContextValue['adicionarAvaliacao']>((dados) => {
    const nova: Avaliacao = {
      id: `aval-${Date.now()}`,
      agendamentoId: dados.agendamentoId,
      clienteId: 'cliente-1',
      profissionalId: dados.profissionalId,
      servicoId: dados.servicoId,
      nota: dados.nota,
      comentario: dados.comentario,
      criadoEm: new Date().toISOString(),
    };
    setAvaliacoes((atual) => {
      const novaLista = [...atual, nova];
      salvar('belle_avaliacoes', novaLista);
      return novaLista;
    });
    setAgendamentos((atual) => {
      const novaLista = atual.map((a) =>
        a.id === dados.agendamentoId ? { ...a, avaliado: true } : a,
      );
      salvar('belle_agendamentos', novaLista);
      return novaLista;
    });
  }, []);

  const criarServico = useCallback((dados: Omit<Servico, 'id'>) => {
    setServicosPro((atual) => {
      const novo: Servico = { ...dados, id: `serv-${Date.now()}` };
      const novaLista = [...atual, novo];
      salvar('belle_servicos', novaLista);
      return novaLista;
    });
  }, []);

  const atualizarServico = useCallback((id: string, dados: Partial<Servico>) => {
    setServicosPro((atual) => {
      const novaLista = atual.map((s) => (s.id === id ? { ...s, ...dados } : s));
      salvar('belle_servicos', novaLista);
      return novaLista;
    });
  }, []);

  const removerServico = useCallback((id: string) => {
    setServicosPro((atual) => {
      const novaLista = atual.filter((s) => s.id !== id);
      salvar('belle_servicos', novaLista);
      return novaLista;
    });
  }, []);

  const getConfiguracaoAgenda = useCallback(
    (profissionalId: string): ConfiguracaoAgenda => {
      return (
        configuracoesAgenda[profissionalId] ??
        profissionais.find((p) => p.id === profissionalId)?.configuracaoAgenda ?? {
          disponibilidade: {},
          intervaloAlmoco: null,
          intervaloEntreAtendimentosMin: 10,
          diasFolga: [],
          feriados: [],
          bloqueiosManuais: [],
        }
      );
    },
    [configuracoesAgenda],
  );

  const atualizarConfiguracaoAgenda = useCallback(
    (profissionalId: string, parcial: Partial<ConfiguracaoAgenda>) => {
      setConfiguracoesAgenda((atual) => {
        const base =
          atual[profissionalId] ?? profissionais.find((p) => p.id === profissionalId)?.configuracaoAgenda;
        if (!base) return atual;
        const novaLista = { ...atual, [profissionalId]: { ...base, ...parcial } };
        salvar('belle_config_agenda', novaLista);
        return novaLista;
      });
    },
    [],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      sessao,
      entrarComoCliente,
      entrarComoProfissional,
      sair,
      cliente,
      atualizarCliente,
      alternarFavorito,
      agendamentos,
      criarAgendamento,
      cancelarAgendamento,
      remarcarAgendamento,
      avaliacoes,
      adicionarAvaliacao,
      servicosPro,
      criarServico,
      atualizarServico,
      removerServico,
      configuracoesAgenda,
      getConfiguracaoAgenda,
      atualizarConfiguracaoAgenda,
      toasts,
      notificar,
      removerToast,
    }),
    [
      sessao,
      entrarComoCliente,
      entrarComoProfissional,
      sair,
      cliente,
      atualizarCliente,
      alternarFavorito,
      agendamentos,
      criarAgendamento,
      cancelarAgendamento,
      remarcarAgendamento,
      avaliacoes,
      adicionarAvaliacao,
      servicosPro,
      criarServico,
      atualizarServico,
      removerServico,
      configuracoesAgenda,
      getConfiguracaoAgenda,
      atualizarConfiguracaoAgenda,
      toasts,
      notificar,
      removerToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
