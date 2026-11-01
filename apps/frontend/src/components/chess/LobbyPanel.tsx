import { useState } from 'react';
import { LOBBY_OPTIONS } from './constants';
import type { LobbyOption } from './constants';

interface LobbyPanelProps {
  onSelectMode: (modeId: string) => void;
  activeCount?: number;
  dailyGamesCount?: string;
}

export const LobbyPanel: React.FC<LobbyPanelProps> = ({
  onSelectMode,
  activeCount = 182351,
  dailyGamesCount = '24M',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '18px 22px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0,
          background: 'rgba(255, 255, 255, 0.015)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.22), rgba(168, 85, 247, 0.22))',
              border: '1.5px solid rgba(0, 245, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 0 18px rgba(0, 245, 255, 0.18)',
            }}
          >
            ♟
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 15,
                fontWeight: 800,
                color: '#f8fafc',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Play Chess
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'rgba(0, 245, 255, 0.7)',
                fontFamily: 'Inter, sans-serif',
                marginTop: 3,
              }}
            >
              Choose your game mode to get started
            </div>
          </div>
        </div>
      </div>

      {/* Lobby Options List */}
      <div
        style={{
          flex: 1,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {LOBBY_OPTIONS.map((opt: LobbyOption) => {
          const isHov = hoveredId === opt.id;
          return (
            <button
              key={opt.id}
              id={`play-mode-${opt.id}`}
              onClick={() => onSelectMode(opt.id)}
              onMouseEnter={() => setHoveredId(opt.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: 12,
                border: isHov ? `1px solid ${opt.color}80` : '1px solid rgba(255, 255, 255, 0.08)',
                background: isHov
                  ? `linear-gradient(135deg, ${opt.color}18, rgba(255, 255, 255, 0.03))`
                  : 'rgba(255, 255, 255, 0.025)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHov ? 'translateX(5px)' : 'none',
                textAlign: 'left',
                boxShadow: isHov ? `0 6px 22px ${opt.glow}, 0 0 1px ${opt.color}` : 'none',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${opt.color}25, ${opt.color}0a)`,
                  border: `1.5px solid ${opt.color}45`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: isHov ? `0 0 14px ${opt.glow}` : 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  transform: isHov ? 'scale(1.08)' : 'none',
                }}
              >
                {opt.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: isHov ? opt.color : '#f1f5f9',
                    letterSpacing: 0.3,
                    transition: 'color 0.18s ease',
                  }}
                >
                  {opt.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isHov ? 'rgba(226, 232, 240, 0.88)' : 'rgba(148, 163, 184, 0.65)',
                    fontFamily: 'Inter, sans-serif',
                    marginTop: 2,
                    lineHeight: 1.35,
                  }}
                >
                  {opt.sub}
                </div>
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: opt.color,
                  opacity: isHov ? 1 : 0.4,
                  transform: isHov ? 'translateX(3px)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                ›
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          flexShrink: 0,
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: '#22c55e',
            boxShadow: '0 0 10px #22c55e',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: 11.5, color: 'rgba(148, 163, 184, 0.7)', fontFamily: 'Inter, sans-serif' }}>
          <strong style={{ color: '#22c55e' }}>{activeCount.toLocaleString()}</strong> playing online · {dailyGamesCount} games today
        </span>
      </div>
    </div>
  );
};
export default LobbyPanel;
