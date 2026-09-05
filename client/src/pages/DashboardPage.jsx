import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Clock,
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  Activity,
  ShieldCheck,
  DoorClosed,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { dashboardApi, alertApi } from '../services/api.js';
import { StatCard } from '../components/StatCard.jsx';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function DashboardPage() {
  const { user } = useAuth();
  const { liveTelemetry } = useSocket();
  const { addToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await dashboardApi.getOverview();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => {
      fetchDashboard();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Use live socket telemetry if available, otherwise backend response
  const telemetry = liveTelemetry || dashboardData?.telemetry || {
    current_vehicles: 47,
    queue_length: 18,
    waiting_time: 4.2,
    traffic_flow: 82,
    congestion_score: 72,
    traffic_level: 'HIGH',
    ai_confidence: 94
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const res = await alertApi.updateStatus(alertId, 'Acknowledged');
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Alert Acknowledged',
          message: 'Alert status synced with backend database.'
        });
        fetchDashboard();
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message
      });
    }
  };

  // Determine greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading && !dashboardData) {
    return <LoadingSpinner text="Connecting to Campus Telemetry Stream..." size={36} />;
  }

  const level = telemetry.traffic_level || 'HIGH';
  const score = telemetry.congestion_score || 72;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Top Banner & Header */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'var(--bg-card-hero)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
              {getGreeting()}, {user?.name || 'BALAJI EN'}
            </h1>
            <DemoBadge size="xs" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: 0 }}>
            Campus Gate Traffic Overview • College Main Entrance Command Node
          </p>
        </div>

        {/* Live Traffic Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              background: level === 'CRITICAL' ? 'var(--rose-bg)' :
                          level === 'HIGH' ? 'var(--amber-bg)' :
                          level === 'MODERATE' ? 'var(--cyan-bg)' : 'var(--emerald-bg)',
              border: `1px solid ${
                level === 'CRITICAL' ? 'var(--rose-border)' :
                level === 'HIGH' ? 'var(--amber-border)' :
                level === 'MODERATE' ? 'var(--cyan-border)' : 'var(--emerald-border)'
              }`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '13px',
              color: level === 'CRITICAL' ? 'var(--rose-400)' :
                     level === 'HIGH' ? 'var(--amber-400)' :
                     level === 'MODERATE' ? 'var(--cyan-400)' : 'var(--emerald-400)'
            }}
          >
            <span
              className={`pulse-indicator ${
                level === 'CRITICAL' ? 'red' : level === 'HIGH' ? 'amber' : 'green'
              }`}
            />
            <span>
              {level === 'CRITICAL' ? '🔴 CRITICAL CONGESTION' :
               level === 'HIGH' ? '🔴 HIGH CONGESTION' :
               level === 'MODERATE' ? '🟡 MODERATE TRAFFIC' : '🟢 NORMAL FLOW'}
            </span>
          </div>

          <button
            onClick={() => fetchDashboard(true)}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
            title="Refresh Dashboard"
          >
            <RefreshCw size={14} className={refreshing ? 'radar-spinner' : ''} />
          </button>
        </div>
      </div>

      {/* 6 Core KPI Cards */}
      <div className="grid-dashboard">
        <StatCard
          title="Current Vehicles"
          value={telemetry.current_vehicles || telemetry.vehicle_count || 47}
          unit="active"
          icon={Car}
          color="cyan"
          trend="↑ +12% inflow"
          trendPositive={false}
          subtext="Main Approach"
        />

        <StatCard
          title="Queue Length"
          value={telemetry.queue_length ?? 18}
          unit="vehicles"
          icon={TrendingUp}
          color={telemetry.queue_length > 12 ? 'rose' : 'amber'}
          trend={telemetry.queue_length > 10 ? 'High Queue' : 'Fluid'}
          trendPositive={telemetry.queue_length <= 10}
          subtext="Sensor Lane 1"
        />

        <StatCard
          title="Average Waiting Time"
          value={telemetry.waiting_time ?? 4.2}
          unit="min"
          icon={Clock}
          color="purple"
          trend="+0.8 min delay"
          trendPositive={false}
          subtext="Estimated Clearance"
        />

        <StatCard
          title="Traffic Flow"
          value={telemetry.traffic_flow || 82}
          unit="veh/min"
          icon={Activity}
          color="emerald"
          trend="Throughput Cap: 90"
          trendPositive={true}
          subtext="Gate Total Capacity"
        />

        <StatCard
          title="Congestion Risk"
          value={level}
          unit={`(${score}/100)`}
          icon={AlertTriangle}
          color={level === 'CRITICAL' || level === 'HIGH' ? 'rose' : 'amber'}
          trend="Surge Detected"
          trendPositive={false}
          subtext="Multi-factor Score"
        />

        <StatCard
          title="AI Confidence"
          value={`${telemetry.ai_confidence || 94}%`}
          unit="score"
          icon={BrainCircuit}
          color="cyan"
          trend="YOLO + Time-Series"
          trendPositive={true}
          subtext="Simulated ML Model"
        />
      </div>

      {/* Main Grid: Live Trend Chart & Gates Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Real-time Inflow Sparkline Chart */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Real-Time Vehicle Flow Trend</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Continuous incoming telemetry buffer (Last 12 ticks)
              </p>
            </div>
            <DemoBadge size="xs" />
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData?.sparklines || []}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 90]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="vehicles" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#cyanArea)" name="Vehicles" />
                <Area type="monotone" dataKey="queue" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#purpleArea)" name="Queue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gate Operational Status Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Campus Gate Status</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Simulated Gate Controls & Barrier Positions
                </p>
              </div>
              <Link to="/gates" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Manage <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(dashboardData?.gates || []).map((gate) => (
                <div
                  key={gate.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-pill)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: gate.status === 'Open' ? '#10b981' : gate.status === 'Available' ? '#0284c7' : '#ef4444',
                        boxShadow: `0 0 8px ${gate.status === 'Open' ? '#10b981' : gate.status === 'Available' ? '#0284c7' : '#ef4444'}`
                      }}
                    />
                    <div>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                        {gate.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Type: {gate.type} • Cap: {gate.capacity_rate} veh/min
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: gate.status === 'Open' ? 'var(--emerald-bg)' :
                                  gate.status === 'Available' ? 'var(--cyan-bg)' : 'var(--rose-bg)',
                      color: gate.status === 'Open' ? 'var(--emerald-400)' :
                             gate.status === 'Available' ? 'var(--cyan-400)' : 'var(--rose-400)',
                      border: `1px solid ${gate.status === 'Open' ? 'var(--emerald-border)' : gate.status === 'Available' ? 'var(--cyan-border)' : 'var(--rose-border)'}`
                    }}
                  >
                    {gate.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SIMULATED GATE BARRIERS — NO PHYSICAL MOTOR CONNECTED
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation & Active Alerts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Active AI Recommendation */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            border: '1px solid var(--purple-border)',
            background: 'var(--purple-bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrainCircuit size={18} color="var(--purple-400)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                Active AI Intelligence Recommendation
              </h3>
            </div>
            <DemoBadge size="xs" text="SIMULATED RECOM" />
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '16px' }}>
            {dashboardData?.recommendation || 'Traffic flow is optimal. Maintain standard gate clearance.'}
          </p>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11.5px',
              color: 'var(--purple-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontWeight: 600 }}>AI Recommendation — Human Verification Required</span>
            <Link to="/ai-analysis" style={{ color: 'var(--cyan-500)', fontWeight: 700, textDecoration: 'none' }}>
              View Analysis →
            </Link>
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--amber-400)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Recent Campus Gate Alerts</h3>
            </div>
            <Link to="/alerts" style={{ fontSize: '12px', color: 'var(--cyan-500)', textDecoration: 'none', fontWeight: 700 }}>
              View All ({dashboardData?.alerts?.total || 0}) →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(dashboardData?.alerts?.items || []).slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--bg-pill)',
                  border: `1px solid ${
                    alert.severity === 'Critical' ? 'var(--rose-border)' :
                    alert.severity === 'Warning' ? 'var(--amber-border)' : 'var(--cyan-border)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: alert.severity === 'Critical' ? 'var(--rose-bg)' : 'var(--amber-bg)',
                        color: alert.severity === 'Critical' ? 'var(--rose-400)' : 'var(--amber-400)'
                      }}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {alert.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {alert.location} • {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {alert.status === 'Active' ? (
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '11px', flexShrink: 0 }}
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--emerald-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    {alert.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
