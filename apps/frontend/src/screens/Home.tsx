import { useState } from 'react';

// ── Image-Based Chess Board ──────────────────────────────────────────────────────

// Maps piece letter → public image filename
// Uppercase = white (w prefix), lowercase = black (b prefix)
const PIECE_IMG: Record<string, string> = {
  K: '/wk.png', Q: '/wq.png', R: '/wr.png', B: '/wb.png', N: '/wn.png', P: '/wp.png',
  k: '/bk.png', q: '/bq.png', r: '/br.png', b: '/bb.png', n: '/bn.png', p: '/bp.png',
};

const INITIAL_BOARD = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
];

const RANKS = ['8','7','6','5','4','3','2','1'];
const FILES = ['a','b','c','d','e','f','g','h'];

function PlayerPanel({
  name, elo, initials, color, clock,
}: {
  name: string; elo: number; initials: string;
  color: 'white' | 'black'; clock: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      background: color === 'white'
        ? 'linear-gradient(135deg,rgba(0,245,255,0.06),rgba(0,245,255,0.02))'
        : 'rgba(255,255,255,0.03)',
      borderRadius: 12,
      border: color === 'white'
        ? '1px solid rgba(0,245,255,0.18)'
        : '1px solid rgba(255,255,255,0.06)',
      boxShadow: color === 'white' ? '0 0 12px rgba(0,245,255,0.06)' : 'none',
    }}>
      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: color === 'black'
          ? 'linear-gradient(135deg,#1a1a2e,#16213e)'
          : 'linear-gradient(135deg,#00c8d4,#7c3aed)',
        border: color === 'black'
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(0,245,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 900, color: '#fff',
        boxShadow: color === 'white' ? '0 0 14px rgba(0,245,255,0.2)' : 'none',
        letterSpacing: 1,
      }}>
        {initials}
      </div>

      {/* Name + ELO */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#e2e8f0',
          fontFamily: 'Inter,sans-serif',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{
            fontSize: 10, color: 'rgba(0,245,255,0.6)',
            fontFamily: 'Orbitron,sans-serif', letterSpacing: 0.8,
          }}>ELO {elo}</span>
          {/* piece icons showing material */}
          {color === 'white' && (
            <img src="/wp.png" style={{ width: 12, height: 12, opacity: 0.5 }} alt="" />
          )}
        </div>
      </div>

      {/* Clock */}
      <div style={{
        fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 900,
        color: '#00f5ff',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(0,245,255,0.2)',
        borderRadius: 8, padding: '5px 12px',
        letterSpacing: 2,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 10px rgba(0,245,255,0.12)',
        minWidth: 60, textAlign: 'center',
      }}>{clock}</div>
    </div>
  );
}

// ── Board Theme Definitions ──────────────────────────────────────────────────
const BOARD_THEMES = {
  tournament: {
    id: 'tournament',
    name: 'Tournament',
    light: '#ebecd0',
    dark: '#739552',
    highlight: 'rgba(255, 255, 51, 0.42)',
  },
  wood: {
    id: 'wood',
    name: 'Classic Wood',
    light: '#f0d9b5',
    dark: '#b58863',
    highlight: 'rgba(205, 210, 106, 0.55)',
  },
  glass: {
    id: 'glass',
    name: 'Cyber Glass',
    light: '#252f48',
    dark: '#111827',
    highlight: 'rgba(0, 245, 255, 0.35)',
  },
} as const;

type ThemeKey = keyof typeof BOARD_THEMES;

