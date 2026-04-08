export default function BitcoinGlow({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="btc-glow-pulse"
      >
        <defs>
          <radialGradient id="btcGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F7931A" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#F7931A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#F7931A" stopOpacity="0" />
          </radialGradient>
          <filter id="btcBlur">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer glow circle */}
        <circle cx="32" cy="32" r="30" fill="url(#btcGlow)" />

        {/* Background circle */}
        <circle cx="32" cy="32" r="24" fill="#1a0e00" stroke="#7A4A0D" strokeWidth="1.5" />

        {/* Bitcoin ₿ symbol */}
        <text
          x="32"
          y="41"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
          fill="#F7931A"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ₿
        </text>
      </svg>
    </div>
  );
}
