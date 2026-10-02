import { useState } from 'react';
import './Login.css';

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const ChessKingIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V5M10 3H14" stroke="url(#kg1)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 7H16L17.5 17H6.5L8 7Z" stroke="url(#kg2)" strokeWidth="1.5" fill="url(#kgfill)"/>
    <path d="M5 21H19V17.5H5V21Z" stroke="url(#kg3)" strokeWidth="1.5" fill="url(#kgfill2)"/>
    <defs>
      <linearGradient id="kg1" x1="10" y1="2" x2="14" y2="5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="kg2" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="kg3" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="kgfill" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.15"/><stop offset="1" stopColor="#a855f7" stopOpacity="0.15"/>
      </linearGradient>
      <linearGradient id="kgfill2" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.2"/><stop offset="1" stopColor="#a855f7" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/>
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// ── Floating Particles ─────────────────────────────────────────────────────────

function FloatingParticles() {
  const particles = [
    { id: 0, left: '8%', top: '15%', delay: '0s', dur: '5s', size: '3px' },
    { id: 1, left: '92%', top: '22%', delay: '1.2s', dur: '6.5s', size: '2px' },
    { id: 2, left: '45%', top: '78%', delay: '0.4s', dur: '4.8s', size: '4px' },
    { id: 3, left: '73%', top: '5%', delay: '2.1s', dur: '7s', size: '2px' },
    { id: 4, left: '18%', top: '62%', delay: '0.9s', dur: '5.5s', size: '3px' },
    { id: 5, left: '85%', top: '80%', delay: '3s', dur: '4.2s', size: '5px' },
    { id: 6, left: '32%', top: '40%', delay: '1.7s', dur: '6s', size: '2px' },
    { id: 7, left: '60%', top: '55%', delay: '0.3s', dur: '5.2s', size: '3px' },
    { id: 8, left: '5%', top: '88%', delay: '2.5s', dur: '7.5s', size: '4px' },
    { id: 9, left: '97%', top: '50%', delay: '1s', dur: '4.5s', size: '2px' },
    { id: 10, left: '50%', top: '10%', delay: '0.6s', dur: '6.8s', size: '3px' },
    { id: 11, left: '25%', top: '93%', delay: '3.5s', dur: '5.8s', size: '2px' },
    { id: 12, left: '78%', top: '38%', delay: '1.4s', dur: '4.3s', size: '4px' },
    { id: 13, left: '12%', top: '32%', delay: '2.8s', dur: '7.2s', size: '2px' },
    { id: 14, left: '65%', top: '70%', delay: '0.2s', dur: '5.6s', size: '3px' },
  ];

  return (
    <div className="login-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="login-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.dur,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

// ── Main Login Component ───────────────────────────────────────────────────────

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="login-root">
      {/* Background */}
      <div className="login-bg" style={{ backgroundImage: 'url(/chess_login_bg.jpg)' }} />
      <div className="login-bg-overlay" />

      {/* Particles & Grid */}
      <FloatingParticles />
      <div className="login-grid" aria-hidden="true" />

      {/* Card */}
      <main className="login-card" role="main">
        <div className="login-card-glow" aria-hidden="true" />

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <ChessKingIcon />
          </div>
          <div className="login-logo-text">
            <span className="login-logo-nexus">NEXUS</span>
            <span className="login-logo-chess">CHESS</span>
          </div>
        </div>

        <p className="login-tagline">Master the future. Dominate the board.</p>

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="login-field-wrap">
            <span className="login-field-icon"><UserIcon /></span>
            <input
              id="login-email"
              className="login-input"
              type="email"
              placeholder="Username, Phone or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <div className="login-input-line" />
          </div>

          <div className="login-field-wrap">
            <span className="login-field-icon"><LockIcon /></span>
            <input
              id="login-password"
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              id="login-toggle-password"
              className="login-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
            <div className="login-input-line" />
          </div>

          <div className="login-row">
            <label className="login-remember" htmlFor="login-remember-cb">
              <input
                id="login-remember-cb"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="login-custom-cb" aria-hidden="true" />
              Remember me
            </label>
            <a href="/forgot-password" id="login-forgot-link" className="login-forgot">
              Forgot Password?
            </a>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className={`login-btn-primary${isLoading ? ' login-btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner" aria-label="Logging in…" />
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider" role="separator">
          <span>or continue with</span>
        </div>

        {/* Social */}
        <div className="login-social-grid">
          <button
            id="login-google-btn"
            type="button"
            className="login-social-btn"
            onClick={() => handleSocialLogin('Google')}
            aria-label="Log in with Google"
          >
            <GoogleIcon />
            <span>Google</span>
          </button>

          <button
            id="login-apple-btn"
            type="button"
            className="login-social-btn login-social-btn--apple"
            onClick={() => handleSocialLogin('Apple')}
            aria-label="Log in with Apple"
          >
            <AppleIcon />
            <span>Apple</span>
          </button>

          <button
            id="login-facebook-btn"
            type="button"
            className="login-social-btn login-social-btn--facebook"
            onClick={() => handleSocialLogin('Facebook')}
            aria-label="Log in with Facebook"
          >
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>

        <p className="login-signup">
          New here?&nbsp;
          <a href="/signup" id="login-signup-link" className="login-signup-link">
            Create an account →
          </a>
        </p>
      </main>
    </div>
  );
}

export default Login;