function ProChessBoard() {
  const [boardTheme, setBoardTheme] = useState<ThemeKey>('glass');
  const [board, setBoard] = useState<string[][]>(() => INITIAL_BOARD.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>({
    from: [6, 4], // e2
    to: [4, 4],   // e4 (subtle starting highlight for aesthetic realism)
  });

  const theme = BOARD_THEMES[boardTheme];

  const handleSquareClick = (ri: number, ci: number) => {
    const piece = board[ri][ci];
    if (selected) {
      const [sri, sci] = selected;
      if (sri === ri && sci === ci) {
        setSelected(null);
        return;
      }
      // If clicking own piece, switch selection
      const isSelectedWhite = board[sri][sci] !== ' ' && board[sri][sci] === board[sri][sci].toUpperCase();
      const isTargetWhite = piece !== ' ' && piece === piece.toUpperCase();
      if (isSelectedWhite && isTargetWhite) {
        setSelected([ri, ci]);
        return;
      }
      // Move piece to new square
      const newBoard = board.map(r => [...r]);
      newBoard[ri][ci] = board[sri][sci];
      newBoard[sri][sci] = ' ';
      setBoard(newBoard);
      setLastMove({ from: [sri, sci], to: [ri, ci] });
      setSelected(null);
    } else {
      if (piece !== ' ') {
        setSelected([ri, ci]);
      }
    }
  };

  const handleReset = () => {
    setBoard(INITIAL_BOARD.map(r => [...r]));
    setSelected(null);
    setLastMove(null);
  };

  return (
    <div style={{ userSelect: 'none', maxWidth: 360, margin: '0 auto' }}>

      {/* ── Theme Switcher & Reset Bar ───────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, gap: 8, flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(255,255,255,0.04)',
          padding: '3px 4px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {(Object.keys(BOARD_THEMES) as ThemeKey[]).map((key) => {
            const active = boardTheme === key;
            return (
              <button
                key={key}
                onClick={() => setBoardTheme(key)}
                style={{
                  background: active ? 'rgba(0,245,255,0.18)' : 'transparent',
                  border: active ? '1px solid rgba(0,245,255,0.4)' : '1px solid transparent',
                  color: active ? '#00f5ff' : 'rgba(148,163,184,0.7)',
                  fontSize: 10, fontFamily: 'Orbitron, sans-serif',
                  fontWeight: active ? 700 : 500,
                  padding: '4px 8px', borderRadius: 6,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  letterSpacing: 0.5,
                }}
              >
                {BOARD_THEMES[key].name}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleReset}
          title="Reset board pieces"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(148,163,184,0.6)',
            fontSize: 10, fontFamily: 'Orbitron, sans-serif',
            padding: '4px 10px', borderRadius: 6,
            cursor: 'pointer', transition: 'all 0.15s ease',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#00f5ff';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.6)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <span>↺</span> Reset
        </button>
      </div>

      {/* ── Opponent Panel ───────────────────────── */}
      <div style={{ marginBottom: 10 }}>
        <PlayerPanel name="AlphaZero_X" elo={1304} initials="AZ" color="black" clock="3:00" />
      </div>

      {/* ── 8×8 Uniform Chess Board ──────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: 8,
        overflow: 'hidden',
        border: '2px solid rgba(0,245,255,0.2)',
        boxShadow: [
          '0 0 0 1px rgba(0,245,255,0.06)',
          '0 6px 24px rgba(0,0,0,0.5)',
          '0 0 20px rgba(0,245,255,0.1)',
        ].join(', '),
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          width: '100%',
          height: '100%',
        }}>
          {board.map((row, ri) =>
            row.map((piece, ci) => {
              const isLight = (ri + ci) % 2 === 0;
              const isSelected = selected !== null && selected[0] === ri && selected[1] === ci;
              const isFromMove = lastMove !== null && lastMove.from[0] === ri && lastMove.from[1] === ci;
              const isToMove = lastMove !== null && lastMove.to[0] === ri && lastMove.to[1] === ci;
              const isHighlight = isFromMove || isToMove;
              const imgSrc = PIECE_IMG[piece];

              // Base square color
              const baseColor = isLight ? theme.light : theme.dark;
              // Coordinate text color contrasting with square
              const coordColor = isLight ? theme.dark : theme.light;

              return (
                <div
                  key={`cell-${ri}-${ci}`}
                  onClick={() => handleSquareClick(ri, ci)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: baseColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: piece !== ' ' || selected ? 'pointer' : 'default',
                    boxShadow: isSelected
                      ? 'inset 0 0 0 3px #00f5ff, inset 0 0 12px rgba(0,245,255,0.6)'
                      : undefined,
                    transition: 'box-shadow 0.15s ease',
                  }}
                >
                  {/* Last move indicator highlight overlay */}
                  {isHighlight && !isSelected && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: theme.highlight,
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Rank coordinate (inside file 'a', top-left corner) */}
                  {ci === 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 2,
                      left: 4,
                      fontSize: 'clamp(9px, 1.1vw, 12px)',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      color: coordColor,
                      opacity: 0.85,
                      lineHeight: 1,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: 2,
                    }}>
                      {RANKS[ri]}
                    </span>
                  )}

                  {/* File coordinate (inside rank '1', bottom-right corner) */}
                  {ri === 7 && (
                    <span style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 4,
                      fontSize: 'clamp(9px, 1.1vw, 12px)',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      color: coordColor,
                      opacity: 0.85,
                      lineHeight: 1,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: 2,
                    }}>
                      {FILES[ci]}
                    </span>
                  )}

                  {/* Chess Piece Image */}
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={piece}
                      draggable={false}
                      style={{
                        width: '84%',
                        height: '84%',
                        objectFit: 'contain',
                        zIndex: 1,
                        filter: piece === piece.toUpperCase()
                          ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.5)) drop-shadow(0 0 3px rgba(255,255,255,0.15))'
                          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
                        transform: isSelected ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
                        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
                      }}
                    />
                  )}

                  {/* Legal move suggestion dot when a piece is selected */}
                  {selected && piece === ' ' && !isSelected && (
                    <div style={{
                      position: 'absolute',
                      width: 10,
                      height: 10,
                      borderRadius: 99,
                      backgroundColor: 'rgba(0,245,255,0.45)',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Your Player Panel ────────────────────── */}
      <div style={{ marginTop: 10 }}>
        <PlayerPanel name="Ravindrauk01 🇮🇳" elo={1247} initials="R" color="white" clock="3:00" />
      </div>
    </div>
  );
}


// ── Time Control Button ───────────────────────────────────────────────────────

function TimeBtn({ label, sub, active, onClick }: { label: string; sub: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 6px', borderRadius: 10,
        border: active ? '1px solid rgba(0,245,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
        background: active
          ? 'linear-gradient(135deg,rgba(0,245,255,0.18),rgba(168,85,247,0.12))'
          : 'rgba(255,255,255,0.03)',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: active ? '0 0 16px rgba(0,245,255,0.15)' : 'none',
      }}
    >
      <div style={{
        fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 900,
        color: active ? '#00f5ff' : '#e2e8f0', letterSpacing: 1,
      }}>{label}</div>
      <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', marginTop: 2, fontFamily: 'Inter,sans-serif' }}>{sub}</div>
    </button>
  );
}

