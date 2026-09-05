import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, ArrowRight, LogIn, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { DemoBadge } from './DemoBadge.jsx';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-header)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 28px',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'var(--text-main)'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
            }}
          >
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-main)'
                }}
              >
                SMARTGATE <span className="gradient-text-cyan">AI</span>
              </span>
              <DemoBadge size="xs" text="C29 PROJECT" />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              “Smarter Gates. Safer Campuses.”
            </p>
          </div>
        </Link>

        {/* Links & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              padding: '8px',
              borderRadius: '10px'
            }}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} color="#fbbf24" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                <Cpu size={16} />
                Open Command Center
              </Link>
              <button
                onClick={() => logout()}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                <LogIn size={15} />
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                Get Started
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
