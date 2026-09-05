import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight, Loader2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { DemoBadge } from '../components/DemoBadge.jsx';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginDemo } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    const res = await loginDemo();
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Demo login failed.');
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        width: '100%',
        maxWidth: '960px',
        minHeight: '560px',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-modal)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        overflow: 'hidden'
      }}
    >
      {/* Left Branding Side */}
      <div
        style={{
          background: 'var(--bg-hero-gradient)',
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        <div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
              marginBottom: '24px'
            }}
          >
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '8px',
              color: 'var(--text-main)'
            }}
          >
            SMARTGATE <span className="gradient-text-cyan">AI</span>
          </h2>

          <p style={{ color: 'var(--cyan-500)', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
            “AI-powered traffic intelligence for safer campuses.”
          </p>

          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.6 }}>
            Real-time multi-lane entrance surveillance, YOLO vehicle telemetry, automated queue alerts, and time-series surge forecasting for college gate security.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div
          style={{
            background: 'var(--purple-bg)',
            border: '1px solid var(--purple-border)',
            borderRadius: '14px',
            padding: '16px',
            marginTop: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--purple-400)', letterSpacing: '0.04em' }}>
              ADMIN ACCESS CREDENTIALS
            </span>
            <DemoBadge size="xs" />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div>Officer: <strong style={{ color: 'var(--text-main)' }}>BALAJI EN</strong></div>
            <div>Email: <strong style={{ color: 'var(--cyan-500)' }}>balajien08@gmail.com</strong></div>
            <div>Password: <strong style={{ color: 'var(--cyan-500)' }}>3329</strong></div>
          </div>
        </div>
      </div>

      {/* Right Sign In Form */}
      <div
        style={{
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--bg-card-solid)',
          position: 'relative'
        }}
      >
        {/* Top corner theme toggle */}
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{ padding: '6px' }}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} color="#fbbf24" />}
          </button>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            Sign In to Command Center
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Enter your security operator credentials to access live telemetry.
          </p>
        </div>

        {errorMsg && (
          <div
            className="animate-fade-in"
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'var(--rose-bg)',
              border: '1px solid var(--rose-border)',
              color: 'var(--rose-400)',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: 600
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="balajien08@gmail.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--cyan-500)' }}
              />
              Remember me
            </label>

            <span
              onClick={() => alert('For evaluation access, please use balajien08@gmail.com / 3329 (BALAJI EN).')}
              style={{ color: 'var(--cyan-500)', cursor: 'pointer', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '6px' }}
          >
            {loading ? <Loader2 size={18} className="radar-spinner" /> : <Lock size={16} />}
            Sign In
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 600 }}
          >
            <Sparkles size={16} color="var(--cyan-500)" />
            One-Click Demo Access
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Don't have an operator account?{' '}
          <Link to="/register" style={{ color: 'var(--cyan-500)', fontWeight: 700, textDecoration: 'none' }}>
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
