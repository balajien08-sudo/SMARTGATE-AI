import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  BrainCircuit,
  AlertTriangle,
  BarChart3,
  DoorClosed,
  Network,
  GraduationCap,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DemoBadge } from './DemoBadge.jsx';

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Traffic', path: '/live-traffic', icon: Video, badge: 'LIVE' },
    { name: 'AI Traffic Analysis', path: '/ai-analysis', icon: BrainCircuit, highlight: true },
    { name: 'Alert Center', path: '/alerts', icon: AlertTriangle },
    { name: 'Traffic Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Gate Management', path: '/gates', icon: DoorClosed },
    { name: 'System Architecture', path: '/architecture', icon: Network },
    { name: 'C29 Methodology', path: '/c29-methodology', icon: GraduationCap, badge: 'C29' },
    { name: 'Settings & Profile', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: '270px',
          height: '100vh',
          background: 'var(--bg-sidebar)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
          boxShadow: 'var(--shadow-card)'
        }}
        className="sidebar-responsive"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '17px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-main)',
                  display: 'block'
                }}
              >
                SMARTGATE <span className="gradient-text-cyan">AI</span>
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                v2.0 • AI IMMERSION
              </span>
            </div>
          </div>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items List */}
        <div
          style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <div style={{ padding: '4px 12px', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Main Command Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: isActive ? 'var(--cyan-500)' : 'var(--text-secondary)',
                  background: isActive
                    ? 'var(--cyan-bg)'
                    : 'transparent',
                  border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 10px var(--cyan-glow)' : 'none'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} style={{ color: item.highlight ? 'var(--cyan-500)' : undefined }} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      background: item.badge === 'LIVE' ? 'var(--rose-bg)' : 'var(--purple-bg)',
                      color: item.badge === 'LIVE' ? 'var(--rose-400)' : 'var(--purple-400)',
                      border: item.badge === 'LIVE' ? '1px solid var(--rose-border)' : '1px solid var(--purple-border)',
                      fontWeight: 700
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-glass-strong)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--cyan-bg)',
                  border: '1px solid var(--cyan-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-500)',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div style={{ overflow: 'hidden' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user?.name || 'BALAJI EN'}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'capitalize'
                  }}
                >
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </div>

            <DemoBadge size="xs" text="DEMO" />
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              width: '100%',
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'var(--rose-bg)',
              border: '1px solid var(--rose-border)',
              color: 'var(--rose-400)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
