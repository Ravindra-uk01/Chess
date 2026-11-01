import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@repo/store/userAtom';

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000';

// ── Icons (inline SVG) ────────────────────────────────────────────────────────

const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const KingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2V5M10 3H14" stroke="url(#sb-g1)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 7H16L17.5 17H6.5L8 7Z" stroke="url(#sb-g1)" strokeWidth="1.5" fill="url(#sb-fill)"/>
    <path d="M5 21H19V17.5H5V21Z" stroke="url(#sb-g1)" strokeWidth="1.5" fill="url(#sb-fill2)"/>
    <defs>
      <linearGradient id="sb-g1" x1="5" y1="2" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
      <linearGradient id="sb-fill" x1="8" y1="7" x2="16" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.15"/><stop offset="1" stopColor="#a855f7" stopOpacity="0.15"/>
      </linearGradient>
      <linearGradient id="sb-fill2" x1="5" y1="17" x2="19" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f5ff" stopOpacity="0.2"/><stop offset="1" stopColor="#a855f7" stopOpacity="0.2"/>
      </linearGradient>
    </defs>
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const PuzzleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 20 12 16 16 20"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <path d="M6 4H18v8a6 6 0 0 1-12 0V4z"/>
    <line x1="4" y1="4" x2="6" y2="4"/>
    <line x1="18" y1="4" x2="20" y2="4"/>
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M12 2a4 4 0 0 0-4 4v5h8V6a4 4 0 0 0-4-4z"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
    <line x1="12" y1="16" x2="12" y2="18"/>
  </svg>
);

const WatchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const ChevronIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
  >
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// ── Nav item definitions ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home',       label: 'Home',        icon: <HomeIcon />,   path: '/home',        disabled: false },
  { id: 'play',       label: 'Play',        icon: <PlayIcon />,   path: '/play',        disabled: false },
  { id: 'puzzles',    label: 'Puzzles',     icon: <PuzzleIcon />, path: '/puzzles',     disabled: true, badge: 'Coming soon...' },
  { id: 'learn',      label: 'Learn',       icon: <BookIcon />,   path: '/learn',       disabled: true, badge: 'Coming soon...' },
  { id: 'bots',       label: 'Play Bots',   icon: <BotIcon />,    path: '/bots',        disabled: true, badge: 'Coming soon...' },
  { id: 'tournament', label: 'Tournaments', icon: <TrophyIcon />, path: '/tournaments', disabled: true, badge: 'Coming soon...' },
  { id: 'watch',      label: 'Watch',       icon: <WatchIcon />,  path: '/watch',       disabled: true, badge: 'Coming soon...' },
  { id: 'community',  label: 'Community',   icon: <UsersIcon />,  path: '/community',   disabled: true, badge: 'Coming soon...' },
];

