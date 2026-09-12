import { Link } from 'react-router-dom';
import { Wallet, Clock, AlertTriangle, TrendingUp, PlusCircle, QrCode, CreditCard, Receipt } from 'lucide-react';
import { useStore } from '../store';
import StatusBadge from '../components/StatusBadge';

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const metodoLabel: Record<string, string> = { pix: 'Pix', cartao: 'Cartão', boleto: 'Boleto' };
const metodoIcon: Record<string, typeof QrCode> = { pix: QrCode, cartao: CreditCard, boleto: Receipt };

export default function Dashboard() {
  const { cobrancas, clientes, empresa } = useStore();

  const recebidoMes = cobrancas.filter((c) => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0);
  const pendente = cobrancas.filter((c) => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const vencido = cobrancas.filter((c) => c.status === 'vencido').reduce((sum, c) => sum + c.valor, 0);
  const totalGeral = recebidoMes + pendente + vencido;

  const recentes = [...cobrancas]
    .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1))
    .slice(0, 5);

  const clienteNome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? 'Cliente removido';

  const cards = [
    { label: 'Total em cobranças', value: totalGeral, icon: TrendingUp, tone: 'bg-emerald-600' },
    { label: 'Recebido', value: recebidoMes, icon: Wallet, tone: 'bg-emerald-500' },
    { label: 'Pendente', value: pendente, icon: Clock, tone: 'bg-amber-500' },
    { label: 'Vencido', value: vencido, icon: AlertTriangle, tone: 'bg-red-500' },
  ];

  return (
    <div className="fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">
            Olá, {empresa?.nome ?? 'empresa'} 👋
          </h1>
          <p className="text-sm text-emerald-950/60">
            Aqui está um resumo das suas cobranças.
          </p>
        </div>
        <Link
          to="/nova-cobranca"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <PlusCircle size={18} />
          Nova cobrança
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-xl ${tone} p-2.5 text-white`}>
              <Icon size={18} />
            </div>
            <p className="text-xs font-medium text-emerald-950/50">{label}</p>
            <p className="mt-1 text-xl font-bold text-emerald-950">{formatBRL(value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-emerald-950">Cobranças recentes</h2>
          <Link to="/cobrancas" className="text-sm font-medium text-emerald-600 hover:underline">
            Ver todas
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-100 text-emerald-950/50">
                <th className="pb-2 font-medium">Cliente</th>
                <th className="pb-2 font-medium">Descrição</th>
                <th className="pb-2 font-medium">Método</th>
                <th className="pb-2 font-medium">Vencimento</th>
                <th className="pb-2 font-medium">Valor</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((c) => {
                const Icon = metodoIcon[c.metodo];
                return (
                  <tr key={c.id} className="border-b border-emerald-50 last:border-0">
                    <td className="py-3 font-medium text-emerald-950">{clienteNome(c.clienteId)}</td>
                    <td className="py-3 text-emerald-950/70">{c.descricao}</td>
                    <td className="py-3 text-emerald-950/70">
                      <span className="flex items-center gap-1.5">
                        <Icon size={14} /> {metodoLabel[c.metodo]}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-950/70">
                      {new Date(c.vencimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 font-semibold text-emerald-950">{formatBRL(c.valor)}</td>
                    <td className="py-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
