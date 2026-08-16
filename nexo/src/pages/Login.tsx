import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { profissionais } from '../data/mockData';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { entrarComoCliente, entrarComoProfissional } = useApp();
  const [modo, setModo] = useState<'inicial' | 'profissional'>('inicial');

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-1 flex-col justify-center bg-gradient-to-b from-blush-100 via-blush-50 to-cream px-6 py-10">
      <div className="fade-in flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-soft-lg">
          <Sparkles size={28} className="text-gold-500" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold text-blush-900">Belle</h1>
        <p className="mt-1.5 max-w-[26ch] text-sm text-ink/55">
          Agende manicure, cabelo, maquiagem e muito mais com as melhores profissionais perto de você.
        </p>
      </div>

      {modo === 'inicial' ? (
        <div className="mt-10 flex flex-col gap-3">
          <Button
            fullWidth
            onClick={() => {
              entrarComoCliente();
              navigate('/');
            }}
          >
            Entrar como cliente
          </Button>
          <Button fullWidth variant="outline" onClick={() => setModo('profissional')}>
            Entrar como profissional / salão
          </Button>
          <p className="mt-2 px-4 text-center text-[11px] leading-relaxed text-ink/35">
            Este é um app de demonstração — não é necessário senha, basta escolher um perfil para explorar.
          </p>
        </div>
      ) : (
        <div className="mt-8 fade-in">
          <button
            onClick={() => setModo('inicial')}
            className="mb-4 flex items-center gap-1.5 text-sm font-medium text-blush-700"
          >
            <ArrowLeft size={15} /> Voltar
          </button>
          <p className="mb-3 text-sm text-ink/50">Escolha um perfil profissional para entrar</p>
          <div className="flex flex-col gap-2.5">
            {profissionais.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  entrarComoProfissional(p.id);
                  navigate('/pro');
                }}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-soft transition-transform active:scale-[0.98]"
              >
                <img src={p.fotoPerfil} alt="" className="h-11 w-11 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.nome}</p>
                  <p className="truncate text-xs text-ink/45">{p.bairro}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
