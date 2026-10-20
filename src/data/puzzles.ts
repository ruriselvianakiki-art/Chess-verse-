import { ChessPuzzle } from '../types/chess';

export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    id: 'puzzle_1',
    title: 'Skakmat Koridor (Back-Rank Mate)',
    theme: 'Back-Rank Mate',
    difficulty: 'Mudah',
    // White: King on g1, Rook on d1, Pawns f2, g2, h2. Black: King on g8, Pawns f7, g7, h7, Rook on b2.
    // White to move: Rd8# (or Rd1-d8#)
    fen: '6k1/5ppp/8/8/8/8/1r3PPP/3R2K1 w - - 0 1',
    solutionUci: ['d1d8'],
    playerColor: 'w',
    objective: 'Temukan satu langkah skakmat di baris belakang lawan!',
    hint: 'Gunakan benteng di d1 untuk menyerang baris ke-8 karena raja hitam terkurung oleh pionnya sendiri.',
    coins: 50,
    xp: 60,
  },
  {
    id: 'puzzle_2',
    title: 'Garpu Kuda Kerajaan (Royal Fork)',
    theme: 'Knight Fork',
    difficulty: 'Mudah',
    // White: Ne5, King g1. Black: King e8, Queen d8. White moves Nc6 or fork!
    // Let's set White Knight on d5, Black King on e8, Queen on d8, Rook on a8.
    // Nc7+ forks King and Queen or King and Rook!
    // Fen: r3k3/8/8/3N4/8/8/5PPP/4K3 w - - 0 1 -> Nc7+ forks Ke8 and Ra8
    fen: 'r3k3/8/8/3N4/8/8/5PPP/4K3 w - - 0 1',
    solutionUci: ['d5c7'],
    playerColor: 'w',
    objective: 'Lakukan taktik garpu (fork) kuda untuk menyerang dua perwira sekaligus!',
    hint: 'Lompatkan kuda ke petak c7 untuk memberikan skak sekaligus mengancam benteng.',
    coins: 70,
    xp: 80,
  },
  {
    id: 'puzzle_3',
    title: 'Skakmat Sarjana Kilat (Scholar Mate)',
    theme: 'Mating Net',
    difficulty: 'Mudah',
    // 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solutionUci: ['h5f7'],
    playerColor: 'w',
    objective: 'Eksploitasi petak terlemah hitam f7 untuk meraih kemenangan seketika!',
    hint: 'Menteri putih di h5 dilindungi oleh gajah di c4.',
    coins: 60,
    xp: 75,
  },
  {
    id: 'puzzle_4',
    title: 'Pin Mematikan Gajah (Absolute Pin)',
    theme: 'Pinning',
    difficulty: 'Sedang',
    // Black Queen on e7, Black King on e8. White Bishop on c4 or f1, moves Bb5!
    fen: '4k3/4q3/8/8/8/8/4BPPP/4K3 w - - 0 1',
    solutionUci: ['e2b5'],
    playerColor: 'w',
    objective: 'Kunci posisi menteri hitam agar tidak dapat bergerak!',
    hint: 'Pindahkan gajah ke b5 untuk memberikan skak melalui garis miring ke arah raja.',
    coins: 90,
    xp: 110,
  },
  {
    id: 'puzzle_5',
    title: 'Skakmat Tercekik (Smothered Mate Pattern)',
    theme: 'Smothered Mate',
    difficulty: 'Sedang',
    // Black King on h8, Rook on g8, Pawns h7, g7. White Knight on e7 (Nf7#)
    fen: '6rk/6pp/8/4N3/8/8/5PPP/4K3 w - - 0 1',
    solutionUci: ['e5f7'],
    playerColor: 'w',
    objective: 'Gunakan kuda untuk menyelinap masuk dan menghabisi raja yang terhimpit!',
    hint: 'Raja hitam tidak punya petak pelarian karena dikelilingi oleh perwiranya sendiri.',
    coins: 100,
    xp: 130,
  },
  {
    id: 'puzzle_6',
    title: 'Tusukan Sate Benteng (Skewer Attack)',
    theme: 'Skewer',
    difficulty: 'Sedang',
    // Black King on a8, Black Queen on h8. White Rook on b1 -> moves to b8 or d8.
    // Let's set: King on d7, Queen on d2. White Rook on a7...
    // White Rook on e1, Black King on e7, Black Queen on e3...
    // Let's craft: White Rook on a1, Black King on a7, Black Queen on a4. Wait, horizontal skewer:
    // White Rook on h1, Black King on d1, Black Queen on b1...
    // Better: White Rook on a8, Black King on e8, Queen on h8. Ra8+ forces King to step aside, capturing Qh8!
    // Fen: 4k2q/8/8/8/8/8/8/R3K3 w - - 0 1 -> Ra1-a8+ Ke7/Kd7 -> Rxh8
    fen: '4k2q/8/8/8/8/8/8/R3K3 w - - 0 1',
    solutionUci: ['a1a8'],
    playerColor: 'w',
    objective: 'Lakukan tusukan sate (skewer) melalui raja untuk memenangkan menteri!',
    hint: 'Skak raja di baris ke-8 dengan benteng, raja terpaksa menyingkir dan menteri di belakangnya jatuh.',
    coins: 120,
    xp: 150,
  },
  {
    id: 'puzzle_7',
    title: 'Skakmat Anastasya (Anastasia Mate)',
    theme: 'Tactical Finish',
    difficulty: 'Sulit',
    // White Rook on h3, Knight on e7. Black King on h8, Pawn g7.
    // White moves Rh3xh7# or similar
    fen: '7k/5ppp/8/4N3/8/7R/5PPP/4K3 w - - 0 1',
    solutionUci: ['h3h7'],
    playerColor: 'w',
    objective: 'Kombinasikan benteng dan kuda untuk mengeksekusi Anastasia Mate!',
    hint: 'Korbankan benteng langsung ke pion penjaga h7 untuk skakmat mutlak.',
    coins: 150,
    xp: 200,
  },
];
