import React, { useState } from 'react';
import { PlayerProfile, ThemeId } from '../types/chess';
import { THEMES } from '../data/themes';
import { Coins, Check, Sparkles, Lock, ArrowLeft } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onNavigateHome: () => void;
}

export const ThemesView: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onNavigateHome,
}) => {
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  const handleSelectTheme = (themeId: ThemeId) => {
    sound.playSelect();
    const isUnlocked = profile.unlockedThemes.includes(themeId);
    const theme = THEMES[themeId];

    if (isUnlocked) {
      onUpdateProfile((prev) => ({
        ...prev,
        activeThemeId: themeId,
      }));
      setPurchaseNotice(`Tema ${theme.name} berhasil dipasang!`);
      setTimeout(() => setPurchaseNotice(null), 3000);
      return;
    }

    // Purchase logic
    if (profile.coins >= theme.cost) {
      sound.playVictory();
      onUpdateProfile((prev) => ({
        ...prev,
        coins: prev.coins - theme.cost,
        unlockedThemes: [...prev.unlockedThemes, themeId],
        activeThemeId: themeId,
      }));
      setPurchaseNotice(`Selamat! Anda telah membuka tema ${theme.name}!`);
      setTimeout(() => setPurchaseNotice(null), 3000);
    } else {
      setPurchaseNotice(`Koin tidak mencukupi! Butuh ${theme.cost} koin.`);
      setTimeout(() => setPurchaseNotice(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
            Koleksi Tema & Efek Aura
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Ubah nuansa papan, efek pencahayaan, dan partikel latar sesuai selera estetika Anda.
          </p>
        </div>

        {/* Coin Balance Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 backdrop-blur-md self-start sm:self-auto">
          <Coins className="w-5 h-5 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-300/80 uppercase font-mono">Saldo Koin</span>
            <span className="text-base font-bold text-amber-300 font-mono">
              {profile.coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Notice Message */}
      {purchaseNotice && (
        <div className="p-3 rounded-xl bg-purple-900/60 border border-purple-400/40 text-purple-200 text-sm text-center animate-fade-in">
          {purchaseNotice}
        </div>
      )}

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(THEMES).map((theme) => {
          const isOwned = profile.unlockedThemes.includes(theme.id);
          const isActive = profile.activeThemeId === theme.id;
          const canAfford = profile.coins >= theme.cost;

          return (
            <div
              key={theme.id}
              className={`rounded-2xl border overflow-hidden backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'border-purple-400/80 shadow-[0_0_30px_rgba(168,85,247,0.35)] bg-purple-950/20'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              {/* Theme Backdrop Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={theme.bgImage}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500 text-white shadow-lg flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                  {!isOwned && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono">
                      <Coins className="w-3 h-3" />
                      {theme.cost}
                    </span>
                  )}
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold text-white tracking-wide">{theme.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{theme.tagline}</p>
                </div>
              </div>

              {/* Theme Details & Palettes */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Palet Papan:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-md border border-white/20"
                      style={{ backgroundColor: theme.lightSquare }}
                      title="Petak Terang"
                    />
                    <span
                      className="w-5 h-5 rounded-md border border-white/20"
                      style={{ backgroundColor: theme.darkSquare }}
                      title="Petak Gelap"
                    />
                    <span
                      className="w-5 h-5 rounded-md border border-white/20"
                      style={{ backgroundColor: theme.accentColor }}
                      title="Aksen Cahaya"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Partikel Latar:</span>
                  <span className="text-slate-200 capitalize font-medium">
                    {theme.particleType.replace('_', ' ')}
                  </span>
                </div>

                {/* Action Button */}
                {isActive ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-900/30 border border-purple-500/30 flex items-center justify-center gap-1.5 opacity-90 cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    <span>Sedang Digunakan</span>
                  </button>
                ) : isOwned ? (
                  <button
                    onClick={() => handleSelectTheme(theme.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Pasang Tema Ini</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectTheme(theme.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      canAfford
                        ? 'text-white bg-amber-600 hover:bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'text-slate-400 bg-white/5 border border-white/10 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Buka Tema ({theme.cost} Koin)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Koin Kurang ({theme.cost} Koin)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
