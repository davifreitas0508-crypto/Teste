import { useState } from 'react';
import { Mail, MessageCircle, QrCode, CreditCard, Save, Check } from 'lucide-react';
import { useStore } from '../store';

export default function Configuracoes() {
  const { empresa, login } = useStore();
  const [nome, setNome] = useState(empresa?.nome ?? '');
  const [email, setEmail] = useState(empresa?.email ?? '');
  const [emailAtivo, setEmailAtivo] = useState(true);
  const [whatsappAtivo, setWhatsappAtivo] = useState(true);
  const [pixAtivo, setPixAtivo] = useState(true);
  const [cartaoAtivo, setCartaoAtivo] = useState(true);
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    login({ nome, email });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 1800);
  };

  const Toggle = ({ ativo, onClick, icon: Icon, label }: { ativo: boolean; onClick: () => void; icon: typeof Mail; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
        ativo ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-emerald-100 text-emerald-950/50'
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon size={16} /> {label}
      </span>
      <span
        className={`h-5 w-9 rounded-full p-0.5 transition-colors ${ativo ? 'bg-emerald-500' : 'bg-gray-200'}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform ${ativo ? 'translate-x-4' : ''}`}
        />
      </span>
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-950">Configurações</h1>
        <p className="text-sm text-emerald-950/60">Dados da empresa e preferências de cobrança.</p>
      </div>

      <form onSubmit={handleSalvar} className="mb-6 space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-emerald-950">Dados da empresa</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-950/80">Nome da empresa</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-950/80">E-mail de contato</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {salvo ? <Check size={16} /> : <Save size={16} />}
          {salvo ? 'Salvo!' : 'Salvar alterações'}
        </button>
      </form>

      <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-emerald-950">Canais de envio automático</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Toggle ativo={emailAtivo} onClick={() => setEmailAtivo((v) => !v)} icon={Mail} label="E-mail" />
          <Toggle ativo={whatsappAtivo} onClick={() => setWhatsappAtivo((v) => !v)} icon={MessageCircle} label="WhatsApp" />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-emerald-950">Formas de pagamento aceitas</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Toggle ativo={pixAtivo} onClick={() => setPixAtivo((v) => !v)} icon={QrCode} label="Pix" />
          <Toggle ativo={cartaoAtivo} onClick={() => setCartaoAtivo((v) => !v)} icon={CreditCard} label="Cartão de crédito" />
        </div>
        <p className="mt-4 text-xs text-emerald-950/40">
          Integração com um gateway de pagamentos real (Pix, cartão) pode ser conectada aqui futuramente.
        </p>
      </div>
    </div>
  );
}
