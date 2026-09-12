import { useState } from 'react';
import { Plus, Mail, MessageCircle, X, Search } from 'lucide-react';
import { useStore } from '../store';

export default function Clientes() {
  const { clientes, cobrancas, addCliente } = useStore();
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: '', documento: '', email: '', whatsapp: '' });

  const filtrados = clientes.filter((c) =>
    `${c.nome} ${c.documento} ${c.email}`.toLowerCase().includes(busca.toLowerCase())
  );

  const cobrancasDoCliente = (id: string) => cobrancas.filter((c) => c.clienteId === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email) return;
    addCliente(form);
    setForm({ nome: '', documento: '', email: '', whatsapp: '' });
    setModalAberto(false);
  };

  return (
    <div className="fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Clientes</h1>
          <p className="text-sm text-emerald-950/60">
            Cadastre os clientes que receberão cobranças automáticas.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={18} />
          Novo cliente
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 sm:w-80">
        <Search size={16} className="text-emerald-950/40" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou documento"
          className="w-full text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((cliente) => {
          const ativos = cobrancasDoCliente(cliente.id).filter((c) => c.status !== 'pago' && c.status !== 'cancelado');
          return (
            <div key={cliente.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                  {cliente.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-emerald-950">{cliente.nome}</p>
                  <p className="text-xs text-emerald-950/50">{cliente.documento}</p>
                </div>
              </div>

              <div className="mb-3 space-y-1.5 text-sm text-emerald-950/70">
                <p className="flex items-center gap-2">
                  <Mail size={14} /> {cliente.email}
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle size={14} /> {cliente.whatsapp}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-emerald-50 pt-3 text-xs">
                <span className="text-emerald-950/50">
                  Cliente desde {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
                </span>
                <span
                  className={`rounded-full px-2 py-1 font-semibold ${
                    ativos.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {ativos.length > 0 ? `${ativos.length} cobrança(s) em aberto` : 'Em dia'}
                </span>
              </div>
            </div>
          );
        })}
        {filtrados.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-emerald-950/50">
            Nenhum cliente encontrado.
          </p>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleSubmit}
            className="pop-in w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-emerald-950">Novo cliente</h2>
              <button type="button" onClick={() => setModalAberto(false)} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-950/80">Nome completo</label>
                <input
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-950/80">CPF/CNPJ</label>
                <input
                  value={form.documento}
                  onChange={(e) => setForm({ ...form, documento: e.target.value })}
                  className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-950/80">E-mail</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-950/80">WhatsApp</label>
                <input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="(11) 90000-0000"
                  className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Salvar cliente
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
