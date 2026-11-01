import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { validateEmail } from '../utils/validation';
import './AuthReset.css';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toast = useToast();
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      toast.error(emailErr);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to send reset link.');
      }

      setIsSubmitted(true);
      toast.success('Reset link dispatched! Please check your email.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to request password reset.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-reset-root">
      <div className="auth-reset-bg" style={{ backgroundImage: 'url(/chess_login_bg.jpg)' }} />
      <div className="auth-reset-overlay" />

      <main className="auth-reset-card" role="main">
        <h1 className="auth-reset-heading">Reset Password</h1>

        {isSubmitted ? (
          <div>
            <div className="auth-reset-success-box">
              <div className="auth-reset-success-icon">
                <CheckCircleIcon />
              </div>
              <h2 style={{ fontSize: '16px', color: '#22c55e', margin: '0 0 8px 0' }}>Link Sent</h2>
              <p style={{ fontSize: '13.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                If an account exists for <strong>{email}</strong>, you will receive an email containing a link to reset your password.
              </p>
            </div>
            <p className="auth-reset-subtext" style={{ fontSize: '12.5px', marginBottom: '20px' }}>
              Didn&apos;t receive an email? Check your spam folder or ensure the email address is registered.
            </p>
            <button
              type="button"
              className="auth-reset-btn"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Send Another Link
            </button>
          </div>
        ) : (
          <>
            <p className="auth-reset-subtext">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>

            <form className="auth-reset-form" onSubmit={handleSubmit} noValidate>
              <div>
                <div className={`auth-reset-field-wrap${touched && error ? ' auth-reset-field-wrap--error mb-4' : ''}`}>
                  <span className="auth-reset-field-icon"><MailIcon /></span>
                  <input
                    id="forgot-email"
                    className="auth-reset-input"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched) {
                        setError(validateEmail(e.target.value));
                      }
                    }}
                    onBlur={() => {
                      setTouched(true);
                      setError(validateEmail(email));
                    }}
                    autoComplete="email"
                    required
                  />
                </div>
                {touched && error && (
                  <p className="auth-reset-error" role="alert">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="auth-reset-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Link…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <div className="auth-reset-footer">
          Remember your password?{' '}
          <Link to="/login" className="auth-reset-link">
            Back to Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
