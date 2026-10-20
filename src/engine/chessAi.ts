import { Chess, Move } from 'chess.js';
import { AIDifficulty } from '../types/chess';

// Piece baseline values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Positional piece-square tables for strategic play
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const KING_TABLE_MID = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

function getSquareIndex(square: string): number {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = 8 - parseInt(square[1], 10); // 8=0, 1=7
  return rank * 8 + file;
}

function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    // If black is checkmated, white gets huge positive score
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let totalScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      let positionalBonus = 0;
      const squareIdx = piece.color === 'w' ? r * 8 + f : (7 - r) * 8 + f;

      if (piece.type === 'p') {
        positionalBonus = PAWN_TABLE[squareIdx];
      } else if (piece.type === 'n') {
        positionalBonus = KNIGHT_TABLE[squareIdx];
      } else if (piece.type === 'b') {
        positionalBonus = BISHOP_TABLE[squareIdx];
      } else if (piece.type === 'r') {
        positionalBonus = ROOK_TABLE[squareIdx];
      } else if (piece.type === 'k') {
        positionalBonus = KING_TABLE_MID[squareIdx];
      }

      const val = baseVal + positionalBonus;
      if (piece.color === 'w') {
        totalScore += val;
      } else {
        totalScore -= val;
      }
    }
  }

  return totalScore;
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestAIMove(chess: Chess, difficulty: AIDifficulty): Move | null {
  const possibleMoves = chess.moves({ verbose: true });
  if (possibleMoves.length === 0) return null;

  const isWhite = chess.turn() === 'w';

  // 1. Novice Level: Mostly random with basic capture preference
  if (difficulty === 'novice') {
    if (Math.random() < 0.4) {
      // 40% random move
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    // Filter captures
    const captures = possibleMoves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.6) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  // 2. Intermediate Level: 1-ply to 2-ply with occasional slight blunder (human-like)
  if (difficulty === 'intermediate') {
    const depth = 2;
    let bestMoves: Move[] = [];
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of possibleMoves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
      chess.undo();

      if (isWhite) {
        if (score > bestScore) {
          bestScore = score;
          bestMoves = [move];
        } else if (score === bestScore) {
          bestMoves.push(move);
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMoves = [move];
        } else if (score === bestScore) {
          bestMoves.push(move);
        }
      }
    }

    // 15% chance to pick second best to simulate club player
    if (bestMoves.length > 1 && Math.random() < 0.15) {
      return bestMoves[1];
    }
    return bestMoves[0] || possibleMoves[0];
  }

  // 3. Expert & Grandmaster: 3-ply Minimax with Alpha-Beta Pruning
  const depth = difficulty === 'grandmaster' ? 3 : 2;
  let bestMove: Move | null = null;
  let bestValue = isWhite ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  // Prioritize moves: checks and captures first for alpha-beta pruning efficiency
  const sortedMoves = [...possibleMoves].sort((a, b) => {
    const aScore = (a.captured ? 10 : 0) + (a.san.includes('+') ? 5 : 0);
    const bScore = (b.captured ? 10 : 0) + (b.san.includes('+') ? 5 : 0);
    return bScore - aScore;
  });

  for (const move of sortedMoves) {
    chess.move(move);
    const moveValue = minimax(chess, depth - 1, alpha, beta, !isWhite);
    chess.undo();

    if (isWhite) {
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, moveValue);
    } else {
      if (moveValue < bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
      beta = Math.min(beta, moveValue);
    }
    if (beta <= alpha) break;
  }

  return bestMove || possibleMoves[0];
}
