import { useState, useCallback } from 'react';

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

type GameMode = 'online' | 'bot' | 'friend' | 'tournament' | 'variants' | null;
type RightTab  = 'moves' | 'chat' | 'info';
interface MoveEntry { moveNum: number; white: string; black: string; }

const LOBBY_OPTIONS = [
  { id: 'online',     mode: 'online'     as GameMode, icon: '⚡', label: 'Play Online',    sub: 'Play vs a person of similar skill',   color: '#00f5ff', glow: 'rgba(0,245,255,0.25)' },
  { id: 'bot',        mode: 'bot'        as GameMode, icon: '🤖', label: 'Play Bots',      sub: 'Challenge a bot from Easy to Master', color: '#a855f7', glow: 'rgba(168,85,247,0.25)' },
  { id: 'friend',     mode: 'friend'     as GameMode, icon: '👥', label: 'Play a Friend',  sub: 'Invite a friend to a game of chess',  color: '#22c55e', glow: 'rgba(34,197,94,0.25)' },
  { id: 'tournament', mode: 'tournament' as GameMode, icon: '🏆', label: 'Tournaments',    sub: 'Join an Arena where anyone can win',  color: '#f97316', glow: 'rgba(249,115,22,0.25)' },
  { id: 'variants',   mode: 'variants'   as GameMode, icon: '♟', label: 'Chess Variants', sub: 'Find fun new ways to play chess',     color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
];
const TIME_CONTROLS = [
  { label: '1',  sub: 'Bullet', val: '1+0'  },
  { label: '3',  sub: 'Blitz',  val: '3+0'  },
  { label: '5',  sub: 'Blitz',  val: '5+0'  },
  { label: '10', sub: 'Rapid',  val: '10+0' },
];
const SAMPLE_MOVES: MoveEntry[] = [
  { moveNum: 1, white: 'e4',  black: 'e5'  },
  { moveNum: 2, white: 'Nf3', black: 'Nc6' },
  { moveNum: 3, white: 'Bb5', black: 'a6'  },
  { moveNum: 4, white: 'Ba4', black: 'Nf6' },
];

// KEY: Board is HEIGHT-driven (height:100%, width:auto, aspectRatio:1/1)
// so it never causes vertical viewport overflow.
function ChessBoard({ board, selected, lastMove, onSquareClick }: {
  board: string[][];
  selected: [number,number] | null;
  lastMove: { from: [number,number]; to: [number,number] } | null;
  onSquareClick: (ri: number, ci: number) => void;
}) {
  return (
    <div style={{ height: '100%', width: 'auto', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', border: '2px solid rgba(0,245,255,0.2)', boxShadow: '0 0 0 1px rgba(0,245,255,0.06),0 8px 32px rgba(0,0,0,0.6),0 0 28px rgba(0,245,255,0.08)', flexShrink: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gridTemplateRows: 'repeat(8,1fr)', width: '100%', height: '100%' }}>
        {board.map((row, ri) => row.map((piece, ci) => {
          const isLight = (ri + ci) % 2 === 0;
          const isSel   = selected?.[0] === ri && selected?.[1] === ci;
          const isFrom  = lastMove?.from[0] === ri && lastMove?.from[1] === ci;
          const isTo    = lastMove?.to[0]   === ri && lastMove?.to[1]   === ci;
          const imgSrc  = PIECE_IMG[piece];
          const base    = isLight ? '#252f48' : '#111827';
          const coord   = isLight ? 'rgba(0,245,255,0.45)' : 'rgba(0,245,255,0.28)';
          return (
            <div key={`${ri}-${ci}`} onClick={() => onSquareClick(ri, ci)}
              style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: base, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: piece !== ' ' || selected ? 'pointer' : 'default', boxShadow: isSel ? 'inset 0 0 0 3px #00f5ff,inset 0 0 12px rgba(0,245,255,0.5)' : undefined, transition: 'box-shadow 0.12s' }}
            >
              {(isFrom || isTo) && !isSel && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,245,255,0.16)', pointerEvents: 'none' }}/>}
              {ci === 0 && <span style={{ position: 'absolute', top: 2, left: 3, fontSize: 'clamp(6px,0.75vw,10px)', fontWeight: 700, fontFamily: 'Inter,sans-serif', color: coord, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', zIndex: 2 }}>{RANKS[ri]}</span>}
              {ri === 7 && <span style={{ position: 'absolute', bottom: 2, right: 3, fontSize: 'clamp(6px,0.75vw,10px)', fontWeight: 700, fontFamily: 'Inter,sans-serif', color: coord, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', zIndex: 2 }}>{FILES[ci]}</span>}
              {imgSrc && <img src={imgSrc} alt={piece} draggable={false} style={{ width: '82%', height: '82%', objectFit: 'contain', zIndex: 1, filter: piece === piece.toUpperCase() ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.6)) drop-shadow(0 0 3px rgba(255,255,255,0.1))' : 'drop-shadow(0 1px 4px rgba(0,0,0,0.8))', transform: isSel ? 'scale(1.08) translateY(-1px)' : 'scale(1)', transition: 'transform 0.12s' }}/>}
              {selected && piece === ' ' && !isSel && <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: 99, backgroundColor: 'rgba(0,245,255,0.4)', pointerEvents: 'none', zIndex: 2 }}/>}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function Strip({ name, elo, initials, side, clock, active }: { name: string; elo: number; initials: string; side: 'white'|'black'; clock: string; active?: boolean; }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 8, flexShrink: 0, background: active ? 'linear-gradient(135deg,rgba(0,245,255,0.07),rgba(0,245,255,0.02))' : 'rgba(255,255,255,0.025)', border: active ? '1px solid rgba(0,245,255,0.18)' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: side === 'black' ? 'linear-gradient(135deg,#1a1a2e,#16213e)' : 'linear-gradient(135deg,#00c8d4,#7c3aed)', border: side === 'black' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,245,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 900, color: '#fff' }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.55)', fontFamily: 'Orbitron,sans-serif', letterSpacing: 0.5 }}>ELO {elo}</div>
      </div>
      <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 14, fontWeight: 900, color: active ? '#00f5ff' : 'rgba(148,163,184,0.4)', background: 'rgba(0,0,0,0.35)', border: active ? '1px solid rgba(0,245,255,0.25)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '3px 10px', letterSpacing: 2, minWidth: 58, textAlign: 'center', boxShadow: active ? '0 0 10px rgba(0,245,255,0.15)' : 'none', transition: 'all 0.3s' }}>{clock}</div>
    </div>
  );
}

function LobbyPanel({ onSelect }: { onSelect: (m: GameMode) => void }) {
  const [hov, setHov] = useState<string|null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '12px 14px 9px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,rgba(0,245,255,0.18),rgba(168,85,247,0.18))', border: '1px solid rgba(0,245,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♟</div>
          <div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700, color: '#e2e8f0', letterSpacing: 1 }}>Play Chess</div>
            <div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', fontFamily: 'Inter,sans-serif' }}>Choose your game mode</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '7px 10px', display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', minHeight: 0 }}>
        {LOBBY_OPTIONS.map(opt => {
          const h = hov === opt.id;
          return (
            <button key={opt.id} id={`play-mode-${opt.id}`}
              onClick={() => onSelect(opt.mode)}
              onMouseEnter={() => setHov(opt.id)} onMouseLeave={() => setHov(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, border: h ? `1px solid ${opt.color}44` : '1px solid rgba(255,255,255,0.06)', background: h ? `${opt.color}0e` : 'rgba(255,255,255,0.025)', cursor: 'pointer', transition: 'all 0.18s', transform: h ? 'translateX(2px)' : 'none', textAlign: 'left', boxShadow: h ? `0 0 14px ${opt.glow}` : 'none', flexShrink: 0 }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `${opt.color}12`, border: `1px solid ${opt.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{opt.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 700, color: h ? opt.color : '#e2e8f0', transition: 'color 0.18s' }}>{opt.label}</div>
                <div style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', fontFamily: 'Inter,sans-serif', marginTop: 1 }}>{opt.sub}</div>
              </div>
              <span style={{ fontSize: 14, color: opt.color, opacity: h ? 0.8 : 0.3 }}>›</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '6px 12px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: '#22c55e', boxShadow: '0 0 5px #22c55e', display: 'inline-block' }}/>
        <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.45)', fontFamily: 'Inter,sans-serif' }}><span style={{ color: '#22c55e', fontWeight: 700 }}>182,351</span> playing · 24M games today</span>
      </div>
    </div>
  );
}

function SetupPanel({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const [t, setT]   = useState('3+0');
  const [s, setS]   = useState(false);
  const go = () => { setS(true); setTimeout(() => { setS(false); onStart(); }, 2200); };
  const lbl = t==='1+0'?'1 min (Bullet)':t==='3+0'?'3 min (Blitz)':t==='5+0'?'5 min (Blitz)':'10 min (Rapid)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.7)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 10, fontFamily: 'Inter,sans-serif' }}>← Back</button>
        <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700, color: '#00f5ff', letterSpacing: 1 }}>⚡ Play Online</div>
      </div>
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', minHeight: 0 }}>
        <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 8, color: 'rgba(148,163,184,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}>Time Control</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 11px', borderRadius: 8, background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.18)' }}>
          <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700, color: '#00f5ff' }}>⚡ {lbl}</span>
          <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.35)' }}>▼</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
          {TIME_CONTROLS.map(tc => {
            const a = t === tc.val;
            return (
              <button key={tc.val} onClick={() => setT(tc.val)} style={{ padding: '7px 4px', borderRadius: 7, border: a ? '1px solid rgba(0,245,255,0.45)' : '1px solid rgba(255,255,255,0.07)', background: a ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.15s', boxShadow: a ? '0 0 12px rgba(0,245,255,0.12)' : 'none' }}>
                <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 14, fontWeight: 900, color: a ? '#00f5ff' : '#e2e8f0' }}>{tc.label}</div>
                <div style={{ fontSize: 8, color: 'rgba(148,163,184,0.5)', fontFamily: 'Inter,sans-serif', marginTop: 1 }}>{tc.sub}</div>
              </button>
            );
          })}
        </div>
        <button id="play-start-game-btn" onClick={go} disabled={s}
          style={{ width: '100%', padding: '11px', borderRadius: 9, border: s ? '1px solid rgba(0,245,255,0.3)' : 'none', background: s ? 'rgba(0,245,255,0.08)' : 'linear-gradient(135deg,#00c8d4,#7c3aed)', color: s ? '#00f5ff' : '#fff', fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 1.2, cursor: s ? 'not-allowed' : 'pointer', boxShadow: s ? 'none' : '0 0 22px rgba(0,245,255,0.22)', transition: 'all 0.2s' } as React.CSSProperties}
        >{s ? '🔍 Finding Opponent...' : '⚡ Start Game'}</button>
        {[{id:'play-custom-btn',icon:'🎯',label:'Custom Challenge'},{id:'play-friend-btn',icon:'👥',label:'Play a Friend'},{id:'play-tourney-btn',icon:'🏆',label:'Tournaments'}].map(o => (
          <button key={o.id} id={o.id} style={{ width: '100%', padding: '8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', color: 'rgba(148,163,184,0.65)', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.65)'; }}
          >{o.icon} {o.label}</button>
        ))}
      </div>
      <div style={{ padding: '6px 12px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: 99, background: '#22c55e', boxShadow: '0 0 5px #22c55e', display: 'inline-block' }}/>
        <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.4)', fontFamily: 'Inter,sans-serif' }}><span style={{ color: '#22c55e', fontWeight: 700 }}>182,351</span> playing now</span>
      </div>
    </div>
  );
}

function InGame({ onResign, onDraw }: { onResign: () => void; onDraw: () => void }) {
  const [tab, setTab] = useState<RightTab>('moves');
  const [idx, setIdx] = useState<number|null>(null);
  const ts = (id: RightTab): React.CSSProperties => ({ flex: 1, padding: '5px 4px', border: 'none', background: tab===id ? 'rgba(0,245,255,0.08)' : 'transparent', color: tab===id ? '#00f5ff' : 'rgba(148,163,184,0.45)', fontFamily: 'Orbitron,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 0.8, cursor: 'pointer', transition: 'all 0.15s', borderRadius: '6px 6px 0 0', borderBottom: tab===id ? '2px solid rgba(0,245,255,0.5)' : '2px solid transparent' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 5, flexShrink: 0 }}>
        {[{id:'ig-new',icon:'✚',label:'New'},{id:'ig-games',icon:'♟',label:'Games'},{id:'ig-players',icon:'👤',label:'Players'}].map(b => (
          <button key={b.id} id={b.id} style={{ flex: 1, padding: '5px 4px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.5)', fontFamily: 'Inter,sans-serif', fontSize: 9, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00f5ff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
          ><span style={{ fontSize: 11 }}>{b.icon}</span><span>{b.label}</span></button>
        ))}
      </div>
      <div style={{ display: 'flex', padding: '5px 10px 0', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        {(['moves','chat','info'] as RightTab[]).map(t => <button key={t} onClick={() => setTab(t)} style={ts(t)}>{t[0].toUpperCase()+t.slice(1)}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '7px 10px', minHeight: 0 }}>
        {tab === 'moves' && (
          <div>
            <div style={{ fontSize: 9, color: 'rgba(148,163,184,0.4)', fontFamily: 'Inter,sans-serif', fontStyle: 'italic', marginBottom: 5, padding: '3px 6px', background: 'rgba(255,255,255,0.02)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Ruy Lopez</span><span style={{ fontSize: 8, color: 'rgba(0,245,255,0.35)' }}>ℹ</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {SAMPLE_MOVES.map(m => (
                <div key={m.moveNum} style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 9, color: 'rgba(148,163,184,0.28)', width: 18, textAlign: 'right', flexShrink: 0 }}>{m.moveNum}.</span>
                  {[{move:m.white,i:m.moveNum*2-2},{move:m.black,i:m.moveNum*2-1}].map(({move,i}) => (
                    <button key={i} onClick={() => setIdx(i)} style={{ flex: 1, padding: '4px 6px', borderRadius: 5, border: 'none', background: idx===i ? 'rgba(0,245,255,0.14)' : 'transparent', color: idx===i ? '#00f5ff' : '#e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.12s', textAlign: 'left' }}
                      onMouseEnter={e => { if(idx!==i)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { if(idx!==i)(e.currentTarget as HTMLElement).style.background='transparent'; }}
                    >{move}</button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[{who:'AlphaZero_X',msg:'gl hf!',you:false},{who:'You',msg:'gl hf!',you:true}].map((c,i) => (
              <div key={i} style={{ display: 'flex', flexDirection: c.you?'row-reverse':'row', gap: 6 }}>
                <div style={{ maxWidth: '75%', padding: '6px 10px', borderRadius: 9, background: c.you?'rgba(0,245,255,0.09)':'rgba(255,255,255,0.04)', border: c.you?'1px solid rgba(0,245,255,0.18)':'1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#e2e8f0', fontFamily: 'Inter,sans-serif' }}>
                  {!c.you&&<div style={{ fontSize: 9, color: 'rgba(0,245,255,0.5)', marginBottom: 2, fontFamily: 'Orbitron,sans-serif' }}>{c.who}</div>}
                  {c.msg}
                </div>
              </div>
            ))}
            <input placeholder="Say something..." style={{ marginTop: 6, width: '100%', padding: '7px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontFamily: 'Inter,sans-serif', fontSize: 11, outline: 'none', boxSizing: 'border-box' }}/>
          </div>
        )}
        {tab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[['Mode','Blitz 3+0'],['Rated','Yes'],['White','Ravindrauk01 (1247)'],['Black','AlphaZero_X (1304)'],['Started','Just now']].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.38)', fontFamily: 'Orbitron,sans-serif', letterSpacing: 0.6 }}>{l}</span>
                <span style={{ fontSize: 11, color: '#e2e8f0', fontFamily: 'Inter,sans-serif', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '5px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0 }}>
        {[{id:'nav-first',icon:'⏮',t:'First'},{id:'nav-prev',icon:'◀',t:'Prev'},{id:'nav-next',icon:'▶',t:'Next'},{id:'nav-last',icon:'⏭',t:'Last'}].map(b => (
          <button key={b.id} id={b.id} title={b.t} style={{ width: 30, height: 30, borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.5)', fontSize: 10, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00f5ff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.25)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >{b.icon}</button>
        ))}
      </div>
      <div style={{ padding: '7px 10px 9px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 6, flexShrink: 0 }}>
        <button id="play-draw-btn" onClick={onDraw} style={{ flex: 1, padding: '7px', borderRadius: 7, border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.06)', color: '#f59e0b', fontFamily: 'Orbitron,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.14)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.25)'; }}
        >½ Draw</button>
        <button id="play-resign-btn" onClick={onResign} style={{ flex: 1, padding: '7px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontFamily: 'Orbitron,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.18s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.14)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.25)'; }}
        >⚑ Resign</button>
      </div>
    </div>
  );
}

type Phase = 'lobby' | 'setup' | 'playing';

export default function Play() {
  const [phase,     setPhase]     = useState<Phase>('lobby');
  const [board,     setBoard]     = useState(() => INITIAL_BOARD.map(r => [...r]));
  const [selected,  setSelected]  = useState<[number,number]|null>(null);
  const [lastMove,  setLastMove]  = useState<{from:[number,number];to:[number,number]}|null>({ from:[6,4], to:[4,4] });
  const [showResign, setShowResign] = useState(false);

  const onSquare = useCallback((ri: number, ci: number) => {
    if (phase !== 'playing') return;
    const piece = board[ri][ci];
    if (selected) {
      const [sri, sci] = selected;
      if (sri===ri && sci===ci) { setSelected(null); return; }
      const sw = board[sri][sci]!==''&&board[sri][sci]===board[sri][sci].toUpperCase();
      const tw = piece!==''&&piece===piece.toUpperCase();
      if (sw&&tw) { setSelected([ri,ci]); return; }
      const nb = board.map(r=>[...r]);
      nb[ri][ci]=board[sri][sci]; nb[sri][sci]=' ';
      setBoard(nb); setLastMove({from:[sri,sci],to:[ri,ci]}); setSelected(null);
    } else { if (piece!==' ') setSelected([ri,ci]); }
  }, [board, selected, phase]);

  const startGame = () => { setBoard(INITIAL_BOARD.map(r=>[...r])); setSelected(null); setLastMove(null); setPhase('playing'); };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: 'hsl(222,47%,5%)', position: 'relative', fontFamily: 'Inter,system-ui,sans-serif', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 55% 40% at 15% 15%,rgba(0,245,255,0.05) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 85% 80%,rgba(168,85,247,0.06) 0%,transparent 60%)' }}/>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.28, backgroundImage: 'linear-gradient(rgba(0,245,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.035) 1px,transparent 1px)', backgroundSize: '48px 48px' }}/>
      <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: 'rgba(148,163,184,0.45)', textTransform: 'uppercase' }}>Play</div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }}/>
          {phase==='playing'&&<div style={{ display:'flex',alignItems:'center',gap:5 }}><span style={{ width:6,height:6,borderRadius:99,background:'#22c55e',boxShadow:'0 0 6px #22c55e',display:'inline-block',animation:'play-pulse 2s ease-in-out infinite' }}/><span style={{ fontFamily:'Orbitron,sans-serif',fontSize:9,color:'#22c55e',letterSpacing:1 }}>LIVE</span></div>}
        </div>
        {/* 2-col — flex:1 + minHeight:0 fills remaining viewport without overflow */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 14, alignItems: 'stretch', overflow: 'hidden' }}>
          {/* Board column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
            <Strip name="AlphaZero_X" elo={1304} initials="AZ" side="black" clock="3:00" active={phase==='playing'} />
            {/* Board wrapper: flex:1 + minHeight:0 = board gets all remaining vertical space */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <ChessBoard board={board} selected={selected} lastMove={lastMove} onSquareClick={onSquare} />
            </div>
            <Strip name="Ravindrauk01 🇮🇳" elo={1247} initials="R" side="white" clock="3:00" active={false} />
          </div>
          {/* Right panel */}
          <div style={{ width: 265, flexShrink: 0, background: 'rgba(5,8,30,0.78)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,245,255,0.08)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {phase==='lobby'   && <LobbyPanel onSelect={m => setPhase(m==='online'?'setup':'setup')} />}
            {phase==='setup'   && <SetupPanel onStart={startGame} onBack={()=>setPhase('lobby')} />}
            {phase==='playing' && <InGame onResign={()=>setShowResign(true)} onDraw={()=>{}} />}
          </div>
        </div>
      </div>
      {showResign && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(5,8,30,0.96)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, padding: '24px 28px', textAlign: 'center', boxShadow: '0 0 50px rgba(239,68,68,0.14),0 20px 60px rgba(0,0,0,0.8)', maxWidth: 260 }}>
            <div style={{ fontSize: 30, marginBottom: 7 }}>⚑</div>
            <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 12, fontWeight: 700, color: '#ef4444', letterSpacing: 1, marginBottom: 5 }}>Resign?</div>
            <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.55)', fontFamily: 'Inter,sans-serif', marginBottom: 16 }}>Are you sure you want to resign?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button id="resign-confirm-btn" onClick={()=>{setShowResign(false);setPhase('lobby');}} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontFamily: 'Orbitron,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>Yes, Resign</button>
              <button id="resign-cancel-btn" onClick={()=>setShowResign(false)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(148,163,184,0.7)', fontFamily: 'Orbitron,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes play-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
