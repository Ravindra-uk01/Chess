import { useState, useCallback } from 'react';
import './Register.css';

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const ChessKingIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V5M10 3H14" stroke="url(#rkg1)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 7H16L17.5 17H6.5L8 7Z" stroke="url(#rkg2)" strokeWidth="1.5" fill="url(#rkgfill)"/>
    <path d="M5 21H19V17.5H5V21Z" stroke="url(#rkg3)" strokeWidth="1.5" fill="url(#rkgfill2)"/>
    <defs>
      <linearGradient id="rkg1" x1="10" y1="2" x2="14" y2="5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="rkg2" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="rkg3" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="rkgfill" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.15"/><stop offset="1" stopColor="#a855f7" stopOpacity="0.15"/>
      </linearGradient>
      <linearGradient id="rkgfill2" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
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

const AtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

// ── Floating Particles ──────────────────────────────────────────────────────

function FloatingParticles() {
  const particles = [
    { id: 0,  left: '7%',  top: '12%', delay: '0s',   dur: '5s',   size: '3px' },
    { id: 1,  left: '93%', top: '20%', delay: '1.3s', dur: '6.5s', size: '2px' },
    { id: 2,  left: '44%', top: '80%', delay: '0.5s', dur: '4.8s', size: '4px' },
    { id: 3,  left: '72%', top: '6%',  delay: '2s',   dur: '7s',   size: '2px' },
    { id: 4,  left: '19%', top: '60%', delay: '0.8s', dur: '5.5s', size: '3px' },
    { id: 5,  left: '86%', top: '82%', delay: '3.1s', dur: '4.2s', size: '5px' },
    { id: 6,  left: '31%', top: '42%', delay: '1.6s', dur: '6s',   size: '2px' },
    { id: 7,  left: '61%', top: '57%', delay: '0.3s', dur: '5.2s', size: '3px' },
    { id: 8,  left: '4%',  top: '87%', delay: '2.6s', dur: '7.5s', size: '4px' },
    { id: 9,  left: '96%', top: '52%', delay: '1.1s', dur: '4.5s', size: '2px' },
    { id: 10, left: '52%', top: '9%',  delay: '0.7s', dur: '6.8s', size: '3px' },
    { id: 11, left: '24%', top: '94%', delay: '3.4s', dur: '5.8s', size: '2px' },
    { id: 12, left: '77%', top: '36%', delay: '1.5s', dur: '4.3s', size: '4px' },
    { id: 13, left: '11%', top: '30%', delay: '2.9s', dur: '7.2s', size: '2px' },
    { id: 14, left: '66%', top: '72%', delay: '0.2s', dur: '5.6s', size: '3px' },
  ];

  return (
    <div className="reg-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="reg-particle"
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

// ── Password Strength ──────────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Weak',     color: '#ef4444' };
  if (score === 2) return { score: 2, label: 'Fair',     color: '#f97316' };
  if (score === 3) return { score: 3, label: 'Good',     color: '#eab308' };
  if (score === 4) return { score: 4, label: 'Strong',   color: '#22c55e' };
  return             { score: 5, label: 'Fortress', color: '#00f5ff' };
}

// ── Main Register Component ─────────────────────────────────────────────────

function Register() {
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [agreedToTerms,   setAgreedToTerms]   = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';

  const strength         = getPasswordStrength(password);
  const passwordsMatch   = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordsMismatch || !agreedToTerms) return;
      setIsLoading(true);
      // API binding will be added later
      setTimeout(() => setIsLoading(false), 1500);
    },
    [passwordsMismatch, agreedToTerms],
  );

  const handleSocialSignup = (provider: string) => {
    window.open(`${BACKEND_URL}/auth/${provider.toLowerCase()}`, '_self');
  };

  return (
    <div className="reg-root">
      {/* Background */}
      <div className="reg-bg" style={{ backgroundImage: 'url(/chess_login_bg.jpg)' }} />
      <div className="reg-bg-overlay" />

      {/* Particles & Grid */}
      <FloatingParticles />
      <div className="reg-grid" aria-hidden="true" />

      {/* Orbital ring decorations */}
      <div className="reg-ring reg-ring--1" aria-hidden="true" />
      <div className="reg-ring reg-ring--2" aria-hidden="true" />

      {/* Card */}
      <main className="reg-card" role="main">
        <div className="reg-card-glow" aria-hidden="true" />

        {/* Logo */}
        <div className="reg-logo">
          <div className="reg-logo-icon">
            <ChessKingIcon />
          </div>
          <div className="reg-logo-text">
            <span className="reg-logo-nexus">NEXUS</span>
            <span className="reg-logo-chess">CHESS</span>
          </div>
        </div>

        <h1 className="reg-heading">Create Your Account</h1>
        <p className="reg-tagline">Join the future of chess. Your journey begins here.</p>

        {/* Form */}
        <form className="reg-form" onSubmit={handleRegister} noValidate>

          {/* Username */}
          <div className="reg-field-wrap">
            <span className="reg-field-icon"><UserIcon /></span>
            <input
              id="reg-username"
              className="reg-input"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Email */}
          <div className="reg-field-wrap">
            <span className="reg-field-icon"><AtIcon /></span>
            <input
              id="reg-email"
              className="reg-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="reg-field-wrap">
            <span className="reg-field-icon"><LockIcon /></span>
            <input
              id="reg-password"
              className="reg-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              id="reg-toggle-password"
              className="reg-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Password strength bar */}
          {password.length > 0 && (
            <div className="reg-strength">
              <div className="reg-strength-bars">
                {[1, 2, 3, 4, 5].map((seg) => (
                  <div
                    key={seg}
                    className="reg-strength-bar"
                    style={{
                      background: seg <= strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                      boxShadow:  seg <= strength.score ? `0 0 6px ${strength.color}60` : 'none',
                    }}
                  />
                ))}
              </div>
              <span className="reg-strength-label" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          {/* Confirm Password */}
          <div
            className={`reg-field-wrap${
              passwordsMismatch ? ' reg-field-wrap--error' : passwordsMatch ? ' reg-field-wrap--ok' : ''
            }`}
          >
            <span className="reg-field-icon"><ShieldCheckIcon /></span>
            <input
              id="reg-confirm-password"
              className="reg-input"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              id="reg-toggle-confirm"
              className="reg-eye-btn"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {passwordsMismatch && (
            <p className="reg-field-error" role="alert">Passwords do not match.</p>
          )}

          {/* Terms */}
          <label className="reg-terms" htmlFor="reg-terms-cb">
            <input
              id="reg-terms-cb"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span className="reg-custom-cb" aria-hidden="true" />
            <span>
              I agree to the&nbsp;
              <a href="/terms"   id="reg-terms-link"   className="reg-link">Terms of Service</a>
              &nbsp;&amp;&nbsp;
              <a href="/privacy" id="reg-privacy-link" className="reg-link">Privacy Policy</a>
            </span>
          </label>

          {/* Submit */}
          <button
            id="reg-submit-btn"
            type="submit"
            className={`reg-btn-primary${isLoading ? ' reg-btn-loading' : ''}`}
            disabled={isLoading || !agreedToTerms || passwordsMismatch}
          >
            {isLoading ? (
              <span className="reg-spinner" aria-label="Creating account…" />
            ) : (
              <>
                <span className="reg-btn-text">Create Account</span>
                <span className="reg-btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="reg-divider" role="separator">
          <span>or sign up with</span>
        </div>

        {/* Social */}
        <div className="reg-social-grid">
          <button
            id="reg-google-btn"
            type="button"
            className="reg-social-btn"
            onClick={() => handleSocialSignup('Google')}
            aria-label="Sign up with Google"
          >
            <GoogleIcon />
            <span>Google</span>
          </button>

          <button
            id="reg-apple-btn"
            type="button"
            className="reg-social-btn reg-social-btn--apple"
            onClick={() => handleSocialSignup('Apple')}
            aria-label="Sign up with Apple"
          >
            <AppleIcon />
            <span>Apple</span>
          </button>

          <button
            id="reg-facebook-btn"
            type="button"
            className="reg-social-btn reg-social-btn--facebook"
            onClick={() => handleSocialSignup('Facebook')}
            aria-label="Sign up with Facebook"
          >
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>

        <p className="reg-login">
          Already have an account?&nbsp;
          <a href="/login" id="reg-login-link" className="reg-login-link">
            Sign in →
          </a>
        </p>
      </main>
    </div>
  );
}

export default Register;
