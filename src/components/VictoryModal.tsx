import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BoardTheme } from '../types/chess';
import { Trophy, Coins, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface Props {
  winner: 'w' | 'b' | 'draw' | null;
  reason: string;
  theme: BoardTheme;
  earnedCoins: number;
  earnedXp: number;
  currentLevel: number;
  playerWon: boolean;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal: React.FC<Props> = ({
  winner,
  reason,
  theme,
  earnedCoins,
  earnedXp,
  currentLevel,
  playerWon,
  onPlayAgain,
  onBackToMenu,
}) => {
  useEffect(() => {
    if (playerWon) {
      sound.playVictory();
      // Multiple celebratory fireworks bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.65 },
        colors: ['#a855f7', '#ec4899', '#38bdf8', '#fbbf24', '#ffffff'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [playerWon]);

  const getRankTitle = (lvl: number) => {
    if (lvl <= 10) return 'Beginner';
    if (lvl <= 25) return 'Intermediate';
    if (lvl <= 50) return 'Expert';
    return 'Grandmaster';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl border text-center flex flex-col items-center gap-5 shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: '#0c0a1a',
          borderColor: playerWon ? theme.accentColor : 'rgba(255,255,255,0.15)',
          boxShadow: playerWon
            ? `0 0 50px ${theme.glowColor}60, inset 0 0 20px ${theme.glowColor}20`
            : '0 20px 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Glow ambient circle */}
        <div
          className="absolute -top-16 w-48 h-48 rounded-full pointer-events-none opacity-40 blur-2xl"
          style={{ backgroundColor: playerWon ? theme.glowColor : '#64748b' }}
        />

        {/* Icon Badge */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative z-10"
          style={{
            backgroundColor: playerWon ? 'rgba(168, 85, 247, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            border: `1px solid ${playerWon ? theme.borderColor : '#475569'}`,
          }}
        >
          <Trophy
            className="w-8 h-8"
            style={{ color: playerWon ? theme.accentColor : '#94a3b8' }}
          />
        </div>

        {/* Title & Reason */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {winner === 'draw'
              ? 'Permainan Remis (Draw)'
              : playerWon
              ? 'Kemenangan Gemilang!'
              : 'Kekalahan Terhormat'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{reason}</p>
        </div>

        {/* Rewards Earned Bar */}
        {earnedCoins > 0 && (
          <div className="w-full grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/10 relative z-10">
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300 font-mono">+{earnedCoins} Koin</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-300 font-mono">+{earnedXp} XP</span>
            </div>
          </div>
        )}

        {/* Player Tier Badge */}
        <div className="text-xs text-slate-400 relative z-10 flex items-center gap-2">
          <span>Level {currentLevel}</span>
          <span>·</span>
          <span className="text-purple-300 font-semibold">{getRankTitle(currentLevel)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full relative z-10 mt-2">
          <button
            onClick={onBackToMenu}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-300 bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Menu Utama</span>
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 0 20px ${theme.glowColor}60`,
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
