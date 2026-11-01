import { useEffect, useState } from 'react';
import { TIME_CONTROLS, LOBBY_OPTIONS, INIT_GAME, GAME_ADDED } from './constants';
import { useSocket } from '../../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import ShareGame from '../ShareGame';

interface SetupPanelProps {
  mode?: string;
  inviteGameId?: string | null;
  onStartGame: (timeControl: string) => void;
  onBack: () => void;
  isSearching?: boolean;
}

export const SetupPanel = ({
  mode = 'online',
  inviteGameId = null,
  onStartGame,
  onBack,
  isSearching = false,
}: SetupPanelProps) => {
  const [selectedTime, setSelectedTime] = useState<string>('3+0');
  const [localSearching, setLocalSearching] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string>('');
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        const type = message.type;
        const incomingGameId = message.gameId || message.payload?.gameId;

        if (type === INIT_GAME) {
          console.log('Game started! Both players connected:', message);
          const activeGameId = message.payload?.gameId || incomingGameId;
          if (activeGameId) {
            navigate(`/game/${activeGameId}?tc=${encodeURIComponent(selectedTime)}&mode=${mode}`);
          }
        } else if (type === GAME_ADDED) {
          setLocalSearching(true);
          if (incomingGameId) {
            setGameId(incomingGameId);
          }
        } else if (type === 'game_alert') {
          setLocalSearching(false);
          alert(message.payload?.message || 'Matchmaking notice');
        } else {
          console.log('Socket message in SetupPanel:', message);
        }
      } catch (err) {
        console.error('Error parsing socket message in SetupPanel:', err);
      }
    };

    socket.addEventListener('message', messageHandler);
    return () => {
      socket.removeEventListener('message', messageHandler);
    };
  }, [socket, navigate, selectedTime, mode]);

  const currentOption = LOBBY_OPTIONS.find(o => o.id === mode) || {
    id: mode,
    mode: mode,
    icon: '⚡',
    label: `Play ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
    sub: 'Setup your match preferences',
    color: '#00f5ff',
    glow: 'rgba(0,245,255,0.25)',
  };

  const handleStart = () => {
    setLocalSearching(true);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: INIT_GAME,
          ...(inviteGameId ? { gameId: inviteGameId } : {}),
        })
      );
    }
    onStartGame(selectedTime);
  };

  const searching = isSearching || localSearching;

  const getTimeLabel = (val: string) => {
    switch (val) {
      case '1+0': return '1 min (Bullet)';
      case '3+0': return '3 min (Blitz)';
      case '5+0': return '5 min (Blitz)';
      case '10+0': return '10 min (Rapid)';
      default: return `${val} (Custom)`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header with Back button and mode title */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          background: 'rgba(255, 255, 255, 0.015)',
        }}
      >
        <button
          id="setup-back-btn"
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(226, 232, 240, 0.85)',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.14)';
            (e.currentTarget as HTMLElement).style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.06)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(226, 232, 240, 0.85)';
          }}
        >
          <span>←</span> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 18 }}>{currentOption.icon}</span>
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 14,
              fontWeight: 800,
              color: currentOption.color,
              letterSpacing: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentOption.label}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div
        style={{
          flex: 1,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {/* Time Control Header */}
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10.5,
            color: 'rgba(0, 245, 255, 0.75)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Select Time Control
        </div>

        {/* Selected preview bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 11,
            background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.12), rgba(0, 245, 255, 0.03))',
            border: '1.5px solid rgba(0, 245, 255, 0.35)',
            boxShadow: '0 0 16px rgba(0, 245, 255, 0.1)',
          }}
        >
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 14,
              fontWeight: 800,
              color: '#00f5ff',
              letterSpacing: 0.5,
            }}
          >
            ⚡ {getTimeLabel(selectedTime)}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(0, 245, 255, 0.5)' }}>▼</span>
        </div>

        {/* Time Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {TIME_CONTROLS.map(tc => {
            const isActive = selectedTime === tc.val;
            return (
              <button
                key={tc.val}
                id={`time-control-${tc.val.replace('+', '_')}`}
                onClick={() => setSelectedTime(tc.val)}
                style={{
                  padding: '12px 6px',
                  borderRadius: 10,
                  border: isActive
                    ? '1.5px solid rgba(0, 245, 255, 0.65)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.22), rgba(0, 245, 255, 0.06))'
                    : 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 18px rgba(0, 245, 255, 0.25)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 18,
                    fontWeight: 900,
                    color: isActive ? '#00f5ff' : '#f1f5f9',
                  }}
                >
                  {tc.label}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: isActive ? '#00f5ff' : 'rgba(148, 163, 184, 0.65)',
                    fontFamily: 'Inter, sans-serif',
                    marginTop: 3,
                    fontWeight: 600,
                  }}
                >
                  {tc.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Game Action Button & Share Section */}
        {searching ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              id="setup-searching-status"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: 12,
                border: '1px solid rgba(0, 245, 255, 0.45)',
                background: 'rgba(0, 245, 255, 0.1)',
                color: '#ffffff',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>⏳</span>
              Finding Opponent...
            </div>

            <ShareGame gameId={gameId} />

            <button
              id="setup-cancel-search-btn"
              onClick={() => setLocalSearching(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s ease',
              }}
            >
              ✕ Cancel Matchmaking
            </button>
          </div>
        ) : (
          <button
            id="setup-start-game-btn"
            onClick={handleStart}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #00d2df, #8b5cf6)',
              color: '#ffffff',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 13.5,
              fontWeight: 800,
              letterSpacing: 1.5,
              cursor: 'pointer',
              boxShadow: '0 0 28px rgba(0, 245, 255, 0.35)',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxSizing: 'border-box',
            }}
          >
            <span>⚡</span> {inviteGameId ? 'Join Match Now' : 'Start Game'}
          </button>
        )}

        {/* Additional Mode Challenge Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {[
            { id: 'opt-custom', icon: '🎯', label: 'Custom Challenge', sub: 'Create custom rules & rating' },
            { id: 'opt-friend', icon: '👥', label: 'Play a Friend', sub: 'Send an invite link to anyone' },
            { id: 'opt-tourney', icon: '🏆', label: 'Tournaments', sub: 'Join official arena tourneys' },
          ].map(o => (
            <button
              key={o.id}
              id={o.id}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 11,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: '#e2e8f0',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 245, 255, 0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <span style={{ fontSize: 20 }}>{o.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{o.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(148, 163, 184, 0.6)', marginTop: 2 }}>{o.sub}</div>
              </div>
              <span style={{ color: 'rgba(148, 163, 184, 0.4)', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
          background: 'rgba(0,0,0,0.15)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 99,
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', fontFamily: 'Inter,sans-serif' }}>
          <strong style={{ color: '#22c55e' }}>182,351</strong> players ready in queue
        </span>
      </div>
    </div>
  );
};
export default SetupPanel;
