import React, { useState } from 'react';
import { PlayerProfile } from '../types/chess';
import { sound } from '../audio/soundSystem';
import {
  Volume2,
  VolumeX,
  Music,
  Eye,
  Sliders,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onNavigateHome: () => void;
}

export const SettingsView: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onNavigateHome,
}) => {
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleToggleSound = (enabled: boolean) => {
    sound.setSfxEnabled(enabled);
    onUpdateProfile((prev) => ({ ...prev, soundEnabled: enabled }));
    if (enabled) sound.playMove();
  };

  const handleToggleMusic = (enabled: boolean) => {
    sound.setMusicEnabled(enabled);
    onUpdateProfile((prev) => ({ ...prev, musicEnabled: enabled }));
  };

  const handleSfxVolume = (val: number) => {
    sound.setSfxVolume(val);
    onUpdateProfile((prev) => ({ ...prev, soundVolume: val }));
    sound.playMove();
  };

  const handleMusicVolume = (val: number) => {
    sound.setMusicVolume(val);
    onUpdateProfile((prev) => ({ ...prev, musicVolume: val }));
  };

  const handleResetData = () => {
    onUpdateProfile((prev) => ({
      ...prev,
      level: 1,
      xp: 0,
      coins: 200,
      elo: 1200,
      puzzlesSolved: [],
      lessonsCompleted: [],
      stats: { wins: 0, losses: 0, draws: 0, streak: 0 },
    }));
    setResetConfirm(false);
    sound.playSelect();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8 relative z-10">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <button
          onClick={onNavigateHome}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Cinzel',serif]">
          Pengaturan Permainan
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Sesuaikan musik instrumental, efek suara, perspektif visual, dan preferensi permainan.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Audio Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-400" />
            <span>Musik & Suara</span>
          </h2>

          {/* Background Ambient Music */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-white">Musik Latar Instrumental</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Alunan akord piano aesthetic yang menenangkan selama berada di aplikasi dan pertandingan.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={!profile.musicEnabled}
                value={profile.musicVolume}
                onChange={(e) => handleMusicVolume(parseFloat(e.target.value))}
                className="w-24 accent-purple-500 cursor-pointer disabled:opacity-40"
              />
              <button
                onClick={() => handleToggleMusic(!profile.musicEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  profile.musicEnabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    profile.musicEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sound Effects SFX */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Efek Suara Bidak (SFX)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Suara klik sentuhan lembut, dentuman pemakanan bidak, dan peringatan skak.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={!profile.soundEnabled}
                value={profile.soundVolume}
                onChange={(e) => handleSfxVolume(parseFloat(e.target.value))}
                className="w-24 accent-purple-500 cursor-pointer disabled:opacity-40"
              />
              <button
                onClick={() => handleToggleSound(!profile.soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  profile.soundEnabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    profile.soundEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Visual & Gameplay Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span>Tampilan & Panduan Bermain</span>
          </h2>

          {/* 3D Perspective Default */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-white">Mode Sudut Pandang 3D</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aktifkan kemiringan 3D isometrik dengan kedalaman perspektif yang elegan.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playSelect();
                onUpdateProfile((prev) => ({
                  ...prev,
                  is3dPerspective: !prev.is3dPerspective,
                }));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.is3dPerspective ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  profile.is3dPerspective ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Magic Move Glow Highlights */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-white">Efek Cahaya Langkah Sah (Magic Move)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Menampilkan titik aura bercahaya pada petak yang sah saat bidak disentuh.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playSelect();
                onUpdateProfile((prev) => ({
                  ...prev,
                  showMoveHints: !prev.showMoveHints,
                }));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.showMoveHints ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  profile.showMoveHints ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Auto Queen Promotion */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Promosi Otomatis ke Menteri</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Otomatis mengubah pion menjadi Menteri saat mencapai baris terakhir tanpa dialog pop-up.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playSelect();
                onUpdateProfile((prev) => ({
                  ...prev,
                  autoQueen: !prev.autoQueen,
                }));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.autoQueen ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  profile.autoQueen ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset & Account Data */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rose-400" />
            <span>Manajemen Data</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Reset Statistik & Progres</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mengembalikan level, perolehan koin, dan riwayat kemenangan ke kondisi awal.
              </p>
            </div>
            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-white/10 hover:bg-white/15"
                >
                  Batal
                </button>
                <button
                  onClick={handleResetData}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/50 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            )}
          </div>
        </div>

        {/* About Applet Info */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm text-xs text-slate-400 flex items-center gap-3">
          <Info className="w-5 h-5 text-purple-400 shrink-0" />
          <span>
            Chess Aura v2.4 · Dibuat dengan cinta untuk para penggemar strategi catur klasik dan estetika visual modern.
          </span>
        </div>
      </div>
    </div>
  );
};
