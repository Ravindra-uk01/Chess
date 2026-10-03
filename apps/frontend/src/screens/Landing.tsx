
// ── Floating background particles ────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left:  `${Math.round((i * 37 + 7) % 100)}%`,
  top:   `${Math.round((i * 53 + 13) % 100)}%`,
  size:  `${(i % 4) + 2}px`,
  delay: `${((i * 0.4) % 4).toFixed(1)}s`,
  dur:   `${4 + (i % 4)}s`,
}));

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full opacity-0 animate-float-y"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
            background: 'radial-gradient(circle, #00f5ff 0%, rgba(0,245,255,0) 70%)',
          }}
        />
      ))}
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
  delay: string;
}
function FeatureCard({ icon, title, desc, delay }: FeatureCardProps) {
  return (
    <div
      className="glass-card rounded-xl p-6 flex flex-col gap-3 group hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="font-orbitron text-sm font-bold tracking-widest text-brand-cyan uppercase">
        {title}
      </h3>
      <p className="text-foreground-muted text-sm leading-relaxed">{desc}</p>
      <div
        className="mt-auto h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)' }}
      />
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-orbitron text-2xl font-black text-gradient">{value}</span>
      <span className="text-foreground-subtle text-xs tracking-widest uppercase">{label}</span>
    </div>
  );
}

// ── Main Landing ─────────────────────────────────────────────────────────────
function Landing() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden font-inter">
      {/* Holographic grid */}
      <div className="pointer-events-none absolute inset-0 holo-grid opacity-60" aria-hidden="true" />

      {/* Radial glow blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(0,245,255,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 80%, rgba(168,85,247,0.09) 0%, transparent 70%)
          `,
        }}
      />

      <FloatingParticles />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-28 pb-20">
        {/* Badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase animate-fade-in-up"
          style={{
            borderColor: 'rgba(0,245,255,0.25)',
            background: 'rgba(0,245,255,0.06)',
            color: '#00f5ff',
            animationDelay: '0s',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
          Season 3 · Now Live
        </div>

        {/* Headline */}
        <h1
          className="font-orbitron font-black text-5xl sm:text-6xl md:text-7xl leading-tight tracking-tight animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="text-gradient">Nexus</span>
          <br />
          <span className="text-foreground">Chess</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="mt-6 max-w-xl text-foreground-muted text-lg leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          The next generation chess platform. Play live matches, challenge AI opponents,
          and climb global leaderboards — all in one futuristic arena.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-wrap gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            id="landing-play-btn"
            className="btn-glow px-8 py-3.5 rounded-xl text-sm"
          >
            Play Now
          </button>
          <button
            id="landing-learn-btn"
            className="px-8 py-3.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(168,85,247,0.35)',
              color: '#a855f7',
              background: 'rgba(168,85,247,0.06)',
            }}
          >
            Learn More →
          </button>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section
        className="relative z-10 mx-auto max-w-3xl glass-card rounded-2xl px-8 py-6 flex flex-wrap justify-around gap-6 animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        <StatPill value="2.4M+" label="Active Players" />
        <div className="w-px self-stretch bg-border hidden sm:block" />
        <StatPill value="18K" label="Live Games" />
        <div className="w-px self-stretch bg-border hidden sm:block" />
        <StatPill value="99ms" label="Avg Latency" />
        <div className="w-px self-stretch bg-border hidden sm:block" />
        <StatPill value="ELO 3200" label="Top Player" />
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <h2
          className="font-orbitron text-center text-xs tracking-widest uppercase text-foreground-muted mb-3 animate-fade-in-up"
        >
          Platform Features
        </h2>
        <p
          className="text-center text-2xl font-bold text-foreground mb-12 animate-fade-in-up"
          style={{ animationDelay: '0.05s' }}
        >
          Everything you need to{' '}
          <span className="text-gradient">dominate the board</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon="⚡"
            title="Real-time Multiplayer"
            desc="Sub-100ms WebSocket connections ensure your moves are lightning-fast. No lag, no excuses."
            delay="0s"
          />
          <FeatureCard
            icon="🤖"
            title="AI Opponents"
            desc="Train against our neural-network engine rated ELO 3200+. Choose difficulty from beginner to grandmaster."
            delay="0.1s"
          />
          <FeatureCard
            icon="🏆"
            title="Global Leaderboards"
            desc="Compete in ranked seasons and weekly tournaments. Climb from Bronze to Grandmaster tier."
            delay="0.2s"
          />
          <FeatureCard
            icon="📊"
            title="Deep Game Analysis"
            desc="Post-game engine analysis highlights blunders, missed tactics, and optimal continuations."
            delay="0.3s"
          />
          <FeatureCard
            icon="🎓"
            title="Interactive Lessons"
            desc="100+ curated lessons covering openings, endgames, and tactics puzzles for all skill levels."
            delay="0.4s"
          />
          <FeatureCard
            icon="🌐"
            title="Spectator Mode"
            desc="Watch top-rated games live with real-time commentary and engine evaluation bars."
            delay="0.5s"
          />
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <div
          className="rounded-2xl p-10 text-center animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, rgba(0,200,212,0.12) 0%, rgba(124,58,237,0.12) 100%)',
            border: '1px solid rgba(0,245,255,0.15)',
          }}
        >
          <h2 className="font-orbitron text-2xl font-black text-foreground mb-3">
            Ready to make your move?
          </h2>
          <p className="text-foreground-muted mb-8 max-w-md mx-auto">
            Join millions of players worldwide. Create your free account and start playing in seconds.
          </p>
          <button
            id="landing-signup-btn"
            className="btn-glow px-10 py-4 rounded-xl text-sm"
            onClick={() => window.location.href = '/signup'}
          >
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default Landing;
