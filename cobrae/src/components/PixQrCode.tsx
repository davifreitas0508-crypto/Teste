function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function PixQrCode({ code, size = 176 }: { code: string; size?: number }) {
  const seed = Array.from(code).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) || 1;
  const rand = seededRandom(seed);
  const cells = 21;
  const cellSize = size / cells;

  const isFinderCell = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg bg-white p-2">
      <rect width={size} height={size} fill="#ffffff" />
      {Array.from({ length: cells }).map((_, r) =>
        Array.from({ length: cells }).map((_, c) => {
          if (isFinderCell(r, c)) return null;
          if (rand() > 0.58) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0f2e1c"
            />
          );
        })
      )}
      {[
        [0, 0],
        [0, cells - 7],
        [cells - 7, 0],
      ].map(([fr, fc]) => (
        <g key={`${fr}-${fc}`}>
          <rect x={fc * cellSize} y={fr * cellSize} width={cellSize * 7} height={cellSize * 7} fill="#0f2e1c" />
          <rect
            x={fc * cellSize + cellSize}
            y={fr * cellSize + cellSize}
            width={cellSize * 5}
            height={cellSize * 5}
            fill="#ffffff"
          />
          <rect
            x={fc * cellSize + cellSize * 2}
            y={fr * cellSize + cellSize * 2}
            width={cellSize * 3}
            height={cellSize * 3}
            fill="#0f2e1c"
          />
        </g>
      ))}
    </svg>
  );
}
