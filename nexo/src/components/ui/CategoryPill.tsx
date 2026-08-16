import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Categoria } from '../../types';

export default function CategoryPill({
  categoria,
  ativo,
  onClick,
}: {
  categoria: Categoria;
  ativo?: boolean;
  onClick?: () => void;
}) {
  const Icone = (Icons as unknown as Record<string, LucideIcon>)[categoria.icone] ?? Icons.Gem;
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
          ativo
            ? 'bg-blush-700 text-white shadow-soft'
            : 'bg-blush-50 text-blush-700 hover:bg-blush-100'
        }`}
      >
        <Icone size={22} strokeWidth={1.7} />
      </span>
      <span className={`text-xs ${ativo ? 'font-semibold text-blush-800' : 'font-medium text-ink/60'}`}>
        {categoria.nome}
      </span>
    </button>
  );
}
