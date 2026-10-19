import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="legal-root">
      <div className="legal-container">
        <header className="legal-header">
          <button
            type="button"
            className="legal-back-link"
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ← Back
          </button>
          <div className="legal-badge ml-2 ">Data Protection</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last Updated: October 19, 2026</p>
        </header>

        <main className="legal-card">
          <section className="legal-section">
            <h2 className="legal-section-title">1. Introduction</h2>
            <p className="legal-text">
              Nexus Chess (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
              describes how we collect, use, and protect your information when you access or play on our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">2. Information We Collect</h2>
            <p className="legal-text">We only collect the information necessary to provide you with a smooth chess playing experience:</p>
            <ul className="legal-list">
              <li><strong>Account Information:</strong> When you register, we collect your chosen username, email address, and securely hashed password.</li>
              <li><strong>OAuth Profiles:</strong> If you sign in via Google or Facebook, we receive your basic public profile and verified email.</li>
              <li><strong>Game Data:</strong> Moves, clock times, match outcomes, Elo rating progression, and puzzle statistics are stored to power rankings and game analysis.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and connection status are logged temporarily for security and cheat prevention.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">3. How We Use Your Information</h2>
            <ul className="legal-list">
              <li>To authenticate your session and preserve your game progress.</li>
              <li>To match you against opponents of comparable skill level.</li>
              <li>To send essential security alerts, such as password reset instructions.</li>
              <li>To detect engine cheating and prevent unauthorized automated play.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">4. Cookies & Session Storage</h2>
            <p className="legal-text">
              We use secure, HTTP-only authentication cookies and local storage tokens to keep you logged in across sessions and retain your board settings. We do not use third-party advertising tracking cookies.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">5. Data Sharing & Third Parties</h2>
            <p className="legal-text">
              We never sell your personal data. We only share information with trusted infrastructure providers (such as database and hosting services) strictly for the purpose of operating the application.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">6. Data Security</h2>
            <p className="legal-text">
              Passwords are salted and cryptographically hashed with bcrypt before storage. Sensitive communications are encrypted using Transport Layer Security (TLS/HTTPS).
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">7. Your Rights & Contact</h2>
            <div className="legal-contact-box">
              You can request account deletion or data export at any time. For privacy inquiries, please contact:
              <br />
              <strong style={{ color: '#00f5ff' }}>privacy@nexuschess.com</strong>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
