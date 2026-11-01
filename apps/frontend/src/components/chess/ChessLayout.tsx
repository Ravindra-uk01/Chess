import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import ChessBoard from './ChessBoard';
import PlayerStrip from './PlayerStrip';

export interface PlayerInfo {
  name: string;
  elo: number | string;
  initials: string;
  side: 'white' | 'black';
  clock: string;
  active?: boolean;
  avatarUrl?: string;
}

interface ChessLayoutProps {
  title?: string;
  isLive?: boolean;
  board: string[][];
  selectedSquare: [number, number] | null;
  lastMove?: { from: [number, number]; to: [number, number] } | null;
  onSquareClick: (ri: number, ci: number) => void;
  topPlayer: PlayerInfo;
  bottomPlayer: PlayerInfo;
  rightPanel: ReactNode;
  orientation?: 'white' | 'black';
  boardInteractive?: boolean;
}

export const ChessLayout = ({
  title = 'Play',
  isLive = false,
  board,
  selectedSquare,
  lastMove,
  onSquareClick,
  topPlayer,
  bottomPlayer,
  rightPanel,
  orientation = 'white',
  boardInteractive = true,
}: ChessLayoutProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const measure = () => {
      if (el) {
        const w = el.offsetWidth || el.getBoundingClientRect().width;
        if (w > 0) setBoardWidth(Math.round(w));
      }
    };

    measure();

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w =
          entry.borderBoxSize?.[0]?.inlineSize ??
          (entry.target as HTMLElement).offsetWidth ??
          entry.contentRect.width;
        if (w > 0) setBoardWidth(Math.round(w));
      }
    });

    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        background: 'hsl(222,47%,5%)',
        position: 'relative',
        fontFamily: 'Inter,system-ui,sans-serif',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Background neon ambience and grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 55% 40% at 15% 15%,rgba(0,245,255,0.05) 0%,transparent 60%), radial-gradient(ellipse 50% 50% at 85% 80%,rgba(168,85,247,0.06) 0%,transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.28,
          backgroundImage:
            'linear-gradient(rgba(0,245,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.035) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Top Header / Title Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'Orbitron,sans-serif',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 2.5,
              color: 'rgba(148,163,184,0.5)',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                  display: 'inline-block',
                  animation: 'pulse-live 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'Orbitron,sans-serif',
                  fontSize: 10,
                  color: '#22c55e',
                  letterSpacing: 1.2,
                  fontWeight: 700,
                }}
              >
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* 2-Column Responsive Body */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            gap: 24,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          {/* Left Column: Board and Player Strips */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'flex-start',
              height: '100%',
              minHeight: 0,
              width: boardWidth ? `${boardWidth}px` : 'auto',
              flexShrink: 0,
            }}
          >
            {/* Top Player (Opponent) */}
            <PlayerStrip
              name={topPlayer.name}
              elo={topPlayer.elo}
              initials={topPlayer.initials}
              side={topPlayer.side}
              clock={topPlayer.clock}
              active={topPlayer.active}
              avatarUrl={topPlayer.avatarUrl}
              style={{ width: boardWidth ? `${boardWidth}px` : '100%' }}
            />

            {/* Board Container */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <ChessBoard
                ref={boardRef}
                board={board}
                selected={selectedSquare}
                lastMove={lastMove}
                onSquareClick={onSquareClick}
                orientation={orientation}
                interactive={boardInteractive}
              />
            </div>

            {/* Bottom Player (Self) */}
            <PlayerStrip
              name={bottomPlayer.name}
              elo={bottomPlayer.elo}
              initials={bottomPlayer.initials}
              side={bottomPlayer.side}
              clock={bottomPlayer.clock}
              active={bottomPlayer.active}
              avatarUrl={bottomPlayer.avatarUrl}
              style={{ width: boardWidth ? `${boardWidth}px` : '100%' }}
            />
          </div>

          {/* Right Column: Dynamic Panel (Lobby / Setup / InGame) */}
          <div
            style={{
              width: 440,
              minWidth: 380,
              flexShrink: 0,
              background: 'rgba(5, 8, 30, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 245, 255, 0.12)',
              borderRadius: 14,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(0,245,255,0.06)',
            }}
          >
            {rightPanel}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.9); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default ChessLayout;
