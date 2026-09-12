import { useMemo, useState } from 'react';
import { QrCode, CreditCard, Receipt, Mail, MessageCircle, RefreshCw, X, Copy, Check } from 'lucide-react';
import { useStore } from '../store';
import StatusBadge from '../components/StatusBadge';
import PixQrCode from '../components/PixQrCode';
import type { Cobranca, StatusCobranca } from '../types';

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const metodoLabel: Record<string, string> = { pix: 'Pix', cartao: 'Cartão', boleto: 'Boleto' };
const metodoIcon: Record<string, typeof QrCode> = { pix: QrCode, cartao: CreditCard, boleto: Receipt };

const filtros: { label: string; value: StatusCobranca | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Pago', value: 'pago' },
  { label: 'Vencido', value: 'vencido' },
  { label: 'Cancelado', value: 'cancelado' },
];

export default function Cobrancas() {
  const { cobrancas, clientes, setStatus, reenviar } = useStore();
  const [filtro, setFiltro] = useState<StatusCobranca | 'todas'>('todas');
  const [selecionada, setSelecionada] = useState<Cobranca | null>(null);
  const [copiado, setCopiado] = useState(false);

  const clienteNome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? 'Cliente removido';

  const lista = useMemo(
    () =>
      [...cobrancas]
        .filter((c) => filtro === 'todas' || c.status === filtro)
        .sort((a, b) => (a.vencimento < b.vencimento ? 1 : -1)),
    [cobrancas, filtro]
  );

  const handleCopiar = () => {
    if (!selecionada?.pixCopiaCola) return;
    navigator.clipboard?.writeText(selecionada.pixCopiaCola).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-950">Cobranças</h1>
        <p className="text-sm text-emerald-950/60">Acompanhe o status de todas as cobranças geradas.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.value
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-950/60 border border-emerald-100 hover:bg-emerald-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-50/60">
              <tr className="text-emerald-950/50">
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Método</th>
                <th className="px-4 py-3 font-medium">Envio</th>
                <th className="px-4 py-3 font-medium">Vencimento</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => {
                const Icon = metodoIcon[c.metodo];
                return (
                  <tr
                    key={c.id}
                    className="cursor-pointer border-t border-emerald-50 hover:bg-emerald-50/40"
                    onClick={() => setSelecionada(c)}
                  >
                    <td className="px-4 py-3 font-medium text-emerald-950">{clienteNome(c.clienteId)}</td>
                    <td className="px-4 py-3 text-emerald-950/70">{c.descricao}</td>
                    <td className="px-4 py-3 text-emerald-950/70">
                      <span className="flex items-center gap-1.5">
                        <Icon size={14} /> {metodoLabel[c.metodo]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-emerald-950/50">
                      <span className="flex items-center gap-2">
                        {c.canais.includes('email') && <Mail size={14} />}
                        {c.canais.includes('whatsapp') && <MessageCircle size={14} />}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-emerald-950/70">
                      {new Date(c.vencimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-950">{formatBRL(c.valor)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          reenviar(c.id);
                        }}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-100"
                        title="Reenviar cobrança"
                      >
                        <RefreshCw size={13} /> Reenviar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-emerald-950/50">
                    Nenhuma cobrança nessa categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="pop-in w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-emerald-950">Detalhes da cobrança</h2>
              <button onClick={() => setSelecionada(null)} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 space-y-1 text-sm">
              <p className="text-emerald-950/50">Cliente</p>
              <p className="font-semibold text-emerald-950">{clienteNome(selecionada.clienteId)}</p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-emerald-950/50">Valor</p>
                <p className="font-semibold text-emerald-950">{formatBRL(selecionada.valor)}</p>
              </div>
              <div>
                <p className="text-emerald-950/50">Vencimento</p>
                <p className="font-semibold text-emerald-950">
                  {new Date(selecionada.vencimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-emerald-950/50">Status</p>
                <StatusBadge status={selecionada.status} />
              </div>
              <div>
                <p className="text-emerald-950/50">Método</p>
                <p className="font-semibold text-emerald-950">{metodoLabel[selecionada.metodo]}</p>
              </div>
            </div>

            {selecionada.metodo === 'pix' && selecionada.pixCopiaCola && (
              <div className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-emerald-50 p-4">
                <PixQrCode code={selecionada.pixCopiaCola} />
                <button
                  onClick={handleCopiar}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
                >
                  {copiado ? <Check size={14} /> : <Copy size={14} />}
                  {copiado ? 'Código copiado!' : 'Copiar código Pix'}
                </button>
              </div>
            )}

            {selecionada.metodo === 'cartao' && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
                <CreditCard size={20} />
                Link de pagamento por cartão enviado ao cliente (checkout simulado).
              </div>
            )}

            <div className="flex gap-2">
              {selecionada.status !== 'pago' && (
                <button
                  onClick={() => {
                    setStatus(selecionada.id, 'pago');
                    setSelecionada({ ...selecionada, status: 'pago' });
                  }}
                  className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Marcar como pago
                </button>
              )}
              <button
                onClick={() => {
                  reenviar(selecionada.id);
                }}
                className="flex-1 rounded-xl border border-emerald-200 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Reenviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