// ── Quick Action Card ─────────────────────────────────────────────────────────

function QuickCard({
  icon, label, sub, color, id, onClick,
}: { icon: string; label: string; sub: string; color: string; id: string; onClick?: () => void }) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '13px 14px', borderRadius: 12,
        border: `1px solid ${color}22`,
        background: `${color}08`,
        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${color}14`;
        (e.currentTarget as HTMLElement).style.borderColor = `${color}44`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${color}08`;
        (e.currentTarget as HTMLElement).style.borderColor = `${color}22`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', fontFamily: 'Inter,sans-serif' }}>{label}</div>
        <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', fontFamily: 'Inter,sans-serif' }}>{sub}</div>
      </div>
      <span style={{ marginLeft: 'auto', fontSize: 16, color, opacity: 0.6 }}>›</span>
    </button>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ title, badge, action }: { title: string; badge?: string; action?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <h2 style={{
        fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700,
        letterSpacing: 2, color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase',
      }}>{title}</h2>
      {badge && (
        <span style={{
          fontSize: 9, fontWeight: 700, fontFamily: 'Orbitron,sans-serif',
          padding: '2px 7px', borderRadius: 99,
          background: 'linear-gradient(135deg,#ef4444,#f97316)',
          color: '#fff', letterSpacing: 1,
        }}>{badge}</span>
      )}
      {action && (
        <button style={{
          marginLeft: 'auto', fontSize: 11, color: 'rgba(0,245,255,0.6)',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
        }}>{action} →</button>
      )}
    </div>
  );
}

