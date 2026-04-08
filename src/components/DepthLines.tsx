export default function DepthLines({ className = '' }: { className?: string }) {
  const lines = [
    { y: 20, opacity: 0.06, amplitude: 3 },
    { y: 35, opacity: 0.08, amplitude: 4 },
    { y: 50, opacity: 0.10, amplitude: 5 },
    { y: 65, opacity: 0.08, amplitude: 3 },
    { y: 80, opacity: 0.06, amplitude: 4 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        width="200%"
        height="100%"
        viewBox="0 0 2000 100"
        preserveAspectRatio="none"
        className="depth-drift absolute top-0 left-0"
        style={{ animation: 'depth-drift 30s linear infinite' }}
      >
        {lines.map((line, i) => (
          <path
            key={i}
            d={`M 0 ${line.y} 
              Q 250 ${line.y - line.amplitude} 500 ${line.y}
              Q 750 ${line.y + line.amplitude} 1000 ${line.y}
              Q 1250 ${line.y - line.amplitude} 1500 ${line.y}
              Q 1750 ${line.y + line.amplitude} 2000 ${line.y}`}
            stroke="#6C5CE7"
            strokeWidth="0.5"
            strokeOpacity={line.opacity}
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}
