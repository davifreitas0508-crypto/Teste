import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CreditCard, Receipt, Mail, MessageCircle, Check } from 'lucide-react';
import { useStore } from '../store';
import type { CanalEnvio, MetodoPagamento, Recorrencia } from '../types';
import PixQrCode from '../components/PixQrCode';

const metodos: { value: MetodoPagamento; label: string; icon: typeof QrCode }[] = [
  { value: 'pix', label: 'Pix', icon: QrCode },
  { value: 'cartao', label: 'Cartão', icon: CreditCard },
  { value: 'boleto', label: 'Boleto', icon: Receipt },
];

export default function NovaCobranca() {
  const { clientes, addCobranca } = useStore();
  const navigate = useNavigate();

  const [clienteId, setClienteId] = useState(clientes[0]?.id ?? '');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [metodo, setMetodo] = useState<MetodoPagamento>('pix');
  const [recorrencia, setRecorrencia] = useState<Recorrencia>('unica');
  const [canais, setCanais] = useState<CanalEnvio[]>(['email', 'whatsapp']);
  const [gerada, setGerada] = useState<{ pixCopiaCola?: string } | null>(null);

  const toggleCanal = (canal: CanalEnvio) => {
    setCanais((prev) => (prev.includes(canal) ? prev.filter((c) => c !== canal) : [...prev, canal]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !descricao || !valor || !vencimento) return;

    const nova = addCobranca({
      clienteId,
      descricao,
      valor: Number(valor.replace(',', '.')),
      vencimento,
      metodo,
      recorrencia,
      canais,
    });

    setGerada({ pixCopiaCola: nova.pixCopiaCola });
  };

  if (gerada) {
    return (
      <div className="mx-auto max-w-md fade-in">
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check size={28} />
          </div>
          <h1 className="mb-1 text-xl font-bold text-emerald-950">Cobrança gerada!</h1>
          <p className="mb-5 text-sm text-emerald-950/60">
            Enviamos a cobrança automaticamente pelos canais selecionados.
          </p>

          {metodo === 'pix' && gerada.pixCopiaCola && (
            <div className="mb-5 flex flex-col items-center gap-3 rounded-xl bg-emerald-50 p-4">
              <PixQrCode code={gerada.pixCopiaCola} />
              <p className="break-all px-2 text-xs text-emerald-950/50">{gerada.pixCopiaCola}</p>
            </div>
          )}

          {metodo === 'cartao' && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-left text-sm text-emerald-900">
              <CreditCard size={20} />
              Link de pagamento por cartão enviado para o cliente.
            </div>
          )}

          <div className="mb-5 flex justify-center gap-3 text-sm text-emerald-950/60">
            {canais.includes('email') && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
                <Mail size={14} /> E-mail enviado
              </span>
            )}
            {canais.includes('whatsapp') && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
                <MessageCircle size={14} /> WhatsApp enviado
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setGerada(null);
                setDescricao('');
                setValor('');
                setVencimento('');
              }}
              className="flex-1 rounded-xl border border-emerald-200 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Nova cobrança
            </button>
            <button
              onClick={() => navigate('/cobrancas')}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Ver cobranças
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-950">Nova cobrança</h1>
        <p className="text-sm text-emerald-950/60">
          Escolha o cliente, o valor e como a cobrança será enviada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-950/80">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-950/80">Descrição</label>
          <input
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Mensalidade do plano"
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-emerald-950/80">Valor (R$)</label>
            <input
              required
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-emerald-950/80">Vencimento</label>
            <input
              required
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-emerald-950/80">Forma de pagamento</label>
          <div className="grid grid-cols-3 gap-3">
            {metodos.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setMetodo(value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-sm font-medium transition-colors ${
                  metodo === value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-emerald-100 text-emerald-950/60 hover:bg-emerald-50/50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-emerald-950/80">Recorrência</label>
          <div className="grid grid-cols-3 gap-3">
            {(['unica', 'semanal', 'mensal'] as Recorrencia[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRecorrencia(r)}
                className={`rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors ${
                  recorrencia === r
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-emerald-100 text-emerald-950/60 hover:bg-emerald-50/50'
                }`}
              >
                {r === 'unica' ? 'Única' : r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-emerald-950/80">Enviar automaticamente por</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => toggleCanal('email')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                canais.includes('email')
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-emerald-100 text-emerald-950/60 hover:bg-emerald-50/50'
              }`}
            >
              <Mail size={16} /> E-mail
            </button>
            <button
              type="button"
              onClick={() => toggleCanal('whatsapp')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                canais.includes('whatsapp')
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-emerald-100 text-emerald-950/60 hover:bg-emerald-50/50'
              }`}
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!clientes.length}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Gerar e enviar cobrança
        </button>
      </form>
    </div>
  );
}
