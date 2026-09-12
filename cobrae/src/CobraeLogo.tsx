interface Props {
  size?: number;
  className?: string;
}

export default function CobraeLogo({ size = 32, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Cobraê"
    >
      <rect width="64" height="64" rx="16" fill="#15803d" />
      <path
        d="M42 22a12 12 0 1 0 0 20"
        stroke="#ffffff"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="46" cy="42" r="4" fill="#bbf7d0" />
    </svg>
  );
}

export function CobraeWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CobraeLogo size={30} />
      <span className="text-xl font-bold tracking-tight text-emerald-950">
        Cobra<span className="text-emerald-600">ê</span>
      </span>
    </div>
  );
}
