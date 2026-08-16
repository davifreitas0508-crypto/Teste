import { LogOut } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import ProBottomNav from '../components/ProBottomNav';
import { useApp } from '../context/AppContext';
import { getProfissional } from '../data/mockData';

export default function ProLayout() {
  const { sessao, sair } = useApp();
  const profissionalId = sessao?.tipo === 'profissional' ? sessao.profissionalId : undefined;
  const profissional = profissionalId ? getProfissional(profissionalId) : undefined;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-1 flex-col bg-cream">
      <header className="flex items-center justify-between gap-3 bg-white px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-soft">
        <div className="flex items-center gap-3">
          <img
            src={profissional?.fotoPerfil}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-2 ring-blush-200"
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink/40">Painel profissional</p>
            <p className="font-display text-base font-semibold leading-tight">{profissional?.nome}</p>
          </div>
        </div>
        <button
          onClick={sair}
          aria-label="Sair"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-50 text-blush-700 transition-colors hover:bg-blush-100"
        >
          <LogOut size={17} />
        </button>
      </header>
      <div className="flex-1 pb-2">
        <Outlet />
      </div>
      <ProBottomNav />
    </div>
  );
}
