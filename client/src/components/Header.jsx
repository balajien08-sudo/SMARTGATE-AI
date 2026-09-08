import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, Sparkles, Activity, Shield, Sun, Moon, Cloud, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { DemoBadge } from './DemoBadge.jsx';


export function Header({ onOpenSidebar }) {
  const { user } = useAuth();
  const { liveTelemetry, isConnected, changeScenario } = useSocket();
  const { theme, toggleTheme, isLight } = useTheme();

  const level = liveTelemetry?.traffic_level || 'HIGH';
  const score = liveTelemetry?.congestion_score || 65;

  let statusConfig = {
    label: '🟢 NORMAL FLOW',
    color: '#059669',
    bg: 'var(--emerald-bg)',
    border: 'var(--emerald-border)'
  };

  if (level === 'CRITICAL') {
    statusConfig = {
      label: '🔴 CRITICAL CONGESTION',
      color: '#dc2626',
      bg: 'var(--rose-bg)',
      border: 'var(--rose-border)'
    };
  } else if (level === 'HIGH') {
    statusConfig = {
      label: '🔴 HIGH CONGESTION',
      color: '#d97706',
      bg: 'var(--amber-bg)',
      border: 'var(--amber-border)'
    };
  } else if (level === 'MODERATE') {
    statusConfig = {
      label: '🟡 MODERATE FLOW',
      color: '#0284c7',
      bg: 'var(--cyan-bg)',
      border: 'var(--cyan-border)'
    };
  }

  return (
    <header
      style={{
        height: '70px',
        background: 'var(--bg-header)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Left: Mobile hamburger & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <button
          onClick={onOpenSidebar}
          style={{
            background: 'var(--bg-pill)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="lg-hidden"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div
          style={{
            position: 'relative',
            width: '320px',
            maxWidth: '100%'
          }}
          className="header-search-container"
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search gates, alerts, telemetry..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              fontSize: '13px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--cyan-500)';
              e.target.style.background = 'var(--bg-card-solid)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.background = 'var(--bg-input)';
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Simulation Scenario Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="scenario-switcher">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            SIM SCENARIO:
          </span>
          <select
            onChange={(e) => changeScenario(e.target.value)}
            defaultValue="NORMAL_FLOW"
            style={{
              background: 'var(--bg-pill)',
              border: '1px solid var(--cyan-border)',
              color: 'var(--cyan-500)',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="NORMAL_FLOW">🟢 Normal Flow</option>
            <option value="PEAK_MORNING">🔴 Peak Morning Rush</option>
            <option value="BUS_CONVOY">🚌 Bus Convoy Bottleneck</option>
          </select>
        </div>

        {/* Supabase Cloud Live Status Pill */}
        <Link
          to="/settings"
          title="Supabase Cloud Database & Auth (Connected: dyqguxhhgbcvyijfqjsp)"
          style={{
            padding: '5px 10px',
            borderRadius: '999px',
            background: 'var(--emerald-bg)',
            border: '1px solid var(--emerald-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--emerald-400)',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          className="lg-flex-only"
        >
          <Database size={13} color="#10b981" />
          <span>SUPABASE: ONLINE</span>
        </Link>

        {/* Live Congestion Pill */}
        <div
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            background: statusConfig.bg,
            border: `1px solid ${statusConfig.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            color: statusConfig.color
          }}
        >
          <span
            className={`pulse-indicator ${
              level === 'CRITICAL' ? 'red' : level === 'HIGH' ? 'amber' : 'green'
            }`}
            style={{ width: '8px', height: '8px' }}
          />
          <span>{statusConfig.label} ({score}/100)</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            background: 'var(--bg-pill)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {isLight ? <Moon size={18} /> : <Sun size={18} color="#fbbf24" />}
        </button>

        {/* Notifications Icon */}
        <Link
          to="/alerts"
          style={{
            position: 'relative',
            background: 'var(--bg-pill)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          title="View Alerts"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 6px #ef4444'
            }}
          />
        </Link>
      </div>
    </header>
  );
}
