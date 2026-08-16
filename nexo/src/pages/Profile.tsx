import { useState } from 'react';
import { Bell, ChevronRight, LogOut, Pencil, Receipt, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProfissional, getServico } from '../data/mockData';
import { formatarDataLabel, formatarMoeda } from '../utils/date';
import Sheet from '../components/ui/Sheet';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function Profile() {
  const navigate = useNavigate();
  const { cliente, atualizarCliente, agendamentos, sair, notificar } = useApp();
  const [editando, setEditando] = useState(false);
  const [pagamentosAberto, setPagamentosAberto] = useState(false);
  const [nome, setNome] = useState(cliente.nome);
  const [telefone, setTelefone] = useState(cliente.telefone);

  const pagamentos = agendamentos
    .filter((a) => a.clienteId === 'cliente-1' && a.status !== 'cancelado')
    .sort((a, b) => (b.data + b.horaInicio).localeCompare(a.data + a.horaInicio));

  function trocarFoto() {
    const fotos = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    ];
    const proxima = fotos[(fotos.indexOf(cliente.foto) + 1) % fotos.length];
    atualizarCliente({ foto: proxima });
    notificar('Foto de perfil atualizada!');
  }

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-xl font-semibold">Perfil</h1>
      </header>

      <section className="px-5">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft">
          <button onClick={trocarFoto} className="relative shrink-0">
            <img src={cliente.foto} alt={cliente.nome} className="h-16 w-16 rounded-2xl object-cover" />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blush-700 text-white shadow-soft">
              <Pencil size={11} />
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold">{cliente.nome}</p>
            <p className="truncate text-xs text-ink/45">{cliente.email}</p>
            <p className="truncate text-xs text-ink/45">{cliente.telefone}</p>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-50 text-blush-700"
          >
            <Pencil size={14} />
          </button>
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Conta</p>
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <ItemLista
            icone={Receipt}
            label="Pagamentos"
            onClick={() => setPagamentosAberto(true)}
          />
          <ItemLista
            icone={Bell}
            label="Notificações"
            onClick={() => notificar('Ajustes de notificação salvos automaticamente abaixo.', 'info')}
          />
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Notificações</p>
        <div className="flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-soft">
          <Toggle
            label="Confirmação de agendamento"
            checked={cliente.notificacoes.confirmacao}
            onChange={(v) => atualizarCliente({ notificacoes: { ...cliente.notificacoes, confirmacao: v } })}
          />
          <Toggle
            label="Lembretes de horário"
            checked={cliente.notificacoes.lembretes}
            onChange={(v) => atualizarCliente({ notificacoes: { ...cliente.notificacoes, lembretes: v } })}
          />
          <Toggle
            label="Promoções e novidades"
            checked={cliente.notificacoes.promocoes}
            onChange={(v) => atualizarCliente({ notificacoes: { ...cliente.notificacoes, promocoes: v } })}
          />
        </div>
      </section>

      <section className="mt-5 px-5">
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">Área profissional</p>
        <button
          onClick={() => navigate('/entrar')}
          className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-50 text-blush-700">
            <User size={17} />
          </span>
          <span className="flex-1 text-left text-sm font-medium">Sou profissional / salão</span>
          <ChevronRight size={16} className="text-ink/30" />
        </button>
      </section>

      <section className="mt-6 px-5">
        <Button variant="ghost" fullWidth className="text-red-500" icon={<LogOut size={16} />} onClick={() => {
          sair();
          navigate('/entrar');
        }}>
          Sair
        </Button>
      </section>

      <Sheet aberto={editando} onFechar={() => setEditando(false)} titulo="Editar dados">
        <div className="flex flex-col gap-3">
          <Campo label="Nome" valor={nome} onChange={setNome} />
          <Campo label="Telefone" valor={telefone} onChange={setTelefone} />
          <Button
            fullWidth
            className="mt-2"
            onClick={() => {
              atualizarCliente({ nome, telefone });
              notificar('Dados atualizados com sucesso!');
              setEditando(false);
            }}
          >
            Salvar alterações
          </Button>
        </div>
      </Sheet>

      <Sheet aberto={pagamentosAberto} onFechar={() => setPagamentosAberto(false)} titulo="Histórico de pagamentos">
        {pagamentos.length === 0 ? (
          <EmptyState icone={Receipt} titulo="Nenhum pagamento ainda" />
        ) : (
          <div className="flex flex-col gap-2.5">
            {pagamentos.map((p) => {
              const serv = getServico(p.servicoId);
              const prof = getProfissional(p.profissionalId);
              return (
                <div key={p.id} className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-soft">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{serv?.nome}</p>
                    <p className="truncate text-xs text-ink/45">
                      {prof?.nome} · {formatarDataLabel(p.data)}
                    </p>
                  </div>
                  <p className="shrink-0 pl-3 text-sm font-bold text-blush-800">{formatarMoeda(p.valorTotal)}</p>
                </div>
              );
            })}
          </div>
        )}
      </Sheet>
    </div>
  );
}

function ItemLista({
  icone: Icone,
  label,
  onClick,
}: {
  icone: typeof Receipt;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-blush-50 p-4 last:border-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-50 text-blush-700">
        <Icone size={16} />
      </span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      <ChevronRight size={16} className="text-ink/30" />
    </button>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-ink/70">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blush-700' : 'bg-blush-100'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function Campo({ label, valor, onChange }: { label: string; valor: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink/50">{label}</span>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white px-4 py-3 text-sm shadow-soft outline-none"
      />
    </label>
  );
}
