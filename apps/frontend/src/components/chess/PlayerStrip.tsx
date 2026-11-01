import type { CSSProperties } from 'react';

interface PlayerStripProps {
  name: string;
  elo: number | string;
  initials: string;
  side: 'white' | 'black';
  clock: string;
  active?: boolean;
  avatarUrl?: string;
  style?: CSSProperties;
}

export const PlayerStrip = ({
  name,
  elo,
  initials,
  side,
  clock,
  active = false,
  avatarUrl,
  style,
}: PlayerStripProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 14px',
        borderRadius: 10,
        flexShrink: 0,
        boxSizing: 'border-box',
        background: active
          ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(0, 245, 255, 0.03))'
          : 'rgba(255, 255, 255, 0.035)',
        border: active
          ? '1px solid rgba(0, 245, 255, 0.35)'
          : '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: active ? '0 0 16px rgba(0, 245, 255, 0.08)' : 'none',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          flexShrink: 0,
          background:
            side === 'black'
              ? 'linear-gradient(135deg, #1e1b4b, #0f172a)'
              : 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
          border:
            side === 'black'
              ? '1px solid rgba(255, 255, 255, 0.16)'
              : '1px solid rgba(0, 245, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 12,
          fontWeight: 900,
          color: '#ffffff',
          boxShadow: side === 'white' ? '0 0 12px rgba(0, 245, 255, 0.3)' : 'none',
          overflow: 'hidden',
        }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          initials
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'rgba(0, 245, 255, 0.7)',
            fontFamily: 'Orbitron, sans-serif',
            letterSpacing: 0.6,
            fontWeight: 700,
            marginTop: 1,
          }}
        >
          ELO {elo}
        </div>
      </div>

      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 15,
          fontWeight: 900,
          color: active ? '#00f5ff' : 'rgba(148, 163, 184, 0.5)',
          background: 'rgba(0, 0, 0, 0.45)',
          border: active
            ? '1px solid rgba(0, 245, 255, 0.45)'
            : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          padding: '5px 12px',
          letterSpacing: 2,
          minWidth: 64,
          textAlign: 'center',
          boxShadow: active ? '0 0 14px rgba(0, 245, 255, 0.25)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {clock}
      </div>
    </div>
  );
};
export default PlayerStrip;
