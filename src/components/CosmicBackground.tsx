import React, { useEffect, useRef } from 'react';
import { BoardTheme } from '../types/chess';

interface Props {
  theme: BoardTheme;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  dAlpha: number;
  rotation: number;
  vRot: number;
  color: string;
}

export const CosmicBackground: React.FC<Props> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate theme-specific particles
    const particleCount = theme.particleType === 'sakura_petals' ? 45 : 70;
    const particles: Particle[] = [];

    const getParticleColor = () => {
      if (theme.particleType === 'gold_dust') {
        return Math.random() > 0.5 ? '#fde047' : '#eab308';
      }
      if (theme.particleType === 'ice_sparks') {
        return Math.random() > 0.5 ? '#38bdf8' : '#e0f2fe';
      }
      if (theme.particleType === 'sakura_petals') {
        return Math.random() > 0.5 ? '#f472b6' : '#fbcfe8';
      }
      if (theme.particleType === 'neon_grid') {
        return Math.random() > 0.5 ? '#06b6d4' : '#d946ef';
      }
      // stars default
      return Math.random() > 0.6 ? '#c084fc' : '#ffffff';
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          theme.particleType === 'sakura_petals'
            ? Math.random() * 6 + 4
            : Math.random() * 2.5 + 0.8,
        vx:
          theme.particleType === 'sakura_petals'
            ? (Math.random() - 0.2) * 0.8
            : (Math.random() - 0.5) * 0.4,
        vy:
          theme.particleType === 'sakura_petals'
            ? Math.random() * 1.2 + 0.5
            : (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        dAlpha: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        color: getParticleColor(),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;
        p.rotation += p.vRot;

        if (p.alpha <= 0.1 || p.alpha >= 0.9) {
          p.dAlpha = -p.dAlpha;
        }

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;

        if (theme.particleType === 'sakura_petals') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          // Draw delicate sakura petal ellipse
          ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme.particleType === 'neon_grid') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background theme texture image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${theme.bgImage})` }}
      />
      {/* Cinematic dark scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070510]/85 via-[#090714]/75 to-[#05030b]/92 backdrop-blur-[2px]" />
      {/* Interactive canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />
    </div>
  );
};
