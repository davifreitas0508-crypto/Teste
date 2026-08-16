import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatarDataLabel, formatarMoeda } from '../../utils/date';
import EmptyState from '../../components/ui/EmptyState';

const NOMES_DEMO: Record<string, { nome: string; foto: string }> = {
  'cliente-1': {
    nome: 'Fernanda Souza',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
  },
  'cliente-2': {
    nome: 'Juliana Alves',
    foto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop',
  },
  'cliente-3': {
    nome: 'Bianca Martins',
    foto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop',
  },
  'cliente-4': {
    nome: 'Larissa Costa',
    foto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop',
  },
  'outra-cliente': {
    nome: 'Patrícia Lima',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
  },
};

export default function ProClients() {
  const { sessao, agendamentos } = useApp();
  const profissionalId = sessao?.tipo === 'profissional' ? sessao.profissionalId : '';

  const clientes = useMemo(() => {
    const doProfissional = agendamentos.filter(
      (a) => a.profissionalId === profissionalId && a.status !== 'cancelado',
    );
    const mapa = new Map<
      string,
      { clienteId: string; visitas: number; totalGasto: number; ultimaData: string }
    >();
    doProfissional.forEach((a) => {
      const atual = mapa.get(a.clienteId);
      if (atual) {
        atual.visitas += 1;
        atual.totalGasto += a.valorTotal;
        if (a.data > atual.ultimaData) atual.ultimaData = a.data;
      } else {
        mapa.set(a.clienteId, {
          clienteId: a.clienteId,
          visitas: 1,
          totalGasto: a.valorTotal,
          ultimaData: a.data,
        });
      }
    });
    return Array.from(mapa.values()).sort((a, b) => b.ultimaData.localeCompare(a.ultimaData));
  }, [agendamentos, profissionalId]);

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-3 pt-4">
        <h1 className="font-display text-xl font-semibold">Clientes</h1>
        <p className="text-sm text-ink/50">{clientes.length} clientes atendidas</p>
      </header>

      <section className="flex flex-col gap-3 px-5">
        {clientes.length === 0 ? (
          <EmptyState icone={Users} titulo="Nenhuma cliente ainda" />
        ) : (
          clientes.map((c) => {
            const info = NOMES_DEMO[c.clienteId] ?? { nome: 'Cliente', foto: '' };
            return (
              <div key={c.clienteId} className="flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-soft">
                <img src={info.foto} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold leading-tight">{info.nome}</p>
                  <p className="text-xs text-ink/45">
                    {c.visitas} {c.visitas === 1 ? 'visita' : 'visitas'} · última em {formatarDataLabel(c.ultimaData)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-blush-800">{formatarMoeda(c.totalGasto)}</p>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
