import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<string, string> = {
  primary:
    'bg-blush-700 text-white hover:bg-blush-800 active:scale-[0.98] shadow-soft disabled:bg-blush-200 disabled:text-white/70',
  secondary: 'bg-blush-100 text-blush-800 hover:bg-blush-200 active:scale-[0.98]',
  outline: 'border border-blush-300 text-blush-800 hover:bg-blush-50 active:scale-[0.98]',
  ghost: 'text-blush-700 hover:bg-blush-50 active:scale-[0.98]',
};

export default function Button({
  variant = 'primary',
  fullWidth,
  loading,
  icon,
  children,
  className = '',
  disabled,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed ${VARIANTS[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
