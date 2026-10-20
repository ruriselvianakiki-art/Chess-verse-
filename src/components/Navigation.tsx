import React from 'react';
import { PlayerProfile } from '../types/chess';
import { Sparkles, Coins, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../audio/soundSystem';

export type ActiveTab = 'home' | 'play' | 'themes' | 'leaderboard' | 'settings';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  profile: PlayerProfile;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  onTabChange,
  profile,
  onToggleSound,
  soundEnabled,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-white/10 bg-[#070510]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => {
          sound.playSelect();
          onTabChange('home');
        }}
        className="text-lg font-bold tracking-wider text-white whitespace-nowrap shrink-0 flex items-center gap-2 group cursor-pointer focus:outline-none"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
        <span className="font-['Cinzel',serif] tracking-widest bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent">
          CHESS AURA
        </span>
      </button>

      {/* Zone 2: 5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => {
            sound.playSelect();
            onTabChange('home');
          }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'home' ? 'text-purple-300 font-semibold border-b-2 border-purple-400 pb-0.5' : ''
          }`}
        >
          Home
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            onTabChange('play');
          }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'play' ? 'text-purple-300 font-semibold border-b-2 border-purple-400 pb-0.5' : ''
          }`}
        >
          Play
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            onTabChange('themes');
          }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'themes' ? 'text-purple-300 font-semibold border-b-2 border-purple-400 pb-0.5' : ''
          }`}
        >
          Themes
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            onTabChange('leaderboard');
          }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'leaderboard' ? 'text-purple-300 font-semibold border-b-2 border-purple-400 pb-0.5' : ''
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            onTabChange('settings');
          }}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'settings' ? 'text-purple-300 font-semibold border-b-2 border-purple-400 pb-0.5' : ''
          }`}
        >
          Settings
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            sound.playSelect();
            onTabChange('play');
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          Main Sekarang
        </button>
      </div>
    </header>
  );
};
