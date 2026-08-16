import type { StatusAgendamento } from '../../types';

const ESTILOS: Record<StatusAgendamento, string> = {
  confirmado: 'bg-emerald-50 text-emerald-600',
  concluido: 'bg-blush-50 text-blush-700',
  cancelado: 'bg-red-50 text-red-500',
};

const LABELS: Record<StatusAgendamento, string> = {
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export default function StatusBadge({ status }: { status: StatusAgendamento }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ESTILOS[status]}`}>
      {LABELS[status]}
    </span>
  );
}
