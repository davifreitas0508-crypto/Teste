import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Cliente, Cobranca, StatusCobranca } from './types';
import { clientesIniciais, cobrancasIniciais } from './data/mock';

const STORAGE_KEY = 'cobrae:v1';

interface Empresa {
  nome: string;
  email: string;
}

interface StoreState {
  empresa: Empresa | null;
  clientes: Cliente[];
  cobrancas: Cobranca[];
}

interface StoreValue extends StoreState {
  login: (empresa: Empresa) => void;
  logout: () => void;
  addCliente: (cliente: Omit<Cliente, 'id' | 'criadoEm'>) => Cliente;
  addCobranca: (cobranca: Omit<Cobranca, 'id' | 'criadoEm' | 'status' | 'ultimoEnvio'>) => Cobranca;
  setStatus: (id: string, status: StatusCobranca) => void;
  reenviar: (id: string) => void;
}

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoreState;
  } catch {
    // ignora storage corrompido e recomeça do mock
  }
  return { empresa: null, clientes: clientesIniciais, cobrancas: cobrancasIniciais };
}

function generatePixCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 24; i++) random += chars[Math.floor(Math.random() * chars.length)];
  return `00020126580014BR.GOV.BCB.PIX0136cobrae-${random}5204000053039865802BR5913COBRAE LTDA6009SAO PAULO62070503***6304`;
}

const StoreContext = createContext<StoreValue | null>(null);

export function CobraeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = (empresa: Empresa) => setState((s) => ({ ...s, empresa }));
  const logout = () => setState((s) => ({ ...s, empresa: null }));

  const addCliente: StoreValue['addCliente'] = (cliente) => {
    const novo: Cliente = {
      ...cliente,
      id: `c${Date.now()}`,
      criadoEm: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({ ...s, clientes: [novo, ...s.clientes] }));
    return novo;
  };

  const addCobranca: StoreValue['addCobranca'] = (cobranca) => {
    const nova: Cobranca = {
      ...cobranca,
      id: `b${Date.now()}`,
      criadoEm: new Date().toISOString().slice(0, 10),
      status: 'pendente',
      ultimoEnvio: new Date().toISOString().slice(0, 10),
      pixCopiaCola: cobranca.metodo === 'pix' ? generatePixCode() : undefined,
    };
    setState((s) => ({ ...s, cobrancas: [nova, ...s.cobrancas] }));
    return nova;
  };

  const setStatus = (id: string, status: StatusCobranca) => {
    setState((s) => ({
      ...s,
      cobrancas: s.cobrancas.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  };

  const reenviar = (id: string) => {
    setState((s) => ({
      ...s,
      cobrancas: s.cobrancas.map((c) =>
        c.id === id ? { ...c, ultimoEnvio: new Date().toISOString().slice(0, 10) } : c
      ),
    }));
  };

  return (
    <StoreContext.Provider
      value={{ ...state, login, logout, addCliente, addCobranca, setStatus, reenviar }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore deve ser usado dentro de CobraeProvider');
  return ctx;
}
