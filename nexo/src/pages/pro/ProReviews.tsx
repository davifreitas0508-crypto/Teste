import { Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getProfissional } from '../../data/mockData';
import { formatarDataLabel } from '../../utils/date';
import EmptyState from '../../components/ui/EmptyState';

const NOMES_DEMO: Record<string, string> = {
  'cliente-1': 'Fernanda Souza',
  'cliente-2': 'Juliana Alves',
  'cliente-3': 'Bianca Martins',
  'cliente-4': 'Larissa Costa',
  'outra-cliente': 'Patrícia Lima',
};

export default function ProReviews() {
  const { sessao, avaliacoes } = useApp();
  const profissionalId = sessao?.tipo === 'profissional' ? sessao.profissionalId : '';
  const profissional = getProfissional(profissionalId);

  const minhas = avaliacoes
    .filter((a) => a.profissionalId === profissionalId)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  const media = minhas.length ? minhas.reduce((s, a) => s + a.nota, 0) / minhas.length : profissional?.avaliacaoMedia ?? 0;
  const distribuicao = [5, 4, 3, 2, 1].map((n) => minhas.filter((a) => a.nota === n).length);
  const maxDist = Math.max(1, ...distribuicao);

  return (
    <div className="fade-in pb-8">
      <header className="px-5 pb-3 pt-4">
        <h1 className="font-display text-xl font-semibold">Avaliações</h1>
      </header>

      <section className="px-5">
        <div className="flex items-center gap-5 rounded-3xl bg-white p-5 shadow-soft">
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-blush-800">{media.toFixed(1)}</p>
            <div className="mt-1 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} className={i < Math.round(media) ? 'fill-gold-500 text-gold-500' : 'text-blush-200'} />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-ink/40">{minhas.length} avaliações</p>
          </div>
          <div className="flex-1 space-y-1">
            {distribuicao.map((qtd, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 text-[10px] text-ink/40">{5 - i}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush-50">
                  <div
                    className="h-full rounded-full bg-gold-500"
                    style={{ width: `${(qtd / maxDist) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 flex flex-col gap-3 px-5">
        {minhas.length === 0 ? (
          <EmptyState icone={Star} titulo="Nenhuma avaliação ainda" />
        ) : (
          minhas.map((av) => (
            <div key={av.id} className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{NOMES_DEMO[av.clienteId] ?? 'Cliente'}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < av.nota ? 'fill-gold-500 text-gold-500' : 'text-blush-200'} />
                  ))}
                </div>
              </div>
              <p className="mt-1.5 text-sm text-ink/65">{av.comentario}</p>
              <p className="mt-1.5 text-[11px] text-ink/35">{formatarDataLabel(av.criadoEm.slice(0, 10))}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
