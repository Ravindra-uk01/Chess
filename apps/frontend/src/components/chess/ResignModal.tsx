interface ResignModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const ResignModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Resign Game?',
  description = 'Are you sure you want to resign this match? This will count as a loss in your rating.',
}: ResignModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(5, 8, 30, 0.96)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 14,
          padding: '24px 28px',
          textAlign: 'center',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.16), 0 20px 60px rgba(0, 0, 0, 0.85)',
          maxWidth: 320,
          width: '90%',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚑</div>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 14,
            fontWeight: 800,
            color: '#ef4444',
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(148, 163, 184, 0.7)',
            fontFamily: 'Inter, sans-serif',
            marginBottom: 20,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            id="resign-confirm-btn"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 8,
              border: '1px solid rgba(239, 68, 68, 0.5)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 1,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Yes, Resign
          </button>
          <button
            id="resign-cancel-btn"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(148, 163, 184, 0.85)',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: 1,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResignModal;
