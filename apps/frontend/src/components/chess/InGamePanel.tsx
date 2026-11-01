import { useState, useRef, useEffect } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import type { MoveEntry, ChatMessage, RightTab } from './constants';

interface InGamePanelProps {
  moves?: MoveEntry[];
  currentMoveIndex?: number | null;
  onSelectMove?: (index: number) => void;
  chatMessages?: ChatMessage[];
  onSendMessage?: (msg: string) => void;
  gameInfo?: {
    gameId?: string;
    mode?: string;
    rated?: boolean;
    whitePlayer?: string;
    blackPlayer?: string;
    timeControl?: string;
    status?: string;
  };
  onDraw?: () => void;
  onResign?: () => void;
  onNewGame?: () => void;
}

export const InGamePanel = ({
  moves = [],
  currentMoveIndex = null,
  onSelectMove,
  chatMessages = [],
  onSendMessage,
  gameInfo,
  onDraw,
  onResign,
  onNewGame,
}: InGamePanelProps) => {
  const [activeTab, setActiveTab] = useState<RightTab>('moves');
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage?.(inputText.trim());
    setInputText('');
  };

  const tabButtonStyle = (tab: RightTab): CSSProperties => ({
    flex: 1,
    padding: '9px 6px',
    border: 'none',
    background: activeTab === tab ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
    color: activeTab === tab ? '#00f5ff' : 'rgba(148, 163, 184, 0.55)',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1.2,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    borderRadius: '8px 8px 0 0',
    borderBottom: activeTab === tab ? '2px solid rgba(0, 245, 255, 0.7)' : '2px solid transparent',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top quick action bar */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {[
          { id: 'ig-new', icon: '✚', label: 'New Game', onClick: onNewGame },
          { id: 'ig-games', icon: '♟', label: 'Analysis', onClick: () => {} },
          { id: 'ig-flip', icon: '🔄', label: 'Flip', onClick: () => {} },
        ].map(b => (
          <button
            key={b.id}
            id={b.id}
            onClick={b.onClick}
            style={{
              flex: 1,
              padding: '7px 8px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              color: 'rgba(148, 163, 184, 0.75)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#00f5ff';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 245, 255, 0.3)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 245, 255, 0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(148, 163, 184, 0.75)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.07)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <span style={{ fontSize: 13 }}>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Tabs Header */}
      <div
        style={{
          display: 'flex',
          padding: '6px 14px 0',
          gap: 4,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          flexShrink: 0,
        }}
      >
        {(['moves', 'chat', 'info'] as RightTab[]).map(t => (
          <button
            key={t}
            id={`tab-${t}`}
            onClick={() => setActiveTab(t)}
            style={tabButtonStyle(t)}
          >
            {t === 'moves' ? '⚔ Moves' : t === 'chat' ? '💬 Chat' : 'ℹ Info'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', minHeight: 0 }}>
        {activeTab === 'moves' && (
          <div>
            <div
              style={{
                fontSize: 11.5,
                color: 'rgba(148, 163, 184, 0.7)',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic',
                marginBottom: 10,
                padding: '6px 10px',
                background: 'rgba(255, 255, 255, 0.025)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span>{moves.length > 0 ? 'Standard Chess Match' : 'Opening Move Pending...'}</span>
              <span style={{ fontSize: 10, color: 'rgba(0, 245, 255, 0.6)' }}>ECO B00</span>
            </div>

            {moves.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 10px',
                  color: 'rgba(148, 163, 184, 0.45)',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                No moves played yet. White makes the first move!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {moves.map(m => (
                  <div key={m.moveNum} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: 10.5,
                        color: 'rgba(148, 163, 184, 0.4)',
                        width: 26,
                        textAlign: 'right',
                        flexShrink: 0,
                      }}
                    >
                      {m.moveNum}.
                    </span>

                    {/* White move */}
                    <button
                      onClick={() => onSelectMove?.(m.moveNum * 2 - 2)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: 'none',
                        background: currentMoveIndex === m.moveNum * 2 - 2 ? 'rgba(0, 245, 255, 0.16)' : 'transparent',
                        color: currentMoveIndex === m.moveNum * 2 - 2 ? '#00f5ff' : '#e2e8f0',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => {
                        if (currentMoveIndex !== m.moveNum * 2 - 2) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (currentMoveIndex !== m.moveNum * 2 - 2) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }
                      }}
                    >
                      {m.white}
                    </button>

                    {/* Black move (if played) */}
                    {m.black ? (
                      <button
                        onClick={() => onSelectMove?.(m.moveNum * 2 - 1)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: 'none',
                          background: currentMoveIndex === m.moveNum * 2 - 1 ? 'rgba(0, 245, 255, 0.16)' : 'transparent',
                          color: currentMoveIndex === m.moveNum * 2 - 1 ? '#00f5ff' : '#e2e8f0',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                          if (currentMoveIndex !== m.moveNum * 2 - 1) {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (currentMoveIndex !== m.moveNum * 2 - 1) {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                          }
                        }}
                      >
                        {m.black}
                      </button>
                    ) : (
                      <span style={{ flex: 1 }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                paddingRight: 4,
              }}
            >
              {chatMessages.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    color: 'rgba(148, 163, 184, 0.45)',
                    fontSize: 11.5,
                  }}
                >
                  No messages yet. Say hi and have fun!
                </div>
              ) : (
                chatMessages.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: c.you ? 'row-reverse' : 'row',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '8px 12px',
                        borderRadius: 10,
                        background: c.you ? 'rgba(0, 245, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        border: c.you
                          ? '1px solid rgba(0, 245, 255, 0.25)'
                          : '1px solid rgba(255, 255, 255, 0.07)',
                        fontSize: 12,
                        color: '#e2e8f0',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {!c.you && (
                        <div
                          style={{
                            fontSize: 9.5,
                            color: 'rgba(0, 245, 255, 0.7)',
                            marginBottom: 3,
                            fontFamily: 'Orbitron, sans-serif',
                          }}
                        >
                          {c.who}
                        </div>
                      )}
                      <div>{c.msg}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSendChat}
              style={{ marginTop: 10, display: 'flex', gap: 6 }}
            >
              <input
                id="game-chat-input"
                type="text"
                placeholder="Say something to opponent..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                id="game-chat-send-btn"
                style={{
                  padding: '0 14px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Game ID', gameInfo?.gameId || 'live-match'],
              ['Mode', gameInfo?.mode || 'Online 3+0'],
              ['Rated', gameInfo?.rated ? 'Yes' : 'Casual'],
              ['White', gameInfo?.whitePlayer || 'Player 1'],
              ['Black', gameInfo?.blackPlayer || 'Opponent'],
              ['Status', gameInfo?.status || 'In Progress'],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    color: 'rgba(148, 163, 184, 0.5)',
                    fontFamily: 'Orbitron, sans-serif',
                    letterSpacing: 0.8,
                  }}
                >
                  {l}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#e2e8f0',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move step navigations */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {[
          { id: 'nav-first', icon: '⏮', t: 'First Move' },
          { id: 'nav-prev', icon: '◀', t: 'Previous Move' },
          { id: 'nav-next', icon: '▶', t: 'Next Move' },
          { id: 'nav-last', icon: '⏭', t: 'Current Move' },
        ].map(b => (
          <button
            key={b.id}
            id={b.id}
            title={b.t}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.035)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              color: 'rgba(148, 163, 184, 0.65)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#00f5ff';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 245, 255, 0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(148, 163, 184, 0.65)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.07)';
            }}
          >
            {b.icon}
          </button>
        ))}
      </div>

      {/* Bottom Resign & Draw buttons */}
      <div
        style={{
          padding: '10px 14px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <button
          id="play-draw-btn"
          onClick={onDraw}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 9,
            border: '1px solid rgba(245, 158, 11, 0.35)',
            background: 'rgba(245, 158, 11, 0.08)',
            color: '#f59e0b',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 1.2,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(245, 158, 11, 0.18)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245, 158, 11, 0.6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(245, 158, 11, 0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245, 158, 11, 0.35)';
          }}
        >
          ½ Offer Draw
        </button>

        <button
          id="play-resign-btn"
          onClick={onResign}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: 9,
            border: '1px solid rgba(239, 68, 68, 0.35)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 1.2,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.18)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239, 68, 68, 0.6)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239, 68, 68, 0.35)';
          }}
        >
          ⚑ Resign
        </button>
      </div>
    </div>
  );
};
export default InGamePanel;
