import React from 'react';
import { PieceSymbol, Color } from 'chess.js';
import { BoardTheme } from '../types/chess';

interface PieceProps {
  type: PieceSymbol;
  color: Color;
  theme: BoardTheme;
  isDragging?: boolean;
}

export const ChessPieceSvg: React.FC<PieceProps> = ({ type, color, theme }) => {
  const isWhite = color === 'w';

  // Aesthetic custom color gradients based on active theme
  const getGradients = () => {
    if (theme.id === 'royal_gold') {
      return {
        whiteFill: 'url(#goldLightGrad)',
        whiteStroke: '#fef08a',
        blackFill: 'url(#goldDarkGrad)',
        blackStroke: '#ca8a04',
      };
    }
    if (theme.id === 'ice_crystal') {
      return {
        whiteFill: 'url(#iceLightGrad)',
        whiteStroke: '#bae6fd',
        blackFill: 'url(#iceDarkGrad)',
        blackStroke: '#38bdf8',
      };
    }
    if (theme.id === 'sakura') {
      return {
        whiteFill: 'url(#sakuraLightGrad)',
        whiteStroke: '#fbcfe8',
        blackFill: 'url(#sakuraDarkGrad)',
        blackStroke: '#f472b6',
      };
    }
    if (theme.id === 'cyber_neon') {
      return {
        whiteFill: 'url(#cyberLightGrad)',
        whiteStroke: '#22d3ee',
        blackFill: 'url(#cyberDarkGrad)',
        blackStroke: '#d946ef',
      };
    }
    // Default Galaxy Cosmic
    return {
      whiteFill: 'url(#galaxyLightGrad)',
      whiteStroke: '#e9d5ff',
      blackFill: 'url(#galaxyDarkGrad)',
      blackStroke: '#a855f7',
    };
  };

  const gradients = getGradients();
  const fill = isWhite ? gradients.whiteFill : gradients.blackFill;
  const stroke = isWhite ? gradients.whiteStroke : gradients.blackStroke;
  const filterGlow = isWhite ? theme.pieceLightGlow : theme.pieceDarkGlow;

  return (
    <svg
      viewBox="0 0 45 45"
      className="w-full h-full select-none transition-transform duration-150"
      style={{ filter: filterGlow }}
    >
      <defs>
        {/* Galaxy */}
        <linearGradient id="galaxyLightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="galaxyDarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="70%" stopColor="#2e1065" />
          <stop offset="100%" stopColor="#0f0728" />
        </linearGradient>

        {/* Royal Gold */}
        <linearGradient id="goldLightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="goldDarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="70%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>

        {/* Ice Crystal */}
        <linearGradient id="iceLightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="iceDarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="70%" stopColor="#0c2842" />
          <stop offset="100%" stopColor="#04121e" />
        </linearGradient>

        {/* Sakura */}
        <linearGradient id="sakuraLightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="50%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="sakuraDarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#831843" />
          <stop offset="70%" stopColor="#3f0f24" />
          <stop offset="100%" stopColor="#1f0712" />
        </linearGradient>

        {/* Cyber Neon */}
        <linearGradient id="cyberLightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="cyberDarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c026d3" />
          <stop offset="70%" stopColor="#4a044e" />
          <stop offset="100%" stopColor="#18021c" />
        </linearGradient>
      </defs>

      {/* PAWN */}
      {type === 'p' && (
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
          <circle cx="22.5" cy="13" r="2.5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
        </g>
      )}

      {/* KNIGHT */}
      {type === 'n' && (
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-4.04 3-6 2.1-2.6 4-4.5 4-7z" />
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill={stroke} />
          <circle cx="15" cy="15" r="1.5" fill={stroke} />
        </g>
      )}

      {/* BISHOP */}
      {type === 'b' && (
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
          <path d="M17.5 26h10M22.5 21v10" stroke={stroke} strokeWidth="1.2" />
        </g>
      )}

      {/* ROOK */}
      {type === 'r' && (
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17v12.5H14V17" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
          <path d="M11 14h23" />
        </g>
      )}

      {/* QUEEN */}
      {type === 'q' && (
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" />
          <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 1-3.5 1.5-2 1.5-2 1.5-4-6.5-1.5-20-1.5-26.5 0z" />
          <circle cx="22.5" cy="30" r="2" fill={stroke} opacity="0.8" />
        </g>
      )}

      {/* KING */}
      {type === 'k' && (
        <g stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill={fill}>
          <path d="M22.5 11.63V6M20 8h5" stroke={stroke} strokeWidth="1.8" />
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-6.5 6-6.5 6-3.5-4-9-4-13.5 0 0 0-2.5-7-6.5-6-3 6 6 10.5 6 10.5v7z" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
        </g>
      )}
    </svg>
  );
};
