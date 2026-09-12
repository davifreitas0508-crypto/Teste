import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CobraeWordmark } from '../CobraeLogo';
import { useStore } from '../store';
import { QrCode, Mail, MessageCircle, CreditCard } from 'lucide-react';

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      nome: nome.trim() || 'Minha Empresa',
      email: email.trim() || 'contato@minhaempresa.com',
    });
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 p-10 text-white md:flex">
        <CobraeWordmark className="[&_span]:text-white [&_span_span]:text-emerald-200" />

        <div>
          <h1 className="mb-4 text-3xl font-bold leading-tight">
            Cobranças automáticas para o seu negócio.
          </h1>
          <p className="max-w-md text-emerald-50/90">
            Gere cobranças via Pix ou cartão e envie automaticamente para o e-mail e WhatsApp
            dos seus clientes. Simples, rápido e sem esquecer nenhum vencimento.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-4 text-center">
            <QrCode size={22} />
            Pix na hora
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-4 text-center">
            <CreditCard size={22} />
            Cartão de crédito
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-4 text-center">
            <Mail size={22} />
            <MessageCircle size={22} />
            Envio automático
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#f4faf6] p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm fade-in"
        >
          <div className="mb-6 md:hidden">
            <CobraeWordmark />
          </div>
          <h2 className="mb-1 text-xl font-bold text-emerald-950">Acesse sua conta</h2>
          <p className="mb-6 text-sm text-emerald-950/60">
            Entre com os dados da sua empresa para gerenciar suas cobranças.
          </p>

          <label className="mb-1 block text-sm font-medium text-emerald-950/80">
            Nome da empresa
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Padaria Pão Dourado"
            className="mb-4 w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <label className="mb-1 block text-sm font-medium text-emerald-950/80">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@suaempresa.com"
            className="mb-6 w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Entrar no Cobraê
          </button>

          <p className="mt-4 text-center text-xs text-emerald-950/40">
            Ambiente de demonstração — nenhuma cobrança real é gerada.
          </p>
        </form>
      </div>
    </div>
  );
}
