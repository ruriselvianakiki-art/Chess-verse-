/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile, GameMode, ThemeId } from './types/chess';
import { THEMES } from './data/themes';
import { CosmicBackground } from './components/CosmicBackground';
import { Navigation, ActiveTab } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { PlayView } from './components/PlayView';
import { ThemesView } from './components/ThemesView';
import { LeaderboardView } from './components/LeaderboardView';
import { SettingsView } from './components/SettingsView';
import { sound } from './audio/soundSystem';
import { Home, Play, Palette, Trophy, Settings } from 'lucide-react';

const STORAGE_KEY = 'chess_aura_profile_v2';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Grandmaster Aura',
  avatarSeed: 'aura_1',
  level: 12,
  xp: 340,
  coins: 450,
  elo: 1520,
  activeThemeId: 'galaxy',
  unlockedThemes: ['galaxy', 'royal_gold'],
  is3dPerspective: true,
  showMoveHints: true,
  autoQueen: false,
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.55,
  musicVolume: 0.35,
  puzzlesSolved: ['puzzle_1'],
  lessonsCompleted: ['lesson_1'],
  stats: {
    wins: 18,
    losses: 7,
    draws: 3,
    streak: 4,
  },
};

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPlayMode, setSelectedPlayMode] = useState<GameMode>('ai');

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Sync sound system settings
  useEffect(() => {
    sound.setSfxEnabled(profile.soundEnabled);
    sound.setMusicEnabled(profile.musicEnabled);
    sound.setSfxVolume(profile.soundVolume);
    sound.setMusicVolume(profile.musicVolume);
  }, []);

  // Browser Audio Autoplay activation on first interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      if (profile.musicEnabled) {
        sound.startAmbientMusic();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [profile.musicEnabled]);

  const activeTheme = THEMES[profile.activeThemeId] || THEMES.galaxy;

  const handleStartMode = (mode: GameMode) => {
    setSelectedPlayMode(mode);
    setActiveTab('play');
  };

  const handleToggleSound = () => {
    const next = !profile.soundEnabled;
    sound.setSfxEnabled(next);
    sound.setMusicEnabled(next);
    setProfile((prev) => ({
      ...prev,
      soundEnabled: next,
      musicEnabled: next,
    }));
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans relative flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background with Cosmic Atmosphere & Particles */}
      <CosmicBackground theme={activeTheme} />

      {/* Main App Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profile={profile}
          onToggleSound={handleToggleSound}
          soundEnabled={profile.soundEnabled}
        />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col pb-20 md:pb-8">
          {activeTab === 'home' && (
            <HomeView
              profile={profile}
              activeTheme={activeTheme}
              onSelectMode={handleStartMode}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'play' && (
            <PlayView
              initialMode={selectedPlayMode}
              theme={activeTheme}
              profile={profile}
              onUpdateProfile={setProfile}
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'themes' && (
            <ThemesView
              profile={profile}
              onUpdateProfile={setProfile}
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              profile={profile}
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={setProfile}
              onNavigateHome={() => setActiveTab('home')}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070510]/95 backdrop-blur-lg border-t border-white/10 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('home');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('play');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'play' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Play className="w-5 h-5" />
          <span>Play</span>
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('themes');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'themes' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span>Themes</span>
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('leaderboard');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'leaderboard' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Ranks</span>
        </button>
        <button
          onClick={() => {
            sound.playSelect();
            setActiveTab('settings');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Setting</span>
        </button>
      </nav>
    </div>
  );
}
