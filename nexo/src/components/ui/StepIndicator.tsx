export default function StepIndicator({ etapaAtual, total }: { etapaAtual: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === etapaAtual ? 'w-6 bg-blush-700' : i < etapaAtual ? 'w-1.5 bg-blush-400' : 'w-1.5 bg-blush-100'
          }`}
        />
      ))}
    </div>
  );
}
