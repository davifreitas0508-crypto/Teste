import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({
  valor,
  onChange,
  placeholder = 'O que você deseja fazer hoje?',
  onFiltro,
  ...rest
}: {
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onFiltro?: () => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3.5 shadow-soft">
      <Search size={18} className="shrink-0 text-blush-500" />
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/35 outline-none"
        {...rest}
      />
      {onFiltro && (
        <button
          onClick={onFiltro}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-50 text-blush-700"
          aria-label="Filtros"
        >
          <SlidersHorizontal size={15} />
        </button>
      )}
    </div>
  );
}
