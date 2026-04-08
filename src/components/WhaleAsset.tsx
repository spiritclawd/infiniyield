export default function WhaleAsset({ className = '' }: { className?: string }) {
  return (
    <svg
      width="240"
      height="110"
      viewBox="0 0 240 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="whaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f4e" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#2D2660" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0D0F1A" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="whaleFin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2D2660" stopOpacity="0.2" />
        </linearGradient>
        <filter id="whaleBlur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      {/* Body — main silhouette */}
      <path
        d="M20 60 C30 35, 60 25, 100 28 C140 31, 175 35, 200 45 C220 52, 230 58, 232 62 C230 68, 210 72, 195 70 C175 68, 150 65, 120 64 C90 63, 55 68, 35 75 C22 80, 10 78, 8 68 C6 60, 14 65, 20 60 Z"
        fill="url(#whaleGrad)"
      />

      {/* Dorsal fin */}
      <path
        d="M130 28 C133 15, 145 8, 150 18 C152 23, 148 28, 140 29 Z"
        fill="url(#whaleFin)"
      />

      {/* Tail flukes */}
      <path
        d="M195 70 C210 65, 228 52, 232 62 C235 70, 225 82, 215 78 C208 75, 205 70, 200 72 C196 74, 198 78, 196 82 C192 90, 182 92, 178 84 C176 78, 185 72, 195 70 Z"
        fill="url(#whaleGrad)"
      />

      {/* Pectoral fin */}
      <path
        d="M75 58 C70 70, 58 82, 48 80 C42 78, 45 70, 55 65 C62 61, 70 58, 75 58 Z"
        fill="url(#whaleFin)"
      />

      {/* Eye — tiny circle */}
      <circle cx="45" cy="52" r="2.5" fill="#6C5CE7" opacity="0.8" />
      <circle cx="45" cy="52" r="1" fill="#F8FAFC" opacity="0.6" />

      {/* Subtle belly highlight */}
      <path
        d="M40 68 C60 72, 100 74, 140 70 C160 68, 175 66, 185 65"
        stroke="#4a4a8a"
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
    </svg>
  );
}
