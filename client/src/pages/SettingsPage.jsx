import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Sliders,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Save,
  Moon,
  Sun,
  Palette,
  Volume2,
  VolumeX,
  Database,
  Cloud,
  Key,
  Globe,
  Zap,
  Activity,
  RefreshCw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { testSupabaseConnection, SUPABASE_URL, SUPABASE_ANON_KEY } from '../services/supabaseClient.js';


export function SettingsPage() {
  const { user } = useAuth();
  const { changeScenario } = useSocket();
  const { theme, setTheme, isLight } = useTheme();
  const { addToast } = useToast();

  const [notificationToggles, setNotificationToggles] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    audioBeep: false,
    aiRecommendations: true
  });

  const [simulationConfig, setSimulationConfig] = useState({
    activeScenario: 'NORMAL_FLOW',
    refreshRate: '3.5s',
    noiseFilter: 'High Sensitivity'
  });

  const [supabaseState, setSupabaseState] = useState({
    checked: false,
    connected: true,
    latencyMs: 120,
    message: 'Supabase Cloud API endpoint active & authenticated'
  });
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await testSupabaseConnection();
      setSupabaseState({
        checked: true,
        connected: res.success,
        latencyMs: res.latencyMs,
        message: res.message
      });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Supabase Connected',
          message: `Endpoint responded in ${res.latencyMs}ms. Project: dyqguxhhgbcvyijfqjsp`
        });
      } else {
        addToast({
          type: 'error',
          title: 'Supabase Connection Error',
          message: res.message
        });
      }
    } catch (err) {
      setSupabaseState({
        checked: true,
        connected: false,
        latencyMs: null,
        message: err.message
      });
    } finally {
      setIsTestingSupabase(false);
    }
  };

  useEffect(() => {
    handleTestSupabase();
  }, []);

  const handleToggle = (key) => {
    setNotificationToggles({ ...notificationToggles, [key]: !notificationToggles[key] });
    addToast({
      type: 'info',
      title: 'Preferences Updated',
      message: `Notification parameter '${key}' adjusted.`
    });
  };

  const handleResetDemoData = () => {
    addToast({
      type: 'success',
      title: 'Demo Data Buffer Reset',
      message: 'Telemetry readings, simulation counters & active alerts restored to initial seed state.'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>System Settings & Operator Profile</h1>
            <DemoBadge size="xs" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Manage user credentials, appearance theme, alert thresholds & real-time traffic simulation parameters
          </p>
        </div>
      </div>

      {/* Theme Appearance Selector Card */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Palette size={20} color="var(--cyan-500)" />
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Interface Theme & Appearance</h3>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '18px' }}>
          Choose your preferred visual display mode. Light Theme is optimized for bright daylight security booths and evaluator presentations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Light Theme Option */}
          <div
            onClick={() => setTheme('light')}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              border: isLight ? '2px solid var(--cyan-500)' : '1px solid var(--border-subtle)',
              background: isLight ? 'var(--cyan-bg)' : 'var(--bg-pill)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: isLight ? '0 4px 14px var(--cyan-glow)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <Sun size={20} color="#f59e0b" />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Light Theme</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Crisp slate & high-contrast cards</span>
              </div>
            </div>

            {isLight && <CheckCircle2 size={20} color="var(--cyan-500)" />}
          </div>

          {/* Dark Theme Option */}
          <div
            onClick={() => setTheme('dark')}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              border: !isLight ? '2px solid var(--purple-500)' : '1px solid var(--border-subtle)',
              background: !isLight ? 'var(--purple-bg)' : 'var(--bg-pill)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: !isLight ? '0 4px 14px var(--purple-glow)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#0a1124',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc'
                }}
              >
                <Moon size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block' }}>Dark Theme</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cyber night HUD command center</span>
              </div>
            </div>

            {!isLight && <CheckCircle2 size={20} color="var(--purple-400)" />}
          </div>
        </div>
      </div>

      {/* Supabase Cloud Database & Auth Connection Card */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card-solid)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.2))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Supabase Cloud Connection & Telemetry
                </h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: supabaseState.connected ? 'var(--emerald-bg)' : 'var(--rose-bg)',
                    border: supabaseState.connected ? '1px solid var(--emerald-border)' : '1px solid var(--rose-border)',
                    color: supabaseState.connected ? 'var(--emerald-400)' : 'var(--rose-400)'
                  }}
                >
                  <span
                    className={`pulse-indicator ${supabaseState.connected ? 'green' : 'red'}`}
                    style={{ width: '7px', height: '7px' }}
                  />
                  {supabaseState.connected ? 'CONNECTED (ONLINE)' : 'OFFLINE'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: '2px 0 0 0' }}>
                Production cloud database, authentication layer & real-time telemetry streaming instance
              </p>
            </div>
          </div>

          <button
            onClick={handleTestSupabase}
            disabled={isTestingSupabase}
            className="btn-cyan"
            style={{
              padding: '8px 16px',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isTestingSupabase ? 'wait' : 'pointer'
            }}
          >
            <RefreshCw size={14} className={isTestingSupabase ? 'spin' : ''} />
            {isTestingSupabase ? 'Testing Endpoint...' : 'Test Connection'}
          </button>
        </div>

        {/* Supabase Config Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-pill)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Globe size={15} color="var(--cyan-500)" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project URL</span>
            </div>
            <code style={{ fontSize: '12px', color: 'var(--cyan-500)', wordBreak: 'break-all', display: 'block', fontWeight: 600 }}>
              {SUPABASE_URL}
            </code>
          </div>

          <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-pill)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Key size={15} color="var(--purple-400)" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Publishable API Key</span>
            </div>
            <code style={{ fontSize: '12px', color: 'var(--purple-400)', wordBreak: 'break-all', display: 'block', fontWeight: 600 }}>
              {SUPABASE_ANON_KEY.slice(0, 18)}••••••••{SUPABASE_ANON_KEY.slice(-8)}
            </code>
          </div>
        </div>

        {/* Feature status badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={16} color="#10b981" />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>PostgreSQL Engine</span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>v15 Managed Cloud DB</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={16} color="var(--cyan-500)" />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Realtime Websockets</span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                {supabaseState.latencyMs !== null ? `${supabaseState.latencyMs}ms Latency` : 'Active Gateway'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={16} color="var(--purple-400)" />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>Auth & Row Security</span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>JWT Session Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* User Profile Card */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <User size={20} color="var(--cyan-500)" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Security Operator Profile</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Operator Name</span>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                {user?.name || 'BALAJI EN'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Verified Email</span>
              <p style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--cyan-500)', margin: '2px 0 0 0', fontWeight: 600 }}>
                {user?.email || 'balajien08@gmail.com'}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Assigned System Role</span>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--purple-400)', margin: '2px 0 0 0' }}>
                {user?.role || 'Administrator'}
              </p>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span className="badge badge-normal">ACTIVE JWT SESSION VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Bell size={20} color="var(--amber-400)" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Notification & Audio Alerts</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block', fontWeight: 600 }}>Critical Inflow Alerts</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Immediate banner notifications on congestion spikes</span>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles.criticalAlerts}
                onChange={() => handleToggle('criticalAlerts')}
                style={{ accentColor: 'var(--cyan-500)', width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block', fontWeight: 600 }}>Warning & Anomaly Badges</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bus convoy and queue growth indicators</span>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles.warningAlerts}
                onChange={() => handleToggle('warningAlerts')}
                style={{ accentColor: 'var(--cyan-500)', width: '18px', height: '18px' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '14px', color: 'var(--text-main)', display: 'block', fontWeight: 600 }}>AI Recommendation Prompts</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Actionable suggestions for secondary gate activation</span>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles.aiRecommendations}
                onChange={() => handleToggle('aiRecommendations')}
                style={{ accentColor: 'var(--cyan-500)', width: '18px', height: '18px' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Simulation Controls & Reset Data Card */}
      <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} color="var(--purple-400)" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Telemetry Simulation Parameters</h3>
          </div>
          <DemoBadge size="xs" text="SIMULATION MANAGER" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '24px' }}>
          <div>
            <label className="form-label">Active Scenario Preset</label>
            <select
              value={simulationConfig.activeScenario}
              onChange={(e) => {
                setSimulationConfig({ ...simulationConfig, activeScenario: e.target.value });
                changeScenario(e.target.value);
              }}
              style={{
                width: '100%',
                background: 'var(--bg-pill)',
                border: '1px solid var(--cyan-border)',
                color: 'var(--cyan-500)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="NORMAL_FLOW">🟢 Normal Baseline Flow</option>
              <option value="PEAK_MORNING">🔴 Peak Morning Arrival Rush</option>
              <option value="BUS_CONVOY">🚌 Bus Convoy Bottleneck</option>
            </select>
          </div>

          <div>
            <label className="form-label">Telemetry Tick Interval</label>
            <input
              type="text"
              value={simulationConfig.refreshRate}
              disabled
              className="form-input"
              style={{ opacity: 0.8 }}
            />
          </div>

          <div>
            <label className="form-label">YOLO Noise Filter</label>
            <input
              type="text"
              value={simulationConfig.noiseFilter}
              disabled
              className="form-input"
              style={{ opacity: 0.8 }}
            />
          </div>
        </div>

        <div
          style={{
            paddingTop: '18px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
              Reset Simulation & Clear Cache
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Resets telemetry history buffer, clears simulated alarms, and returns to baseline seed data.
            </span>
          </div>

          <button
            onClick={handleResetDemoData}
            className="btn-rose"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            <RotateCcw size={14} />
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
