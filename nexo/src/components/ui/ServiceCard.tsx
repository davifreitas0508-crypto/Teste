import { Clock } from 'lucide-react';
import type { Servico } from '../../types';
import { formatarDuracao, formatarMoeda } from '../../utils/date';

export default function ServiceCard({
  servico,
  selecionado,
  onClick,
}: {
  servico: Servico;
  selecionado?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-3xl border p-3 text-left transition-all ${
        selecionado
          ? 'border-blush-500 bg-blush-50 shadow-soft'
          : 'border-transparent bg-white shadow-soft active:scale-[0.98]'
      }`}
    >
      <img src={servico.foto} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold leading-tight">{servico.nome}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-ink/50">{servico.descricao}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-ink/50">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {formatarDuracao(servico.duracaoMin)}
          </span>
          <span className="font-semibold text-blush-700">{formatarMoeda(servico.preco)}</span>
        </div>
      </div>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          selecionado ? 'border-blush-600 bg-blush-600' : 'border-blush-200'
        }`}
      >
        {selecionado && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}
