import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Sheet({
  aberto,
  onFechar,
  titulo,
  children,
}: {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
}) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]" onClick={onFechar} />
      <div className="scale-in relative z-10 mx-auto w-full max-w-md rounded-t-[2rem] bg-cream p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-soft-lg max-h-[85svh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{titulo}</h2>
          <button
            onClick={onFechar}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink/60 shadow-soft"
          >
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
