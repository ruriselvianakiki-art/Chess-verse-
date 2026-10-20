import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

interface Props {
  x: number;
  y: number;
  color: string;
  onDone: () => void;
}

export const CaptureBurst: React.FC<Props> = ({ x, y, color, onDone }) => {
  const [particles, setParticles] = useState<Particle[]>(() => {
    const list: Particle[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 45 + 20;
      list.push({
        id: i,
        x: 0,
        y: 0,
        size: Math.random() * 4 + 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.4 ? color : '#ffffff',
        alpha: 1,
      });
    }
    return list;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-ping duration-500"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            transform: `translate(${p.vx}px, ${p.vy}px)`,
            opacity: 0,
            transition: 'all 550ms cubic-bezier(0.1, 0.9, 0.2, 1)',
          }}
        />
      ))}
      <div
        className="w-12 h-12 rounded-full absolute -top-6 -left-6 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: 'ping 400ms ease-out forwards',
        }}
      />
    </div>
  );
};
