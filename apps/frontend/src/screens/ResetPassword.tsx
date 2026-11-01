import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { validatePassword } from '../utils/validation';
import './AuthReset.css';

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    if (!token) {
      toast.error('Missing reset token. Please request a new password reset link.');
      return;
    }

    const pwErr = validatePassword(password);
    let cErr: string | null = null;
    if (!confirmPassword) {
      cErr = 'Please confirm your new password';
    } else if (password !== confirmPassword) {
      cErr = 'Passwords do not match';
    }

    setPasswordError(pwErr);
    setConfirmError(cErr);

    if (pwErr || cErr) {
      toast.error(pwErr || cErr!);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      toast.success('Password reset successfully! You can now log in.');
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to reset password.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-reset-root">
        <div className="auth-reset-bg" style={{ backgroundImage: 'url(/chess_login_bg.jpg)' }} />
        <div className="auth-reset-overlay" />
        <main className="auth-reset-card" role="main">
          <h1 className="auth-reset-heading">Invalid Reset Link</h1>
          <p className="auth-reset-subtext">
            This password reset link is invalid or incomplete. Please request a new link.
          </p>
          <Link to="/forgot-password" className="auth-reset-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Request New Link
          </Link>
          <div className="auth-reset-footer">
            <Link to="/login" className="auth-reset-link">
              Back to Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-reset-root">
      <div className="auth-reset-bg" style={{ backgroundImage: 'url(/chess_login_bg.jpg)' }} />
      <div className="auth-reset-overlay" />

      <main className="auth-reset-card" role="main">
        <h1 className="auth-reset-heading">Set New Password</h1>
        <p className="auth-reset-subtext">
          Enter your new password below. It must be at least 8 characters long.
        </p>

        <form className="auth-reset-form" onSubmit={handleSubmit} noValidate>
          <div>
            <div className={`auth-reset-field-wrap${touched.password && passwordError ? ' auth-reset-field-wrap--error mb-4' : ''}`}>
              <span className="auth-reset-field-icon"><LockIcon /></span>
              <input
                id="reset-password"
                className="auth-reset-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="New password (min 8 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    setPasswordError(validatePassword(e.target.value));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setPasswordError(validatePassword(password));
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-reset-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {touched.password && passwordError && (
              <p className="auth-reset-error" role="alert">{passwordError}</p>
            )}
          </div>

          <div>
            <div className={`auth-reset-field-wrap${touched.confirm && confirmError ? ' auth-reset-field-wrap--error mb-4' : ''}`}>
              <span className="auth-reset-field-icon"><LockIcon /></span>
              <input
                id="reset-confirm-password"
                className="auth-reset-input"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirm) {
                    setConfirmError(
                      !e.target.value
                        ? 'Please confirm your new password'
                        : e.target.value !== password
                          ? 'Passwords do not match'
                          : null,
                    );
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, confirm: true }));
                  setConfirmError(
                    !confirmPassword
                      ? 'Please confirm your new password'
                      : confirmPassword !== password
                        ? 'Passwords do not match'
                        : null,
                  );
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-reset-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {touched.confirm && confirmError && (
              <p className="auth-reset-error" role="alert">{confirmError}</p>
            )}
          </div>

          <button
            type="submit"
            className="auth-reset-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password…' : 'Save New Password'}
          </button>
        </form>

        <div className="auth-reset-footer">
          <Link to="/login" className="auth-reset-link">
            Back to Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
