import { useState } from 'react';
import { useToast } from './Toast';

interface ShareGameProps {
  gameId: string;
}

export function ShareGame({ gameId }: ShareGameProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const url = gameId ? `${window.location.origin}/play?gameId=${gameId}` : '';

  const copyToClipboard = async () => {
    if (!url) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2200);

      toast({
        title: 'Link copied!',
        description: 'You can now share this game link with your friend.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Failed to copy game link:', err);
      toast({
        title: 'Copy failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '14px 16px',
        borderRadius: 12,
        background: 'rgba(0, 245, 255, 0.04)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        boxShadow: '0 0 20px rgba(0, 245, 255, 0.05)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10.5,
            color: 'rgba(0, 245, 255, 0.8)',
            letterSpacing: 1.2,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Share Game Link
        </span>
        {gameId && (
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 10.5,
              color: 'rgba(148, 163, 184, 0.65)',
            }}
          >
            ID: <strong style={{ color: '#00f5ff' }}>{gameId.slice(0, 8)}...</strong>
          </span>
        )}
      </div>

      {/* URL bar & Copy button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        <input
          type="text"
          readOnly
          value={url || 'Generating link...'}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 8,
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(226, 232, 240, 0.85)',
            fontSize: 11.5,
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        />

        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!gameId}
          style={{
            padding: '9px 14px',
            borderRadius: 8,
            border: copied ? '1px solid rgba(34, 197, 94, 0.6)' : '1px solid rgba(0, 245, 255, 0.5)',
            background: copied
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.15))'
              : 'linear-gradient(135deg, rgba(0, 245, 255, 0.25), rgba(168, 85, 247, 0.25))',
            color: copied ? '#22c55e' : '#ffffff',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            fontWeight: 800,
            cursor: gameId ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: copied ? '0 0 14px rgba(34, 197, 94, 0.3)' : '0 0 14px rgba(0, 245, 255, 0.2)',
          }}
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

export default ShareGame;