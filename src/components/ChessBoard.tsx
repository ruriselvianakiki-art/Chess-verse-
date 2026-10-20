import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square, PieceSymbol, Move } from 'chess.js';
import { BoardTheme } from '../types/chess';
import { ChessPieceSvg } from './ChessPieceSvg';
import { CaptureBurst } from './CaptureBurst';
import { sound } from '../audio/soundSystem';

interface Props {
  chess: Chess;
  theme: BoardTheme;
  is3d: boolean;
  flipped: boolean;
  showHints: boolean;
  interactive: boolean;
  onMove: (from: Square, to: Square, promotion?: string) => boolean;
  lastMove: { from: Square; to: Square } | null;
}

interface BurstEvent {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const ChessBoard: React.FC<Props> = ({
  chess,
  theme,
  is3d,
  flipped,
  showHints,
  interactive,
  onMove,
  lastMove,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [bursts, setBursts] = useState<BurstEvent[]>([]);
  const boardRef = useRef<HTMLDivElement | null>(null);

  // Files & Ranks based on orientation
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = flipped ? [...files].reverse() : files;
  const displayRanks = flipped ? [...ranks].reverse() : ranks;

  // Find checked king square
  const inCheck = chess.isCheck();
  let checkedKingSquare: Square | null = null;
  if (inCheck) {
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === turn) {
          checkedKingSquare = `${files[f]}${8 - r}` as Square;
          break;
        }
      }
      if (checkedKingSquare) break;
    }
  }

  // Clear selections when turn or fen changes externally
  useEffect(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, [chess.fen()]);

  const handleSquareClick = (square: Square, event: React.MouseEvent) => {
    if (!interactive) return;

    // If waiting for promotion selection, ignore square clicks
    if (pendingPromotion) return;

    // Check if clicked square is a destination of valid move
    if (selectedSquare) {
      const matchedMove = validMoves.find((m) => m.to === square);
      if (matchedMove) {
        // Check for pawn promotion
        const movingPiece = chess.get(selectedSquare);
        const isPromotion =
          movingPiece?.type === 'p' &&
          ((movingPiece.color === 'w' && square[1] === '8') ||
            (movingPiece.color === 'b' && square[1] === '1'));

        if (isPromotion) {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }

        // Trigger capture burst if target has piece
        const targetPiece = chess.get(square);
        if (targetPiece && boardRef.current) {
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          const parentRect = boardRef.current.getBoundingClientRect();
          setBursts((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              x: rect.left - parentRect.left + rect.width / 2,
              y: rect.top - parentRect.top + rect.height / 2,
              color: theme.accentColor,
            },
          ]);
        }

        const success = onMove(selectedSquare, square);
        if (success) {
          setSelectedSquare(null);
          setValidMoves([]);
          return;
        }
      }
    }

    // Select piece
    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      sound.playSelect();
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setValidMoves(moves);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const executePromotion = (pieceType: PieceSymbol) => {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    onMove(from, to, pieceType);
    setPendingPromotion(null);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 3D Perspective Board Container */}
      <div
        ref={boardRef}
        className={`relative transition-all duration-500 ease-out p-3 md:p-4 rounded-2xl shadow-2xl backdrop-blur-md ${
          is3d ? 'perspective-[1100px]' : ''
        }`}
        style={{
          background: `radial-gradient(circle at 50% 30%, ${theme.darkSquare} 0%, rgba(7, 5, 16, 0.95) 100%)`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 35px ${theme.glowColor}25, inset 0 0 2px ${theme.borderColor}`,
          border: `1px solid ${theme.borderColor}55`,
        }}
      >
        {/* Render Capture Particle Bursts */}
        {bursts.map((b) => (
          <CaptureBurst
            key={b.id}
            x={b.x}
            y={b.y}
            color={b.color}
            onDone={() => setBursts((prev) => prev.filter((p) => p.id !== b.id))}
          />
        ))}

        {/* The 8x8 Grid */}
        <div
          className={`grid grid-cols-8 grid-rows-8 w-[min(88vw,480px)] h-[min(88vw,480px)] sm:w-[480px] sm:h-[480px] md:w-[540px] md:h-[540px] rounded-xl overflow-hidden transition-transform duration-500 ${
            is3d ? 'rotate-x-[22deg] scale-[0.98] shadow-2xl' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            border: `2px solid ${theme.borderColor}77`,
          }}
        >
          {displayRanks.map((rank, rankIdx) =>
            displayFiles.map((file, fileIdx) => {
              const square = `${file}${rank}` as Square;
              const piece = chess.get(square);
              const isLight = (file.charCodeAt(0) - 97 + parseInt(rank, 10)) % 2 === 1;
              const isSelected = selectedSquare === square;
              const isValidDestination = validMoves.some((m) => m.to === square);
              const isCaptureDestination = isValidDestination && Boolean(piece);
              const isLastMove = lastMove?.from === square || lastMove?.to === square;
              const isKingInCheck = square === checkedKingSquare;

              // Compute background square color & aura
              let squareBg = isLight ? theme.lightSquare : theme.darkSquare;
              let squareGlow = 'none';

              if (isSelected) {
                squareBg = theme.highlightSelected;
                squareGlow = `inset 0 0 16px ${theme.glowColor}`;
              } else if (isKingInCheck) {
                squareBg = theme.highlightCheck;
                squareGlow = `inset 0 0 20px #ef4444, 0 0 25px #ef4444`;
              } else if (isLastMove) {
                squareBg = theme.highlightLastMove;
              }

              return (
                <div
                  key={square}
                  onClick={(e) => handleSquareClick(square, e)}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 group ${
                    isKingInCheck ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: squareBg,
                    boxShadow: squareGlow,
                  }}
                >
                  {/* Magic Move candidate indicators */}
                  {showHints && isValidDestination && !isCaptureDestination && (
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full pointer-events-none transition-transform duration-200 group-hover:scale-125"
                      style={{
                        backgroundColor: theme.accentColor,
                        boxShadow: `0 0 10px ${theme.glowColor}, 0 0 20px ${theme.glowColor}`,
                        opacity: 0.8,
                      }}
                    />
                  )}

                  {/* Target capture ring aura */}
                  {showHints && isCaptureDestination && (
                    <div
                      className="absolute inset-1 rounded-full border-2 border-dashed pointer-events-none animate-spin-slow"
                      style={{
                        borderColor: theme.accentColor,
                        boxShadow: `0 0 12px ${theme.glowColor}`,
                      }}
                    />
                  )}

                  {/* Render Chess Piece */}
                  {piece && (
                    <div
                      className={`w-[85%] h-[85%] flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? '-translate-y-2 scale-110 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]'
                          : 'hover:scale-105'
                      }`}
                    >
                      <ChessPieceSvg type={piece.type} color={piece.color} theme={theme} />
                    </div>
                  )}

                  {/* Rank coordinate indicator (leftmost file) */}
                  {fileIdx === 0 && (
                    <span
                      className="absolute top-0.5 left-1 text-[10px] sm:text-xs font-mono font-bold pointer-events-none opacity-40"
                      style={{ color: isLight ? theme.darkSquare : theme.accentColor }}
                    >
                      {rank}
                    </span>
                  )}

                  {/* File coordinate indicator (bottom rank) */}
                  {rankIdx === 7 && (
                    <span
                      className="absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-mono font-bold pointer-events-none opacity-40"
                      style={{ color: isLight ? theme.darkSquare : theme.accentColor }}
                    >
                      {file}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pawn Promotion Modal Dialog */}
      {pendingPromotion && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md rounded-2xl p-4">
          <div
            className="p-5 rounded-xl border flex flex-col items-center gap-4 text-center max-w-xs shadow-2xl"
            style={{
              backgroundColor: '#0d0b1a',
              borderColor: theme.borderColor,
              boxShadow: `0 0 30px ${theme.glowColor}50`,
            }}
          >
            <h4 className="text-base font-semibold text-white">Pilih Promosi Bidak</h4>
            <div className="grid grid-cols-4 gap-3">
              {(['q', 'r', 'b', 'n'] as PieceSymbol[]).map((pType) => (
                <button
                  key={pType}
                  onClick={() => executePromotion(pType)}
                  className="w-14 h-14 rounded-lg flex items-center justify-center p-2 transition-all duration-150 hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: `1px solid ${theme.borderColor}80`,
                  }}
                >
                  <ChessPieceSvg
                    type={pType}
                    color={chess.turn()}
                    theme={theme}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setPendingPromotion(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
