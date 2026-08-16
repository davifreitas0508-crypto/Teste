import { CalendarCheck2, Scissors, Settings, Star, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ITENS = [
  { to: '/pro', label: 'Agenda', icone: CalendarCheck2, fim: true },
  { to: '/pro/servicos', label: 'Serviços', icone: Scissors },
  { to: '/pro/clientes', label: 'Clientes', icone: Users },
  { to: '/pro/avaliacoes', label: 'Avaliações', icone: Star },
  { to: '/pro/configuracoes', label: 'Ajustes', icone: Settings },
];

export default function ProBottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-blush-100 bg-white/95 backdrop-blur-sm px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto flex max-w-md items-stretch justify-between">
        {ITENS.map(({ to, label, icone: Icone, fim }) => (
          <NavLink
            key={to}
            to={to}
            end={fim}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 transition-colors ${
                isActive ? 'text-blush-700' : 'text-ink/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icone size={21} strokeWidth={isActive ? 2.3 : 1.8} />
                <span className={`text-[10.5px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
