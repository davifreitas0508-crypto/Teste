import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, PlusCircle, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { CobraeWordmark } from '../CobraeLogo';
import { useStore } from '../store';

const links = [
  { to: '/', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/cobrancas', label: 'Cobranças', icon: Receipt },
  { to: '/nova-cobranca', label: 'Nova cobrança', icon: PlusCircle },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Layout() {
  const { empresa, logout } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f4faf6]">
      {open && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-emerald-100 bg-white p-5 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <CobraeWordmark />
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-950/70 hover:bg-emerald-50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <div className="mb-3 rounded-xl bg-emerald-50 p-3">
            <p className="text-xs font-semibold text-emerald-900">{empresa?.nome ?? 'Minha empresa'}</p>
            <p className="truncate text-xs text-emerald-700/70">{empresa?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-emerald-100 bg-white px-4 py-3 md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <CobraeWordmark />
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