// ── Sidebar Component ─────────────────────────────────────────────────────────

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser] = useRecoilState(userAtom);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const w = collapsed ? '72px' : '220px';

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        background: 'rgba(5, 8, 30, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0,245,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: collapsed ? '20px 0' : '20px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(0,245,255,0.06)',
          minHeight: '72px',
        }}
        onClick={() => navigate('/home')}
      >
        <div
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(168,85,247,0.15))',
            border: '1px solid rgba(0,245,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <KingIcon />
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, overflow: 'hidden' }}>
            <span style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 900,
              letterSpacing: 3, background: 'linear-gradient(90deg,#00f5ff,#a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', whiteSpace: 'nowrap',
            }}>NEXUS</span>
            <span style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: 5,
              color: 'rgba(0,245,255,0.5)', whiteSpace: 'nowrap',
            }}>CHESS</span>
          </div>
        )}
      </div>

      {/* ── Nav items ─────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 8px' }}>
        {NAV_ITEMS.map((item) => {
          const isHome = item.id === 'home';
          const active = !item.disabled && (
            isHome
              ? (location.pathname === '/home' || location.pathname === '/')
              : (location.pathname === item.path || (item.path === '/play' && (location.pathname.startsWith('/play') || location.pathname.startsWith('/game/'))))
          );

          return (
            <button
              key={item.id}
              id={`sidebar-${item.id}`}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) navigate(item.path);
              }}
              title={collapsed ? `${item.label}${item.disabled ? ' (Coming soon...)' : ''}` : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '11px 0' : '11px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 10,
                border: 'none',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                marginBottom: 2,
                transition: 'background 0.2s, color 0.2s',
                opacity: item.disabled ? 0.45 : 1,
                background: active
                  ? 'linear-gradient(135deg,rgba(0,245,255,0.12),rgba(168,85,247,0.10))'
                  : 'transparent',
                color: active ? '#00f5ff' : 'rgba(148,163,184,0.75)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!item.disabled && !active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.disabled && !active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.75)';
                }
              }}
            >
              {/* Active bar */}
              {active && (
                <span style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: 3, borderRadius: 99,
                  background: 'linear-gradient(180deg,#00f5ff,#a855f7)',
                }}/>
              )}
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 500,
                  fontFamily: 'Inter,sans-serif',
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(148,163,184,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  letterSpacing: 0.2,
                  whiteSpace: 'nowrap',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div style={{ height: 1, background: 'rgba(0,245,255,0.06)', margin: '12px 4px' }} />

        {/* Settings (Disabled) */}
        <button
          id="sidebar-settings"
          disabled
          title={collapsed ? 'Settings (Coming soon...)' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '11px 0' : '11px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 10, border: 'none', cursor: 'not-allowed',
            background: 'transparent', color: 'rgba(148,163,184,0.4)',
            opacity: 0.45,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <SettingsIcon />
          {!collapsed && (
            <>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>Settings</span>
              <span style={{
                fontSize: 9, fontWeight: 500, fontFamily: 'Inter,sans-serif',
                padding: '2px 6px', borderRadius: 6,
                background: 'rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                letterSpacing: 0.2,
                whiteSpace: 'nowrap',
              }}>Coming soon...</span>
            </>
          )}
        </button>
      </nav>

      {/* ── User card & Logout ─────────────────────────────── */}
      <div style={{
        margin: '8px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(0,245,255,0.08)',
        padding: collapsed ? '8px 4px' : '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: user?.isGuest
              ? 'linear-gradient(135deg, rgba(0,245,255,0.35), rgba(168,85,247,0.35))'
              : 'linear-gradient(135deg,#00c8d4,#7c3aed)',
            border: '1px solid rgba(0,245,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, fontFamily: 'Orbitron,sans-serif', color: '#fff',
          }}>
            {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                title={user?.name || 'User'}
                style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 10, color: user?.isGuest ? '#f59e0b' : 'rgba(0,245,255,0.6)', fontFamily: 'Orbitron,sans-serif', letterSpacing: 0.5 }}>
                {user?.isGuest ? 'GUEST' : 'MEMBER'}
              </div>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          title={collapsed ? 'Log out' : undefined}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8,
            padding: collapsed ? '8px 0' : '7px 8px',
            borderRadius: 8,
            border: 'none',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.2)';
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.08)';
            (e.currentTarget as HTMLElement).style.color = '#f87171';
          }}
        >
          <LogOutIcon />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* ── Collapse toggle ───────────────────────────────── */}
      <button
        id="sidebar-collapse-btn"
        onClick={() => setCollapsed((v) => !v)}
        style={{
          margin: collapsed ? '8px auto' : '8px',
          width: collapsed ? 40 : 'calc(100% - 16px)',
          padding: '8px',
          borderRadius: 8,
          border: '1px solid rgba(0,245,255,0.1)',
          background: 'rgba(0,245,255,0.04)',
          color: 'rgba(0,245,255,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.08)';
          (e.currentTarget as HTMLElement).style.color = '#00f5ff';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,255,0.04)';
          (e.currentTarget as HTMLElement).style.color = 'rgba(0,245,255,0.5)';
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronIcon collapsed={collapsed} />
        {!collapsed && <span style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', letterSpacing: 0.5 }}>Collapse</span>}
      </button>
    </aside>
  );
}
