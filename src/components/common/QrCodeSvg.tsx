import React from 'react';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  subText?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  value,
  size = 200,
  className = '',
  subText,
}) => {
  // Deterministic 21x21 QR pattern simulation with authentic finder patterns
  const matrixSize = 25;
  const isFinder = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right
    if (r < 7 && c >= matrixSize - 7) {
      const oc = c - (matrixSize - 7);
      if (r === 0 || r === 6 || oc === 0 || oc === 6) return true;
      if (r >= 2 && r <= 4 && oc >= 2 && oc <= 4) return true;
      return false;
    }
    // Bottom-left
    if (r >= matrixSize - 7 && c < 7) {
      const or = r - (matrixSize - 7);
      if (or === 0 || or === 6 || c === 0 || c === 6) return true;
      if (or >= 2 && or <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return null;
  };

  // Pseudo-random but consistent bits based on value
  const cells: boolean[][] = [];
  for (let r = 0; r < matrixSize; r++) {
    cells[r] = [];
    for (let c = 0; c < matrixSize; c++) {
      const finder = isFinder(r, c);
      if (finder !== null) {
        cells[r][c] = finder;
      } else {
        // Alignment patterns or timing lines
        if (r === 6 || c === 6) {
          cells[r][c] = (r + c) % 2 === 0;
        } else {
          const charCode = value.charCodeAt((r * 7 + c * 13) % value.length) || 42;
          cells[r][c] = ((r * c * 3 + charCode + r * 5) % 3) === 0;
        }
      }
    }
  }

  const cellSize = 100 / matrixSize;

  return (
    <div className={`flex flex-col items-center bg-white p-4 rounded-2xl border border-[#ede7dd] shadow-sm ${className}`}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="block rounded-lg"
      >
        <rect width="100" height="100" fill="#ffffff" />
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize * 0.96}
                height={cellSize * 0.96}
                rx={cellSize * 0.15}
                fill="#11233e"
              />
            ) : null
          )
        )}
        {/* Subtle orange accent dot in the center */}
        <circle cx="50" cy="50" r="4.5" fill="#f8a368" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
      {subText && (
        <span className="mt-2 text-[11px] font-bold text-[#64748b] text-center">
          {subText}
        </span>
      )}
    </div>
  );
};
