import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import {
  GameMode,
  AIDifficulty,
  BoardTheme,
  PlayerProfile,
  OnlineMatchState,
} from '../types/chess';
import { ChessBoard } from './ChessBoard';
import { GameHUD } from './GameHUD';
import { VictoryModal } from './VictoryModal';
import { getBestAIMove } from '../engine/chessAi';
import { CHESS_PUZZLES } from '../data/puzzles';
import { TRAINING_LESSONS } from '../data/lessons';
import { sound } from '../audio/soundSystem';
import {
  Bot,
  Users,
  Globe,
  Puzzle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  initialMode: GameMode;
  theme: BoardTheme;
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onNavigateHome: () => void;
}

export const PlayView: React.FC<Props> = ({
  initialMode,
  theme,
  profile,
  onUpdateProfile,
  onNavigateHome,
}) => {
  const [activeMode, setActiveMode] = useState<GameMode>(initialMode);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('intermediate');
  const [chess] = useState<Chess>(() => new Chess());
  const [, setTick] = useState(0); // Force rerender on chess moves

  // Timers (in seconds)
  const [whiteTimer, setWhiteTimer] = useState(300); // 5 minutes default
  const [blackTimer, setBlackTimer] = useState(300);
  const [timerActive, setTimerActive] = useState(true);

  // Board settings
  const [is3d, setIs3d] = useState(profile.is3dPerspective);
  const [flipped, setFlipped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  // Game over state
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  const [endReason, setEndReason] = useState('');
  const [rewardsGiven, setRewardsGiven] = useState(false);

  // Online matchmaking simulation state
  const [onlineState, setOnlineState] = useState<OnlineMatchState>({
    roomId: '',
    opponentName: '',
    opponentRating: 1500,
    opponentAvatar: '',
    isSearching: false,
    isConnected: false,
    pingMs: 24,
  });

  // Puzzle mode state
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzleSuccess, setPuzzleSuccess] = useState(false);
  const [puzzleHintShown, setPuzzleHintShown] = useState(false);

  // Training mode state
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonSuccess, setLessonSuccess] = useState(false);

  // Captured pieces tracking
  const [capturedWhite, setCapturedWhite] = useState<PieceSymbol[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<PieceSymbol[]>([]);

  // AI Thinking state
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Ref for timer interval
  const timerRef = useRef<number | null>(null);

  // Initialize or reset game
  const resetGame = (newFen?: string) => {
    if (newFen) {
      chess.load(newFen);
    } else {
      chess.reset();
    }
    setLastMove(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setGameOver(false);
    setWinner(null);
    setEndReason('');
    setRewardsGiven(false);
    setWhiteTimer(300);
    setBlackTimer(300);
    setTimerActive(true);
    setTick((t) => t + 1);
  };

  // Switch modes cleanly
  useEffect(() => {
    if (activeMode === 'puzzle') {
      const p = CHESS_PUZZLES[currentPuzzleIndex];
      resetGame(p.fen);
      setPuzzleSuccess(false);
      setPuzzleHintShown(false);
    } else if (activeMode === 'training') {
      const l = TRAINING_LESSONS[currentLessonIndex];
      resetGame(l.fen);
      setLessonSuccess(false);
    } else if (activeMode === 'online') {
      startOnlineMatchmaking();
    } else {
      resetGame();
    }
  }, [activeMode, currentPuzzleIndex, currentLessonIndex]);

  // Handle Online Matchmaking Simulation
  const startOnlineMatchmaking = () => {
    resetGame();
    setOnlineState({
      roomId: '',
      opponentName: '',
      opponentRating: 1500,
      opponentAvatar: '',
      isSearching: true,
      isConnected: false,
      pingMs: Math.floor(Math.random() * 20 + 20),
    });

    const opponents = [
      { name: 'Elena_Rostova', rating: 1520, country: 'Rusia' },
      { name: 'Kenji_Sato', rating: 1485, country: 'Jepang' },
      { name: 'Dimas_Pratama', rating: 1560, country: 'Indonesia' },
      { name: 'Lucas_Vance', rating: 1610, country: 'Jerman' },
    ];

    setTimeout(() => {
      const opp = opponents[Math.floor(Math.random() * opponents.length)];
      setOnlineState({
        roomId: `ROOM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        opponentName: opp.name,
        opponentRating: opp.rating,
        opponentAvatar: opp.country,
        isSearching: false,
        isConnected: true,
        pingMs: Math.floor(Math.random() * 15 + 18),
      });
      sound.playSelect();
    }, 2200);
  };

  // Game clock countdown
  useEffect(() => {
    if (gameOver || !timerActive || activeMode === 'puzzle' || activeMode === 'training') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      if (chess.turn() === 'w') {
        setWhiteTimer((t) => {
          if (t <= 1) {
            handleTimeOut('w');
            return 0;
          }
          return t - 1;
        });
      } else {
        setBlackTimer((t) => {
          if (t <= 1) {
            handleTimeOut('b');
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chess.turn(), gameOver, timerActive, activeMode]);

  const handleTimeOut = (lostSide: 'w' | 'b') => {
    setGameOver(true);
    setWinner(lostSide === 'w' ? 'b' : 'w');
    setEndReason(`Waktu habis untuk pemain ${lostSide === 'w' ? 'Putih' : 'Hitam'}`);
  };

  // Check game over condition
  const checkGameEnd = () => {
    if (chess.isCheckmate()) {
      const winningColor = chess.turn() === 'w' ? 'b' : 'w';
      setGameOver(true);
      setWinner(winningColor);
      setEndReason(
        `Skakmat! Pemain ${winningColor === 'w' ? 'Putih' : 'Hitam'} keluar sebagai pemenang.`
      );
      grantRewards(winningColor === 'w');
      return true;
    }
    if (chess.isDraw()) {
      setGameOver(true);
      setWinner('draw');
      let drawType = 'Remis';
      if (chess.isStalemate()) drawType = 'Remis karena Stalemate (Paten)';
      else if (chess.isThreefoldRepetition()) drawType = 'Remis karena Pengulangan Tiga Kali';
      else if (chess.isInsufficientMaterial()) drawType = 'Remis karena Materi Tidak Cukup';
      setEndReason(drawType);
      grantRewards(false);
      return true;
    }
    return false;
  };

  // Grant rewards to player profile
  const grantRewards = (playerWon: boolean) => {
    if (rewardsGiven) return;
    setRewardsGiven(true);

    const coinsToAdd = playerWon ? (activeMode === 'online' ? 80 : 50) : 10;
    const xpToAdd = playerWon ? (activeMode === 'online' ? 100 : 70) : 20;

    onUpdateProfile((prev) => {
      const newXp = prev.xp + xpToAdd;
      const nextLvlXp = prev.level * 100;
      const levelUp = newXp >= nextLvlXp;
      const newLevel = levelUp ? prev.level + 1 : prev.level;
      const remainingXp = levelUp ? newXp - nextLvlXp : newXp;

      return {
        ...prev,
        coins: prev.coins + coinsToAdd,
        xp: remainingXp,
        level: newLevel,
        elo: playerWon ? prev.elo + 16 : Math.max(100, prev.elo - 12),
        stats: {
          ...prev.stats,
          wins: playerWon ? prev.stats.wins + 1 : prev.stats.wins,
          losses: !playerWon && winner !== 'draw' ? prev.stats.losses + 1 : prev.stats.losses,
          draws: winner === 'draw' ? prev.stats.draws + 1 : prev.stats.draws,
          streak: playerWon ? prev.stats.streak + 1 : 0,
        },
      };
    });
  };

  // Execute Move
  const handleMove = (from: Square, to: Square, promotionPiece?: string): boolean => {
    try {
      const pieceOnTarget = chess.get(to);
      const move = chess.move({
        from,
        to,
        promotion: promotionPiece || (profile.autoQueen ? 'q' : undefined),
      });

      if (!move) return false;

      // Track captured pieces
      if (pieceOnTarget) {
        sound.playCapture();
        if (pieceOnTarget.color === 'w') {
          setCapturedWhite((prev) => [...prev, pieceOnTarget.type]);
        } else {
          setCapturedBlack((prev) => [...prev, pieceOnTarget.type]);
        }
      } else {
        sound.playMove();
      }

      setLastMove({ from, to });
      setTick((t) => t + 1);

      // Check audio alert for check
      if (chess.isCheck()) {
        sound.playCheck();
      }

      // Special mode checks:
      if (activeMode === 'puzzle') {
        const puzzle = CHESS_PUZZLES[currentPuzzleIndex];
        const uciMove = `${from}${to}`;
        if (puzzle.solutionUci.includes(uciMove) || chess.isCheckmate()) {
          setPuzzleSuccess(true);
          sound.playVictory();
          onUpdateProfile((prev) => ({
            ...prev,
            coins: prev.coins + puzzle.coins,
            xp: prev.xp + puzzle.xp,
            puzzlesSolved: prev.puzzlesSolved.includes(puzzle.id)
              ? prev.puzzlesSolved
              : [...prev.puzzlesSolved, puzzle.id],
          }));
        }
        return true;
      }

      if (activeMode === 'training') {
        const lesson = TRAINING_LESSONS[currentLessonIndex];
        if (move.san === lesson.correctMoveSan || move.san.startsWith(lesson.correctMoveSan)) {
          setLessonSuccess(true);
          sound.playVictory();
          onUpdateProfile((prev) => ({
            ...prev,
            coins: prev.coins + 30,
            xp: prev.xp + 40,
            lessonsCompleted: prev.lessonsCompleted.includes(lesson.id)
              ? prev.lessonsCompleted
              : [...prev.lessonsCompleted, lesson.id],
          }));
        }
        return true;
      }

      const ended = checkGameEnd();

      // Trigger AI turn if game is still running
      if (!ended && (activeMode === 'ai' || activeMode === 'online') && chess.turn() === 'b') {
        setIsAiThinking(true);
        const delay = activeMode === 'online' ? Math.random() * 800 + 800 : Math.random() * 500 + 400;

        setTimeout(() => {
          const aiMove = getBestAIMove(chess, activeMode === 'online' ? 'expert' : aiDifficulty);
          if (aiMove) {
            const captured = chess.get(aiMove.to as Square);
            chess.move(aiMove);
            if (captured) {
              sound.playCapture();
              setCapturedWhite((prev) => [...prev, captured.type]);
            } else {
              sound.playMove();
            }
            if (chess.isCheck()) {
              sound.playCheck();
            }
            setLastMove({ from: aiMove.from as Square, to: aiMove.to as Square });
            setTick((t) => t + 1);
            checkGameEnd();
          }
          setIsAiThinking(false);
        }, delay);
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleUndo = () => {
    if (activeMode === 'puzzle' || activeMode === 'training') {
      if (activeMode === 'puzzle') {
        resetGame(CHESS_PUZZLES[currentPuzzleIndex].fen);
        setPuzzleSuccess(false);
      } else {
        resetGame(TRAINING_LESSONS[currentLessonIndex].fen);
        setLessonSuccess(false);
      }
      return;
    }

    if (activeMode === 'ai') {
      chess.undo(); // undo AI move
      chess.undo(); // undo player move
    } else {
      chess.undo();
    }
    setLastMove(null);
    setTick((t) => t + 1);
    sound.playSelect();
  };

  const handleResign = () => {
    setGameOver(true);
    setWinner('b');
    setEndReason('Anda menyerahkan pertandingan.');
    grantRewards(false);
  };

  const handleHint = () => {
    sound.playSelect();
    if (activeMode === 'puzzle') {
      setPuzzleHintShown(true);
      return;
    }
    const bestMove = getBestAIMove(chess, 'expert');
    if (bestMove) {
      setLastMove({ from: bestMove.from as Square, to: bestMove.to as Square });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center gap-6 relative z-10">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onNavigateHome}
          className="text-xs sm:text-sm text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Mode Selector Dropdown / Segmented Bar */}
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => {
              sound.playSelect();
              setActiveMode('ai');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'ai'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs AI</span>
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setActiveMode('pass_play');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'pass_play'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Dua Pemain</span>
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setActiveMode('online');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'online'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Online</span>
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setActiveMode('puzzle');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'puzzle'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Puzzle</span>
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setActiveMode('training');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'training'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pelatihan</span>
          </button>
        </div>
      </div>

      {/* Online Matchmaking Overlay Bar if searching */}
      {activeMode === 'online' && onlineState.isSearching && (
        <div className="w-full max-w-lg p-6 rounded-2xl bg-purple-950/70 border border-purple-500/40 backdrop-blur-md flex flex-col items-center gap-3 text-center animate-pulse">
          <div className="w-10 h-10 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
          <h4 className="text-base font-bold text-white">Mencari Lawan Online...</h4>
          <p className="text-xs text-slate-300">
            Mencocokkan dengan pemain terdekat berdasarkan rating ELO Anda ({profile.elo})
          </p>
        </div>
      )}

      {/* Mode Sub-Bars */}
      {activeMode === 'ai' && (
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400">Tingkat Kesulitan:</span>
          {(['novice', 'intermediate', 'expert', 'grandmaster'] as AIDifficulty[]).map((lvl) => {
            const labels = {
              novice: 'Pemula',
              intermediate: 'Menengah',
              expert: 'Pakar',
              grandmaster: 'Grandmaster',
            };
            return (
              <button
                key={lvl}
                onClick={() => {
                  sound.playSelect();
                  setAiDifficulty(lvl);
                  resetGame();
                }}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  aiDifficulty === lvl
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                {labels[lvl]}
              </button>
            );
          })}
        </div>
      )}

      {/* Puzzle Banner */}
      {activeMode === 'puzzle' && (
        <div className="w-full max-w-xl p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {CHESS_PUZZLES[currentPuzzleIndex].title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                {CHESS_PUZZLES[currentPuzzleIndex].difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {CHESS_PUZZLES[currentPuzzleIndex].objective}
            </p>
            {puzzleHintShown && (
              <p className="text-xs text-amber-300 mt-1 italic">
                Petunjuk: {CHESS_PUZZLES[currentPuzzleIndex].hint}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playSelect();
                setPuzzleHintShown(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Petunjuk</span>
            </button>
            <button
              onClick={() => {
                sound.playSelect();
                setCurrentPuzzleIndex((idx) => (idx + 1) % CHESS_PUZZLES.length);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-1 transition-colors"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Training Academy Banner */}
      {activeMode === 'training' && (
        <div className="w-full max-w-xl p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              {TRAINING_LESSONS[currentLessonIndex].title}
            </span>
            <span className="text-xs text-purple-300">
              Pelajaran {currentLessonIndex + 1} dari {TRAINING_LESSONS.length}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {TRAINING_LESSONS[currentLessonIndex].task}
          </p>
          {lessonSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
              <span>Hebat! {TRAINING_LESSONS[currentLessonIndex].explanation}</span>
              <button
                onClick={() => {
                  sound.playSelect();
                  setCurrentLessonIndex((idx) => (idx + 1) % TRAINING_LESSONS.length);
                }}
                className="px-3 py-1 rounded bg-emerald-600 text-white font-semibold text-xs ml-2 hover:bg-emerald-500 transition-colors"
              >
                Pelajaran Berikutnya
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Game Arena (HUD + Board) */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Opponent & Self HUD */}
        <GameHUD
          mode={activeMode}
          aiDifficulty={aiDifficulty}
          whiteTimer={whiteTimer}
          blackTimer={blackTimer}
          currentTurn={chess.turn()}
          inCheck={chess.isCheck()}
          theme={theme}
          is3d={is3d}
          flipped={flipped}
          soundEnabled={soundEnabled}
          capturedWhite={capturedWhite}
          capturedBlack={capturedBlack}
          onToggle3d={() => {
            sound.playSelect();
            setIs3d((v) => !v);
          }}
          onToggleFlip={() => {
            sound.playSelect();
            setFlipped((v) => !v);
          }}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sound.setSfxEnabled(next);
            sound.setMusicEnabled(next);
          }}
          onUndo={handleUndo}
          onResign={handleResign}
          onNewGame={() => resetGame()}
          onGetHint={handleHint}
          opponentName={onlineState.opponentName}
          opponentRating={onlineState.opponentRating}
        />

        {/* AI Thinking Indicator */}
        {isAiThinking && (
          <div className="text-xs text-purple-300 font-mono flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>AI sedang menghitung langkah terbaik...</span>
          </div>
        )}

        {/* Chess Board */}
        <ChessBoard
          chess={chess}
          theme={theme}
          is3d={is3d}
          flipped={flipped}
          showHints={profile.showMoveHints}
          interactive={!gameOver && !isAiThinking && !onlineState.isSearching}
          onMove={handleMove}
          lastMove={lastMove}
        />
      </div>

      {/* Game History PGN Move Log Strip */}
      <div className="w-full max-w-xl p-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm flex items-center gap-3 overflow-x-auto text-xs font-mono text-slate-400">
        <span className="text-purple-300 font-semibold shrink-0">Langkah:</span>
        {chess.history().length === 0 ? (
          <span className="italic opacity-60">Belum ada langkah</span>
        ) : (
          chess.history().map((m, idx) => (
            <span
              key={idx}
              className={`shrink-0 ${idx % 2 === 0 ? 'text-slate-200' : 'text-purple-300'}`}
            >
              {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
              {m}
            </span>
          ))
        )}
      </div>

      {/* Victory / Game Over Modal */}
      {gameOver && (
        <VictoryModal
          winner={winner}
          reason={endReason}
          theme={theme}
          earnedCoins={winner === 'w' ? 50 : 10}
          earnedXp={winner === 'w' ? 70 : 20}
          currentLevel={profile.level}
          playerWon={winner === 'w'}
          onPlayAgain={() => resetGame()}
          onBackToMenu={onNavigateHome}
        />
      )}
    </div>
  );
};
