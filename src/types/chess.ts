export type ThemeId = 'galaxy' | 'royal_gold' | 'ice_crystal' | 'sakura' | 'cyber_neon';

export interface BoardTheme {
  id: ThemeId;
  name: string;
  tagline: string;
  lightSquare: string;
  darkSquare: string;
  highlightSelected: string;
  highlightValid: string;
  highlightCheck: string;
  highlightLastMove: string;
  glowColor: string;
  borderColor: string;
  accentColor: string;
  bgImage: string;
  particleType: 'stars' | 'gold_dust' | 'ice_sparks' | 'sakura_petals' | 'neon_grid';
  pieceLightGlow: string;
  pieceDarkGlow: string;
  cost: number;
}

export type GameMode = 'ai' | 'pass_play' | 'online' | 'puzzle' | 'training';

export type AIDifficulty = 'novice' | 'intermediate' | 'expert' | 'grandmaster';

export interface ChessPuzzle {
  id: string;
  title: string;
  theme: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  fen: string;
  solutionUci: string[]; // e.g. ['e2e4', 'e7e5'] or SAN ['Qh5#']
  playerColor: 'w' | 'b';
  objective: string;
  hint: string;
  coins: number;
  xp: number;
}

export interface TrainingLesson {
  id: string;
  title: string;
  category: 'Dasar' | 'Taktik' | 'Pembukaan' | 'Akhir Permainan';
  description: string;
  fen: string;
  playerColor: 'w' | 'b';
  task: string;
  correctMoveSan: string;
  explanation: string;
}

export interface PlayerProfile {
  name: string;
  avatarSeed: string;
  level: number;
  xp: number;
  coins: number;
  elo: number;
  activeThemeId: ThemeId;
  unlockedThemes: ThemeId[];
  is3dPerspective: boolean;
  showMoveHints: boolean;
  autoQueen: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  puzzlesSolved: string[];
  lessonsCompleted: string[];
  stats: {
    wins: number;
    losses: number;
    draws: number;
    streak: number;
  };
}

export interface OnlineMatchState {
  roomId: string;
  opponentName: string;
  opponentRating: number;
  opponentAvatar: string;
  isSearching: boolean;
  isConnected: boolean;
  pingMs: number;
}