// ── Live Game Pill ────────────────────────────────────────────────────────────

const LIVE_GAMES = [
  { w: 'Magnus C.', b: 'Hikaru N.', wElo: 2847, bElo: 2794, time: '3+0', move: 24 },
  { w: 'Fabiano C.', b: 'Anish G.',  wElo: 2804, bElo: 2760, time: '5+3', move: 37 },
  { w: 'Wesley S.',  b: 'Levon A.', wElo: 2773, bElo: 2765, time: '1+0', move: 12 },
];

function LiveGameCard({ g }: { g: typeof LIVE_GAMES[0] }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(0,245,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'all 0.2s', cursor: 'pointer',
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.2)'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.08)'; }}
    >
      {/* Live dot */}
      <span style={{
        width: 8, height: 8, borderRadius: 99, flexShrink: 0,
        background: '#22c55e', boxShadow: '0 0 6px #22c55e',
        animation: 'home-pulse 2s ease-in-out infinite',
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500, fontFamily: 'Inter,sans-serif' }}>
            {g.w} <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: 10 }}>({g.wElo})</span>
          </span>
          <span style={{ fontSize: 10, color: 'rgba(0,245,255,0.6)', fontFamily: 'Orbitron,sans-serif', letterSpacing: 1 }}>{g.time}</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.7)', fontFamily: 'Inter,sans-serif' }}>
          vs {g.b} <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: 10 }}>({g.bElo})</span>
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.45)', fontFamily: 'Inter,sans-serif', flexShrink: 0 }}>
        Move {g.move}
      </div>
    </div>
  );
}

// ── Leaderboard Row ───────────────────────────────────────────────────────────

const LEADERS = [
  { rank: 1, name: 'Magnus C.',   elo: 2847, delta: '+12', flag: '🇳🇴' },
  { rank: 2, name: 'Hikaru N.',   elo: 2794, delta: '+5',  flag: '🇺🇸' },
  { rank: 3, name: 'Fabiano C.',  elo: 2804, delta: '-3',  flag: '🇺🇸' },
  { rank: 4, name: 'Anish G.',    elo: 2760, delta: '+8',  flag: '🇳🇱' },
  { rank: 5, name: 'Wesley S.',   elo: 2773, delta: '+2',  flag: '🇺🇸' },
];

function LeaderRow({ r }: { r: typeof LEADERS[0] }) {
  const rankColors: Record<number,string> = { 1: '#fbbf24', 2: '#94a3b8', 3: '#a16207' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 10,
      background: r.rank === 1 ? 'rgba(251,191,36,0.05)' : 'transparent',
      border: r.rank === 1 ? '1px solid rgba(251,191,36,0.12)' : '1px solid transparent',
      transition: 'background 0.2s',
    }}>
      <span style={{
        fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700,
        color: rankColors[r.rank] || 'rgba(148,163,184,0.5)', width: 18, textAlign: 'center',
      }}>{r.rank}</span>
      <span style={{ fontSize: 14 }}>{r.flag}</span>
      <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0', fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>{r.name}</span>
      <span style={{
        fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700,
        color: r.rank === 1 ? '#fbbf24' : '#00f5ff',
      }}>{r.elo}</span>
      <span style={{
        fontSize: 10, fontFamily: 'Orbitron,sans-serif', fontWeight: 700,
        color: r.delta.startsWith('+') ? '#22c55e' : '#ef4444',
        minWidth: 28, textAlign: 'right',
      }}>{r.delta}</span>
    </div>
  );
}

// ── Daily Puzzle ──────────────────────────────────────────────────────────────

const PUZZLE_BOARD = [
  [' ',' ',' ',' ','k',' ',' ',' '],
  [' ',' ',' ',' ','p','p','p',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ','Q',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','P','P','P',' '],
  [' ',' ',' ',' ','K',' ',' ',' '],
];

