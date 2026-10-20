import React from 'react';
import { Color, PieceSymbol } from 'chess.js';
import { BoardTheme, AIDifficulty, GameMode } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  Flag,
  RefreshCw,
  Clock,
  Shield,
  Bot,
  User,
  Globe,
} from 'lucide-react';

interface Props {
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  whiteTimer: number;
  blackTimer: number;
  currentTurn: Color;
  inCheck: boolean;
  theme: BoardTheme;
  is3d: boolean;
  flipped: boolean;
  soundEnabled: boolean;
  capturedWhite: PieceSymbol[];
  capturedBlack: PieceSymbol[];
  onToggle3d: () => void;
  onToggleFlip: () => void;
  onToggleSound: () => void;
  onUndo: () => void;
  onResign: () => void;
  onNewGame: () => void;
  onGetHint?: () => void;
  opponentName?: string;
  opponentRating?: number;
}

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const GameHUD: React.FC<Props> = ({
  mode,
  aiDifficulty,
  whiteTimer,
  blackTimer,
  currentTurn,
  inCheck,
  theme,
  is3d,
  flipped,
  soundEnabled,
  capturedWhite,
  capturedBlack,
  onToggle3d,
  onToggleFlip,
  onToggleSound,
  onUndo,
  onResign,
  onNewGame,
  onGetHint,
  opponentName,
  opponentRating,
}) => {
  // Calculate material advantage
  const whiteScore = capturedBlack.reduce((acc, p) => acc + PIECE_VALUES[p], 0);
  const blackScore = capturedWhite.reduce((acc, p) => acc + PIECE_VALUES[p], 0);
  const diff = whiteScore - blackScore;

  const getOpponentTitle = () => {
    if (mode === 'ai') {
      const titles: Record<AIDifficulty, string> = {
        novice: 'AI Pemula (Rating 950)',
        intermediate: 'AI Menengah (Rating 1450)',
        expert: 'AI Pakar (Rating 1850)',
        grandmaster: 'Aura Grandmaster (Rating 2400)',
      };
      return titles[aiDifficulty];
    }
    if (mode === 'pass_play') {
      return 'Pemain 2 (Lokal)';
    }
    if (mode === 'online') {
      return opponentName ? `${opponentName} (${opponentRating || 1500})` : 'Pemain Online';
    }
    return 'Lawan Tantangan';
  };

  return (
    <div className="w-full max-w-[540px] flex flex-col gap-2.5">
      {/* Top Player (Black) Card */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 backdrop-blur-md ${
          currentTurn === 'b' ? 'ring-1' : 'opacity-85'
        }`}
        style={{
          backgroundColor: 'rgba(15, 12, 28, 0.75)',
          borderColor: currentTurn === 'b' ? theme.accentColor : 'rgba(255, 255, 255, 0.08)',
          boxShadow: currentTurn === 'b' ? `0 0 15px ${theme.glowColor}40` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-md"
            style={{
              backgroundColor: '#1e1b4b',
              border: `1px solid ${theme.borderColor}80`,
              color: theme.accentColor,
            }}
          >
            {mode === 'ai' ? <Bot className="w-5 h-5" /> : mode === 'online' ? <Globe className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{getOpponentTitle()}</span>
              {currentTurn === 'b' && inCheck && (
                <span className="text-[11px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50 animate-pulse">
                  SKAK!
                </span>
              )}
            </div>
            {/* Captured white pieces display */}
            <div className="flex items-center gap-1 mt-0.5 min-h-[18px]">
              {capturedWhite.map((p, idx) => (
                <div key={idx} className="w-3.5 h-3.5 opacity-80">
                  <ChessPieceSvg type={p} color="w" theme={theme} />
                </div>
              ))}
              {diff < 0 && (
                <span className="text-[11px] font-mono text-emerald-400 ml-1 font-semibold">
                  +{Math.abs(diff)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Black Clock */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm tracking-wider tabular-nums ${
            currentTurn === 'b' ? 'bg-purple-950/90 text-purple-200 border border-purple-500/40' : 'bg-black/40 text-slate-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5 opacity-70" />
          <span>{formatTime(blackTimer)}</span>
        </div>
      </div>

      {/* Quick Action Control Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle3d}
            title={is3d ? 'Beralih ke tampilan 2D datar' : 'Beralih ke tampilan 3D bersudut'}
            className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              is3d ? 'text-purple-300 bg-purple-900/40 border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{is3d ? '3D' : '2D'}</span>
          </button>
          <button
            onClick={onToggleFlip}
            title="Putar Orientasi Papan"
            className="p-2 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Putar</span>
          </button>
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan Suara' : 'Hidupkan Suara'}
            className="p-2 rounded-md text-xs text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onGetHint && (
            <button
              onClick={onGetHint}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Petunjuk</span>
            </button>
          )}
          {mode !== 'online' && (
            <button
              onClick={onUndo}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Undo</span>
            </button>
          )}
          <button
            onClick={onResign}
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/50 flex items-center gap-1 transition-colors"
          >
            <Flag className="w-3 h-3" />
            <span>Menyerah</span>
          </button>
        </div>
      </div>

      {/* Bottom Player (White / User) Card */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 backdrop-blur-md ${
          currentTurn === 'w' ? 'ring-1' : 'opacity-85'
        }`}
        style={{
          backgroundColor: 'rgba(15, 12, 28, 0.75)',
          borderColor: currentTurn === 'w' ? theme.accentColor : 'rgba(255, 255, 255, 0.08)',
          boxShadow: currentTurn === 'w' ? `0 0 15px ${theme.glowColor}40` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-md"
            style={{
              backgroundColor: '#3b0764',
              border: `1px solid ${theme.borderColor}`,
              color: '#ffffff',
            }}
          >
            <Shield className="w-5 h-5 text-purple-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Anda (Putih)</span>
              {currentTurn === 'w' && inCheck && (
                <span className="text-[11px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50 animate-pulse">
                  SKAK!
                </span>
              )}
            </div>
            {/* Captured black pieces display */}
            <div className="flex items-center gap-1 mt-0.5 min-h-[18px]">
              {capturedBlack.map((p, idx) => (
                <div key={idx} className="w-3.5 h-3.5 opacity-80">
                  <ChessPieceSvg type={p} color="b" theme={theme} />
                </div>
              ))}
              {diff > 0 && (
                <span className="text-[11px] font-mono text-emerald-400 ml-1 font-semibold">
                  +{diff}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* White Clock */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm tracking-wider tabular-nums ${
            currentTurn === 'w' ? 'bg-purple-950/90 text-purple-200 border border-purple-500/40' : 'bg-black/40 text-slate-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5 opacity-70" />
          <span>{formatTime(whiteTimer)}</span>
        </div>
      </div>
    </div>
  );
};
