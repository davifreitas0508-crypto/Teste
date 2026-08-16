import { Star } from 'lucide-react';

export default function RatingStars({
  nota,
  tamanho = 14,
  mostrarNumero = true,
}: {
  nota: number;
  tamanho?: number;
  mostrarNumero?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const preenchido = i < Math.round(nota);
          return (
            <Star
              key={i}
              size={tamanho}
              className={preenchido ? 'fill-gold-500 text-gold-500' : 'text-blush-200'}
            />
          );
        })}
      </span>
      {mostrarNumero && <span className="text-xs font-semibold text-ink/70">{nota.toFixed(1)}</span>}
    </span>
  );
}