function PuzzleBoard() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gridTemplateRows: 'repeat(8, 1fr)',
      width: '100%',
      aspectRatio: '1 / 1',
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid rgba(168,85,247,0.3)',
      boxShadow: '0 0 24px rgba(168,85,247,0.12)',
    }}>
      {PUZZLE_BOARD.map((row, ri) =>
        row.map((piece, ci) => {
          const light = (ri + ci) % 2 === 0;
          const imgSrc = PIECE_IMG[piece];
          return (
            <div
              key={`${ri}-${ci}`}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: light ? '#252f48' : '#111827',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'default', userSelect: 'none',
              }}
            >
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={piece}
                  style={{
                    width: '82%', height: '82%', objectFit: 'contain',
                    filter: piece === piece.toUpperCase()
                      ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.7)) drop-shadow(0 0 5px rgba(255,255,255,0.12))'
                      : 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
                  }}
                  draggable={false}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}


// ── Recent Games Table ────────────────────────────────────────────────────────

const RECENT_GAMES = [
  { opp: 'AlphaZero9',   result: 'W', elo: 1304, delta: '+12', opening: 'Sicilian Defense',  time: '10+0', date: '2h ago' },
  { opp: 'KnightMaster', result: 'L', elo: 1289, delta: '-8',  opening: 'Queen\'s Gambit',   time: '5+3',  date: '5h ago' },
  { opp: 'PawnStorm77',  result: 'D', elo: 1251, delta: '+1',  opening: 'Italian Game',      time: '3+0',  date: 'Yesterday' },
  { opp: 'Rook_Beast',   result: 'W', elo: 1198, delta: '+10', opening: 'King\'s Indian',    time: '10+0', date: 'Yesterday' },
];

