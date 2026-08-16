import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export default function EmptyState({
  icone: Icone,
  titulo,
  descricao,
  acao,
}: {
  icone: LucideIcon;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-50 text-blush-400">
        <Icone size={28} strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{titulo}</h3>
      {descricao && <p className="max-w-[26ch] text-sm text-ink/50">{descricao}</p>}
      {acao}
    </div>
  );
}
