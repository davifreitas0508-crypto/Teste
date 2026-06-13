interface NexoLogoProps {
  size?: number;
  textSize?: string;
  showText?: boolean;
}

export default function NexoLogo({ size = 40, showText = true }: NexoLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="nexo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="nexo-bridge" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle cx="20" cy="20" r="20" fill="url(#nexo-grad)" />

        {/* Left node */}
        <circle cx="9" cy="20" r="4.5" fill="white" opacity="0.95" />
        {/* Right node */}
        <circle cx="31" cy="20" r="4.5" fill="white" opacity="0.95" />

        {/* Bridge / connection arcs */}
        <path
          d="M13.5 20 Q20 11 26.5 20"
          stroke="url(#nexo-bridge)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M13.5 20 Q20 29 26.5 20"
          stroke="url(#nexo-bridge)"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx="20" cy="20" r="2" fill="white" opacity="0.9" />

        {/* Arrow indicators on bridge */}
        <circle cx="20" cy="14.2" r="1.2" fill="white" opacity="0.6" />
        <circle cx="20" cy="25.8" r="1.2" fill="white" opacity="0.6" />
      </svg>

      {showText && (
        <span
          className="font-bold tracking-tight select-none"
          style={{
            fontSize: size * 0.65,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Nexo
        </span>
      )}
    </div>
  );
}
