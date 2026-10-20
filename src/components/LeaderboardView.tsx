import React, { useState } from 'react';
import { PlayerProfile } from '../types/chess';
import { Trophy, Medal, Crown, ArrowLeft, Shield, Flame } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface LeaderboardUser {
  rank: number;
  name: string;
  country: string;
  flag: string;
  elo: number;
  level: number;
  winRate: number;
  streak: number;
  league: 'Master' | 'Expert' | 'Intermediate' | 'Beginner';
}

interface Props {
  profile: PlayerProfile;
  onNavigateHome: () => void;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Magnus_V',
    country: 'Norwegia',
    flag: '🇳🇴',
    elo: 2840,
    level: 72,
    winRate: 88,
    streak: 18,
    league: 'Master',
  },
  {
    rank: 2,
    name: 'Hikaru_N',
    country: 'Amerika Serikat',
    flag: '🇺🇸',
    elo: 2815,
    level: 68,
    winRate: 85,
    streak: 12,
    league: 'Master',
  },
  {
    rank: 3,
    name: 'Gukesh_D',
    country: 'India',
    flag: '🇮🇳',
    elo: 2795,
    level: 65,
    winRate: 83,
    streak: 9,
    league: 'Master',
  },
  {
    rank: 4,
    name: 'Pratama_Grandmaster',
    country: 'Indonesia',
    flag: '🇮🇩',
    elo: 2620,
    level: 54,
    winRate: 78,
    streak: 7,
    league: 'Master',
  },
  {
    rank: 5,
    name: 'Elena_Valkyrie',
    country: 'Rusia',
    flag: '🇷🇺',
    elo: 2430,
    level: 46,
    winRate: 74,
    streak: 6,
    league: 'Expert',
  },
  {
    rank: 6,
    name: 'Kenji_Tactics',
    country: 'Jepang',
    flag: '🇯🇵',
    elo: 2280,
    level: 38,
    winRate: 71,
    streak: 4,
    league: 'Expert',
  },
  {
    rank: 7,
    name: 'Sophie_Blossom',
    country: 'Prancis',
    flag: '🇫🇷',
    elo: 2150,
    level: 32,
    winRate: 68,
    streak: 5,
    league: 'Expert',
  },
  {
    rank: 8,
    name: 'Ahmad_Bintang',
    country: 'Indonesia',
    flag: '🇮🇩',
    elo: 1820,
    level: 22,
    winRate: 64,
    streak: 3,
    league: 'Intermediate',
  },
  {
    rank: 9,
    name: 'Lucas_Strike',
    country: 'Jerman',
    flag: '🇩🇪',
    elo: 1680,
    level: 18,
    winRate: 59,
    streak: 2,
    league: 'Intermediate',
  },
  {
    rank: 10,
    name: 'Rian_Aura',
    country: 'Indonesia',
    flag: '🇮🇩',
    elo: 1540,
    level: 14,
    winRate: 55,
    streak: 3,
    league: 'Intermediate',
  },
];

export const LeaderboardView: React.FC<Props> = ({ profile, onNavigateHome }) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('all');

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="font-mono text-xs font-bold text-slate-400">#{rank}</span>;
  };

  const filteredData =
    selectedLeague === 'all'
      ? LEADERBOARD_DATA
      : LEADERBOARD_DATA.filter((item) => item.league.toLowerCase() === selectedLeague.toLowerCase());

  const userLeague =
    profile.level <= 10
      ? 'Beginner'
      : profile.level <= 25
      ? 'Intermediate'
      : profile.level <= 50
      ? 'Expert'
      : 'Master';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 relative z-10">
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
            Peringkat Global Pemain
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Daftar master catur teratas di dunia Chess Aura berdasarkan performa rating ELO.
          </p>
        </div>

        {/* Filter leagues */}
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto self-start sm:self-auto">
          {['all', 'Master', 'Expert', 'Intermediate'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playSelect();
                setSelectedLeague(tab);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedLeague === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'Semua Liga' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* User Standing Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900/60 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-900/50 border border-purple-400/50 flex items-center justify-center text-purple-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Posisi Anda di Papan Peringkat</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 font-semibold">
                {userLeague} League
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Level {profile.level} · Rating {profile.elo} ELO · {profile.stats.wins} Menang
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Peringkat</div>
            <div className="text-lg font-bold text-purple-300 font-mono">#184</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Win Streak</div>
            <div className="text-lg font-bold text-rose-400 font-mono flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />
              <span>{profile.stats.streak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-slate-400 text-xs uppercase font-mono tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Pemain</th>
                <th className="py-3.5 px-4 text-center">Liga</th>
                <th className="py-3.5 px-4 text-right">Rating ELO</th>
                <th className="py-3.5 px-4 text-right">Win Rate</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredData.map((user) => (
                <tr
                  key={user.rank}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {getRankBadge(user.rank)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 font-sans">
                      <span className="text-lg">{user.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {user.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Level {user.level} · {user.country}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-sans">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        user.league === 'Master'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : user.league === 'Expert'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {user.league}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-white tabular-nums">
                    {user.elo}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 tabular-nums">
                    {user.winRate}%
                  </td>
                  <td className="py-3.5 px-4 text-center text-rose-400 tabular-nums">
                    {user.streak}W
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
