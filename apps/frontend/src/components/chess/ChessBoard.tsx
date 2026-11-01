import { forwardRef } from 'react';
import { PIECE_IMG, RANKS, FILES } from './constants';

interface ChessBoardProps {
  board: string[][];
  selected: [number, number] | null;
  lastMove?: { from: [number, number]; to: [number, number] } | null;
  onSquareClick: (ri: number, ci: number) => void;
  orientation?: 'white' | 'black';
  interactive?: boolean;
}

export const ChessBoard = forwardRef<HTMLDivElement, ChessBoardProps>(
  function ChessBoard({ board, selected, lastMove, onSquareClick, orientation = 'white', interactive = true }, ref) {
    const isFlipped = orientation === 'black';

    return (
      <div
        ref={ref}
        style={{
          height: '100%',
          width: 'auto',
          aspectRatio: '1/1',
          borderRadius: 10,
          overflow: 'hidden',
          border: '2px solid rgba(0, 245, 255, 0.22)',
          boxShadow: '0 0 0 1px rgba(0,245,255,0.08), 0 8px 32px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.09)',
          flexShrink: 0,
          background: '#0d1321',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            width: '100%',
            height: '100%',
          }}
        >
          {board.map((row, rIdx) => {
            const ri = isFlipped ? 7 - rIdx : rIdx;
            return row.map((_, cIdx) => {
              const ci = isFlipped ? 7 - cIdx : cIdx;
              const piece = board[ri][ci];
              const isLight = (ri + ci) % 2 === 0;
              const isSel = selected?.[0] === ri && selected?.[1] === ci;
              const isFrom = lastMove?.from[0] === ri && lastMove?.from[1] === ci;
              const isTo = lastMove?.to[0] === ri && lastMove?.to[1] === ci;
              const imgSrc = PIECE_IMG[piece];
              const base = isLight ? '#252f48' : '#111827';
              const coordColor = isLight ? 'rgba(0, 245, 255, 0.5)' : 'rgba(0, 245, 255, 0.3)';

              return (
                <div
                  key={`${ri}-${ci}`}
                  onClick={() => interactive && onSquareClick(ri, ci)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: base,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: interactive && (piece !== ' ' || selected) ? 'pointer' : 'default',
                    boxShadow: isSel
                      ? 'inset 0 0 0 3px #00f5ff, inset 0 0 12px rgba(0,245,255,0.5)'
                      : undefined,
                    transition: 'box-shadow 0.12s ease',
                  }}
                >
                  {(isFrom || isTo) && !isSel && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 245, 255, 0.16)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {ci === (isFlipped ? 7 : 0) && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: 3,
                        fontSize: 'clamp(7px, 0.8vw, 11px)',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif',
                        color: coordColor,
                        lineHeight: 1,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: 2,
                      }}
                    >
                      {RANKS[ri]}
                    </span>
                  )}
                  {ri === (isFlipped ? 0 : 7) && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 3,
                        fontSize: 'clamp(7px, 0.8vw, 11px)',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif',
                        color: coordColor,
                        lineHeight: 1,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: 2,
                      }}
                    >
                      {FILES[ci]}
                    </span>
                  )}
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
                        filter:
                          piece === piece.toUpperCase()
                            ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.6)) drop-shadow(0 0 3px rgba(255,255,255,0.12))'
                            : 'drop-shadow(0 1px 4px rgba(0,0,0,0.85))',
                        transform: isSel ? 'scale(1.08) translateY(-1px)' : 'scale(1)',
                        transition: 'transform 0.12s ease',
                      }}
                    />
                  )}
                  {selected && piece === ' ' && !isSel && (
                    <div
                      style={{
                        position: 'absolute',
                        width: 9,
                        height: 9,
                        borderRadius: 99,
                        backgroundColor: 'rgba(0, 245, 255, 0.45)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  }
);
export default ChessBoard;
