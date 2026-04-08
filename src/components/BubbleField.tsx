'use client';

import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function BubbleField({ count = 20 }: { count?: number }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generated: Bubble[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setBubbles(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/5"
          style={{
            left: `${b.x}%`,
            bottom: '-20px',
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s ${b.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}
