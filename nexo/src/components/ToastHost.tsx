import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONES = {
  sucesso: CheckCircle2,
  erro: XCircle,
  info: Info,
};

const CORES = {
  sucesso: 'bg-blush-700 text-white',
  erro: 'bg-red-500 text-white',
  info: 'bg-ink text-white',
};

export default function ToastHost() {
  const { toasts, removerToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => {
        const Icone = ICONES[t.tipo];
        return (
          <button
            key={t.id}
            onClick={() => removerToast(t.id)}
            className={`pointer-events-auto scale-in flex items-center gap-2 rounded-full px-4 py-2.5 shadow-soft-lg text-sm font-medium max-w-sm ${CORES[t.tipo]}`}
          >
            <Icone size={16} className="shrink-0" />
            <span className="text-left">{t.mensagem}</span>
          </button>
        );
      })}
    </div>
  );
}
