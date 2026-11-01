import './Loader.css';

interface LoaderProps {
  message?: string;
  fullscreen?: boolean;
}

const ChessKingLoaderIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V5M10 3H14" stroke="url(#loader-kg1)" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 7H16L17.5 17H6.5L8 7Z" stroke="url(#loader-kg2)" strokeWidth="1.5" fill="url(#loader-kgfill)" />
    <path d="M5 21H19V17.5H5V21Z" stroke="url(#loader-kg3)" strokeWidth="1.5" fill="url(#loader-kgfill2)" />
    <defs>
      <linearGradient id="loader-kg1" x1="10" y1="2" x2="14" y2="5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="loader-kg2" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="loader-kg3" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="loader-kgfill" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.25" />
        <stop offset="1" stopColor="#a855f7" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="loader-kgfill2" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#a855f7" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
);

export function Loader({
  message = 'Initializing board',
  fullscreen = true,
}: LoaderProps) {
  return (
    <div
      className={`loader-root${fullscreen ? ' loader-root--fullscreen' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="loader-glow" aria-hidden="true" />

      <div className="loader-icon-container">
        <div className="loader-ring-outer" />
        <div className="loader-ring-inner" />
        <div className="loader-piece">
          <ChessKingLoaderIcon />
        </div>
      </div>

      <div className="loader-title">
        <span className="loader-title-nexus">NEXUS</span>
        <span className="loader-title-chess">CHESS</span>
      </div>

      <div className="loader-message">
        <span>{message}</span>
        <span className="loader-dots">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </span>
      </div>
    </div>
  );
}

export default Loader;