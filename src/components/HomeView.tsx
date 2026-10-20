import React from 'react';
import { PlayerProfile, BoardTheme, GameMode } from '../types/chess';
import { THEMES } from '../data/themes';
import { CHESS_PUZZLES } from '../data/puzzles';
import {
  Bot,
  Users,
  Globe,
  Puzzle,
  GraduationCap,
  Sparkles,
  Trophy,
  Coins,
  Zap,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface Props {
  profile: PlayerProfile;
  activeTheme: BoardTheme;
  onSelectMode: (mode: GameMode) => void;
  onNavigateTab: (tab: 'play' | 'themes' | 'leaderboard' | 'settings') => void;
}

export const HomeView: React.FC<Props> = ({
  profile,
  activeTheme,
  onSelectMode,
  onNavigateTab,
}) => {
  const getRankTitle = (lvl: number) => {
    if (lvl <= 10) return 'Beginner';
    if (lvl <= 25) return 'Intermediate';
    if (lvl <= 50) return 'Expert';
    return 'Master';
  };

  const nextLevelXp = profile.level * 100;
  const xpPercentage = Math.min(100, Math.round((profile.xp / nextLevelXp) * 100));
  const dailyPuzzle = CHESS_PUZZLES[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 relative z-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-10 md:p-12 backdrop-blur-xl bg-gradient-to-r from-purple-950/40 via-slate-900/40 to-indigo-950/40 shadow-2xl">
        <div className="max-w-2xl flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-purple-300 font-mono tracking-wider">
            <span>CHESS AURA</span>
            <span aria-hidden="true">·</span>
            <span>MODERN AESTHETIC CHESS</span>
            <span aria-hidden="true">·</span>
            <span>VIBE & STRATEGY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Cinzel',serif]">
            Kuasai Papan Catur dengan Sentuhan Keindahan Kosmik
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Permainan catur modern yang menggabungkan strategi klasik dengan latar galaksi, efek cahaya aura saat bidak digerakkan, musik instrumental piano yang menenangkan, serta tampilan 3D yang elegan.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                sound.playSelect();
                onSelectMode('ai');
              }}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              style={{
                backgroundColor: activeTheme.accentColor,
                boxShadow: `0 0 25px ${activeTheme.glowColor}55`,
              }}
            >
              <Bot className="w-4 h-4" />
              <span>Main Lawan Komputer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onSelectMode('puzzle');
              }}
              className="px-5 py-3 rounded-xl font-medium text-sm text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Puzzle className="w-4 h-4 text-purple-300" />
              <span>Teka-Teki Harian</span>
            </button>
          </div>
        </div>

        {/* Floating Ambient Theme Badge */}
        <div className="hidden lg:flex flex-col absolute right-10 top-1/2 -translate-y-1/2 p-5 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-md max-w-xs shadow-2xl">
          <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
            <span>Tema Aktif</span>
            <button
              onClick={() => onNavigateTab('themes')}
              className="text-purple-300 hover:text-white transition-colors cursor-pointer text-[11px]"
            >
              Ganti
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden h-28 w-60 border border-white/15">
            <img
              src={activeTheme.bgImage}
              alt={activeTheme.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-xs font-bold text-white tracking-wide">{activeTheme.name}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{activeTheme.tagline}</p>
        </div>
      </div>

      {/* Player Stats & Economy Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level & Rank */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peringkat Pemain</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">Level {profile.level}</span>
            <span className="text-xs text-purple-300 font-semibold">{getRankTitle(profile.level)}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            {profile.xp} / {nextLevelXp} XP
          </div>
        </div>

        {/* Aura Coins */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Koin Aura</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            {profile.coins.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Gunakan koin untuk membuka tema & efek baru
          </div>
        </div>

        {/* Rating ELO */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rating Kompetitif</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 font-mono">
            {profile.elo} <span className="text-xs font-normal text-slate-400">ELO</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {profile.stats.wins} Menang · {profile.stats.losses} Kalah · {profile.stats.draws} Seri
          </div>
        </div>

        {/* Daily Streak */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Streak Kemenangan</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300 font-mono">
            {profile.stats.streak} <span className="text-xs font-normal text-slate-400">Pertandingan</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {profile.puzzlesSolved.length} Teka-teki berhasil dipecahkan
          </div>
        </div>
      </div>

      {/* Game Modes Cards Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Pilihan Mode Permainan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Mode 1: Play vs AI */}
          <div
            onClick={() => {
              sound.playSelect();
              onSelectMode('ai');
            }}
            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-950/20 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-mono">1v1 AI</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
                Play vs AI
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tantang komputer dari level Pemula hingga Grandmaster dengan evaluasi taktik real-time.
              </p>
            </div>
            <div className="text-xs font-medium text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Mulai Bertanding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mode 2: Two Players */}
          <div
            onClick={() => {
              sound.playSelect();
              onSelectMode('pass_play');
            }}
            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-950/20 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-mono">1 Perangkat</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
                Two Players
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Bermain bersama teman secara bergantian di satu perangkat dengan opsi rotasi papan otomatis.
              </p>
            </div>
            <div className="text-xs font-medium text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Main Berdua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mode 3: Online Battle */}
          <div
            onClick={() => {
              sound.playSelect();
              onSelectMode('online');
            }}
            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/20 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Matchmaking</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-200 transition-colors">
                Online Battle
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Temukan lawan dari berbagai daerah dalam arena kompetitif dengan perhitungan rating ELO.
              </p>
            </div>
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Cari Lawan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mode 4: Puzzle Chess */}
          <div
            onClick={() => {
              sound.playSelect();
              onSelectMode('puzzle');
            }}
            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-950/20 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <Puzzle className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Taktik</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                Puzzle Chess
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Selesaikan skakmat kilat, garpu kuda, dan taktik tusukan untuk mengasah insting bertarung Anda.
              </p>
            </div>
            <div className="text-xs font-medium text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Buka Teka-teki</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mode 5: Training Mode */}
          <div
            onClick={() => {
              sound.playSelect();
              onSelectMode('training');
            }}
            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-950/20 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-pink-900/40 border border-pink-500/30 flex items-center justify-center text-pink-300 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Akademi</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-pink-200 transition-colors">
                Training Mode
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pelajari aturan dasar, kontrol petak pusat, keamanan raja rokade, dan strategi penting lainnya.
              </p>
            </div>
            <div className="text-xs font-medium text-pink-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Masuk Kelas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Themes Showcase Card */}
          <div
            onClick={() => {
              sound.playSelect();
              onNavigateTab('themes');
            }}
            className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/20 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Koleksi</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200 transition-colors">
                Tema & Desain Bidak
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pilih antara 5 tema eksklusif: Galaxy, Royal Gold, Ice Crystal, Sakura, dan Cyber Neon.
              </p>
            </div>
            <div className="text-xs font-medium text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Lihat Toko Tema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
