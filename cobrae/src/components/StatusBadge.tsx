import type { StatusCobranca } from '../types';

const styles: Record<StatusCobranca, string> = {
  pago: 'bg-emerald-100 text-emerald-700',
  pendente: 'bg-amber-100 text-amber-700',
  vencido: 'bg-red-100 text-red-700',
  cancelado: 'bg-gray-100 text-gray-500',
};

const labels: Record<StatusCobranca, string> = {
  pago: 'Pago',
  pendente: 'Pendente',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
};

export default function StatusBadge({ status }: { status: StatusCobranca }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
