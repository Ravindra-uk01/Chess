import { useNavigate } from 'react-router-dom';
import './Legal.css';

export default function Terms() {
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
          <div className="legal-badge ml-2">Legal Agreement</div>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">Last Updated: October 19, 2026</p>
        </header>

        <main className="legal-card">
          <section className="legal-section">
            <h2 className="legal-section-title">1. Acceptance of Terms</h2>
            <p className="legal-text">
              By accessing or creating an account on Nexus Chess (&quot;the Platform&quot;, &quot;we&quot;, &quot;our&quot;),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use or access the Platform.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">2. Fair Play & Anti-Cheat Policy</h2>
            <p className="legal-text">
              Nexus Chess is dedicated to providing a fair, competitive environment for players worldwide. You strictly agree that you will NOT:
            </p>
            <ul className="legal-list">
              <li><strong>Use Chess Engines:</strong> Use chess engines (Stockfish, Komodo, etc.), external evaluation software, or automated bot assistance during active matches.</li>
              <li><strong>Multi-Accounting / Rating Manipulation:</strong> Engage in sandbagging, intentional rating deflation/inflation, or boosting using multiple accounts.</li>
              <li><strong>Interference:</strong> Intentionally disconnect, stall moves, or manipulate network latency to gain unfair competitive advantages.</li>
            </ul>
            <p className="legal-text">
              Violation of the Fair Play Policy will result in immediate rating forfeiture, account restriction, or permanent termination without notice.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">3. User Accounts & Security</h2>
            <p className="legal-text">
              You are responsible for safeguarding your login credentials. You agree to notify us immediately of any unauthorized use of your account.
              You must provide accurate information during registration and keep your contact details up to date.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">4. User Conduct</h2>
            <p className="legal-text">
              Players must treat each other with respect. Harassment, hate speech, abusive chat, or threatening behavior will not be tolerated.
              We reserve the right to mute chat or ban users who engage in toxic behavior.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">5. Intellectual Property</h2>
            <p className="legal-text">
              All branding, logos, sound effects, animations, code, and graphical assets of Nexus Chess are proprietary property of Nexus Chess.
              Public game records (PGN notation and move histories) are non-exclusive and may be analyzed, shared, and archived.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">6. Limitation of Liability</h2>
            <p className="legal-text">
              Nexus Chess is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranty of any kind.
              We are not liable for any service interruptions, server disconnections, rating inaccuracies, or data loss.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">7. Contact & Support</h2>
            <div className="legal-contact-box">
              If you have any questions or reports regarding these Terms of Service, please contact us at:
              <br />
              <strong style={{ color: '#00f5ff' }}>support@nexuschess.com</strong>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