function RecentGameRow({ g }: { g: typeof RECENT_GAMES[0] }) {
  const resultColor = g.result === 'W' ? '#22c55e' : g.result === 'L' ? '#ef4444' : '#f59e0b';
  const resultBg    = g.result === 'W' ? 'rgba(34,197,94,0.12)' : g.result === 'L' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 10,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      marginBottom: 6, transition: 'border-color 0.2s', cursor: 'pointer',
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.15)'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; }}
    >
      <span style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: resultBg, border: `1px solid ${resultColor}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 900, fontFamily: 'Orbitron,sans-serif', color: resultColor,
      }}>{g.result}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500, fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          vs {g.opp} <span style={{ color: 'rgba(148,163,184,0.45)', fontSize: 11 }}>({g.elo})</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)', fontFamily: 'Inter,sans-serif' }}>{g.opening}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, fontFamily: 'Orbitron,sans-serif',
          color: g.delta.startsWith('+') ? '#22c55e' : g.delta.startsWith('-') ? '#ef4444' : '#f59e0b',
        }}>{g.delta}</div>
        <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.4)', fontFamily: 'Inter,sans-serif' }}>{g.time} · {g.date}</div>
      </div>
    </div>
  );
}

// ── Streak Banner ─────────────────────────────────────────────────────────────

function StreakBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 14px', borderRadius: 99,
      background: 'rgba(249,115,22,0.12)',
      border: '1px solid rgba(249,115,22,0.25)',
    }}>
      <span style={{ fontSize: 18 }}>🔥</span>
      <span style={{
        fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700,
        color: '#f97316', letterSpacing: 1,
      }}>4 Day Streak</span>
    </div>
  );
}

// ── Glass Card wrapper ────────────────────────────────────────────────────────

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(5,8,30,0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,245,255,0.09)',
      borderRadius: 16,
      padding: '20px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Main Home Page ────────────────────────────────────────────────────────────

const TIME_CONTROLS = [
  { label: '1', sub: 'Bullet', val: '1+0' },
  { label: '3', sub: 'Blitz',  val: '3+0' },
  { label: '5', sub: 'Blitz',  val: '5+0' },
  { label: '10', sub: 'Rapid', val: '10+0' },
];

export default function Home() {
  const [activeTime, setActiveTime] = useState('3+0');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'hsl(222,47%,5%)',
      position: 'relative',
      fontFamily: 'Inter,system-ui,sans-serif',
    }}>
      {/* ── Background glow blobs ─────────────────────── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, rgba(0,245,255,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 80% 85%, rgba(168,85,247,0.07) 0%, transparent 60%)
        `,
      }}/>

      {/* ── Holo grid ────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.4,
        backgroundImage: `
          linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}/>

      {/* ── Content ──────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '28px 28px 48px' }}>

        {/* ── Top bar ───────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg,#00c8d4,#7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, fontFamily: 'Orbitron,sans-serif', color: '#fff',
              }}>R</div>
              <div>
                <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 15, fontWeight: 700, color: '#e2e8f0', letterSpacing: 1 }}>
                  Ravindrauk01
                </div>
                <div style={{ fontSize: 11, color: 'rgba(0,245,255,0.6)', fontFamily: 'Orbitron,sans-serif', letterSpacing: 1 }}>
                  ELO 1247 · Rank #8,341
                </div>
              </div>
            </div>
          </div>
          <StreakBanner />
        </div>

        {/* ── Main 3-col grid ───────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 280px',
          gap: 20,
          alignItems: 'start',
        }}>

          {/* ══ COL 1: Play panel ════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Time controls */}
            <GlassCard>
              <SectionHeader title="Play Online" />
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {TIME_CONTROLS.map((tc) => (
                  <TimeBtn
                    key={tc.val}
                    label={tc.label}
                    sub={tc.sub}
                    active={activeTime === tc.val}
                    onClick={() => setActiveTime(tc.val)}
                  />
                ))}
              </div>
              <button
                id="home-start-game-btn"
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#00c8d4,#7c3aed)',
                  fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 700,
                  letterSpacing: 2, color: '#fff', textTransform: 'uppercase',
                  boxShadow: '0 0 28px rgba(0,245,255,0.25), 0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 44px rgba(0,245,255,0.4), 0 8px 24px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(0,245,255,0.25), 0 4px 16px rgba(0,0,0,0.3)';
                }}
              >
                ⚡ Start Game
              </button>
            </GlassCard>

            {/* Quick actions */}
            <GlassCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <QuickCard id="home-online-btn"     icon="🌐" label="Play Online"      sub="Matchmake with a player" color="#00f5ff" />
                <QuickCard id="home-tournament-btn" icon="🏆" label="Tournaments"      sub="3 live right now"        color="#f97316" />
                <QuickCard id="home-bot-btn"        icon="🤖" label="Play vs Bot"      sub="ELO 800–3200 difficulty" color="#a855f7" />
                <QuickCard id="home-friend-btn"     icon="👥" label="Challenge Friend" sub="Send a game invite"      color="#22c55e" />
              </div>
            </GlassCard>

            {/* ELO progress */}
            <GlassCard>
              <SectionHeader title="Your Rating" />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 32, fontWeight: 900, background: 'linear-gradient(90deg,#00f5ff,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>1247</span>
                <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, color: '#22c55e', fontWeight: 700 }}>+21 this week</span>
              </div>
              {/* Progress bar toward next rank */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(148,163,184,0.5)', marginBottom: 4, fontFamily: 'Orbitron,sans-serif' }}>
                  <span>Silver II</span><span>Gold I  →  1300</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99, width: '73%',
                    background: 'linear-gradient(90deg,#00c8d4,#7c3aed)',
                    boxShadow: '0 0 8px rgba(0,245,255,0.4)',
                  }}/>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                {[['W', '124', '#22c55e'], ['D', '23', '#f59e0b'], ['L', '87', '#ef4444']].map(([label, val, color]) => (
                  <div key={label} style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: `${color}0a`, border: `1px solid ${color}22` }}>
                    <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 16, fontWeight: 900, color }}>{val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', letterSpacing: 1, fontFamily: 'Orbitron,sans-serif' }}>{label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ══ COL 2: Center (board + live games + recent) ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Board + featured game */}
            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: 240 }}>
                {[
                  { label: 'Solve Puzzles', icon: '🧩', color: '#a855f7', id: 'home-puzzle-feature' },
                  { label: 'Next Lesson', icon: '🎓', color: '#00f5ff', id: 'home-lesson-feature' },
                  { label: 'Play Bots', icon: '🤖', color: '#f97316', id: 'home-bots-feature' },
                ].map((card) => (
                  <button
                    key={card.id}
                    id={card.id}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 10, border: 'none', cursor: 'pointer',
                      background: `${card.color}08`,
                      borderRight: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${card.color}16`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${card.color}08`; }}
                  >
                    <div style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: `${card.color}14`, border: `1px solid ${card.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                      boxShadow: `0 0 20px ${card.color}20`,
                    }}>{card.icon}</div>
                    <span style={{
                      fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700,
                      letterSpacing: 1, color: card.color, textTransform: 'uppercase',
                    }}>{card.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Board Preview */}
            <GlassCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase' }}>Board Preview</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,245,255,0.5)', fontFamily: 'Inter,sans-serif', marginTop: 2 }}>Blitz · 3+0 · Rated</div>
                </div>
                <button
                  id="home-start-board-btn"
                  style={{
                    padding: '8px 18px', borderRadius: 8,
                    border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#00c8d4,#7c3aed)',
                    fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700,
                    letterSpacing: 1.5, color: '#fff',
                    boxShadow: '0 0 16px rgba(0,245,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(0,245,255,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(0,245,255,0.2)';
                  }}
                >⚡ PLAY NOW</button>
              </div>
              <ProChessBoard />
            </GlassCard>

            {/* Recent Games */}
            <GlassCard>
              <SectionHeader title="Recent Games" action="View All" />
              {RECENT_GAMES.map((g, i) => <RecentGameRow key={i} g={g} />)}
            </GlassCard>
          </div>

          {/* ══ COL 3: Right panel ════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Live Games */}
            <GlassCard>
              <SectionHeader title="Live Games" badge="LIVE" action="Watch All" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LIVE_GAMES.map((g, i) => <LiveGameCard key={i} g={g} />)}
              </div>
            </GlassCard>

            {/* Daily Puzzle */}
            <GlassCard>
              <SectionHeader title="Daily Puzzle" />
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                padding: '6px 10px', borderRadius: 8,
                background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)',
              }}>
                <span style={{ fontSize: 14 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#a855f7', fontFamily: 'Orbitron,sans-serif', letterSpacing: 1 }}>Mate in 2</div>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontFamily: 'Inter,sans-serif' }}>Rating: 1450 · Tactics</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#f97316', fontFamily: 'Orbitron,sans-serif', fontWeight: 700 }}>🔥 31,918</span>
                </div>
              </div>
              <PuzzleBoard />
              <button
                id="home-solve-puzzle-btn"
                style={{
                  marginTop: 12, width: '100%', padding: '11px', borderRadius: 10,
                  border: '1px solid rgba(168,85,247,0.3)',
                  background: 'rgba(168,85,247,0.08)',
                  fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700,
                  letterSpacing: 1.5, color: '#a855f7', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.18)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)';
                  (e.currentTarget as HTMLElement).style.color = '#c084fc';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(168,85,247,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.3)';
                  (e.currentTarget as HTMLElement).style.color = '#a855f7';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                SOLVE PUZZLE
              </button>
            </GlassCard>

            {/* Leaderboard */}
            <GlassCard>
              <SectionHeader title="Global Leaders" action="Full Board" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {LEADERS.map((r) => <LeaderRow key={r.rank} r={r} />)}
              </div>
              {/* Your position */}
              <div style={{
                marginTop: 10, padding: '8px 12px', borderRadius: 10,
                background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.12)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 11, color: 'rgba(0,245,255,0.5)', fontFamily: 'Orbitron,sans-serif', width: 18, textAlign: 'center' }}>…</span>
                <span style={{ flex: 1, fontSize: 13, color: '#00f5ff', fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>You · #8,341</span>
                <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, color: '#00f5ff' }}>1247</span>
              </div>
            </GlassCard>

          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes home-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 1100px) {
          .home-grid { grid-template-columns: 280px 1fr !important; }
          .home-col3 { display: none; }
        }
        @media (max-width: 750px) {
          .home-grid { grid-template-columns: 1fr !important; }
          .home-col1 { order: 1; }
          .home-col2 { order: 0; }
        }
      `}</style>
    </div>
  );
}
