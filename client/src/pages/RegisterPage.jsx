import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, Shield, ArrowRight, Loader2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { DemoBadge } from '../components/DemoBadge.jsx';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Security Staff');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const res = await register(name, email, password, role);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        width: '100%',
        maxWidth: '680px',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-modal)',
        padding: '44px 36px',
        background: 'var(--bg-card-solid)',
        position: 'relative'
      }}
    >
      {/* Top right theme toggle */}
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

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '16px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}
        >
          <ShieldCheck size={26} strokeWidth={2.5} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
          Create Security Operator Account
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Join the SmartGate AI campus traffic monitoring network.
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
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Officer Name"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Campus Email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@smartgate.ai"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Security Role</label>
          <div style={{ position: 'relative' }}>
            <Shield size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px', appearance: 'auto' }}
            >
              <option value="Security Staff">Security Staff (Live Telemetry & Gate Controls)</option>
              <option value="Administrator">Administrator (Full Command & AI Calibration)</option>
              <option value="Viewer">Viewer (Read-Only Analytics)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
        >
          {loading ? <Loader2 size={18} className="radar-spinner" /> : <ArrowRight size={16} />}
          Register & Enter Dashboard
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        Already have an operator account?{' '}
        <Link to="/login" style={{ color: 'var(--cyan-500)', fontWeight: 700, textDecoration: 'none' }}>
          Sign In Here
        </Link>
      </div>
    </div>
  );
}
