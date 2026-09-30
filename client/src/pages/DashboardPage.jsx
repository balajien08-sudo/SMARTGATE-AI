import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Clock, TrendingUp, AlertTriangle, BrainCircuit, Activity,
  ArrowRight, RefreshCw, CheckCircle2, Truck, Bus, Navigation
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { dashboardApi, alertApi } from '../services/api.js';
import { StatCard } from '../components/StatCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

const COLORS = ['#0284c7', '#7c3aed', '#10b981', '#f59e0b'];

export function DashboardPage() {
  const { user } = useAuth();
  const { liveTelemetry } = useSocket();
  const { addToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // App Modes
  const [appMode, setAppMode] = useState('DEMO'); // 'DEMO' or 'VIDEO_INFERENCE'
  const [demoInference, setDemoInference] = useState(null);

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
  
  const fetchDemoInference = async () => {
    try {
      const res = await fetch('/data/demo_inference.json');
      if (res.ok) {
        const data = await res.json();
        setDemoInference(data);
      }
    } catch (err) {
      console.error('Error fetching demo inference data:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchDemoInference();
    const interval = setInterval(() => {
      fetchDashboard();
      if (appMode === 'DEMO') fetchDemoInference();
    }, 4000);
    return () => clearInterval(interval);
  }, [appMode]);

  // Merge JSON inference data with telemetry if in DEMO mode
  const telemetry = (appMode === 'DEMO' && demoInference) ? {
    ...liveTelemetry,
    current_vehicles: demoInference.vehicle_count,
    queue_length: demoInference.queue_length,
    waiting_time: demoInference.queue_length * 0.5,
    traffic_level: demoInference.congestion_level?.toUpperCase() || 'MODERATE',
    cars: demoInference.cars || 0,
    motorcycles: demoInference.motorcycles || 0,
    buses: demoInference.buses || 0,
    trucks: demoInference.trucks || 0,
    prediction: demoInference.prediction || 'Stable'
  } : (liveTelemetry || dashboardData?.telemetry || {
    current_vehicles: 47,
    queue_length: 18,
    waiting_time: 4.2,
    traffic_flow: 82,
    traffic_level: 'HIGH',
    cars: 25, motorcycles: 15, buses: 2, trucks: 5,
    prediction: 'Stable'
  });

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const res = await alertApi.updateStatus(alertId, 'Acknowledged');
      if (res.success) {
        addToast({ type: 'success', title: 'Alert Acknowledged', message: 'Alert status synced with backend database.' });
        fetchDashboard();
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Action Failed', message: err.message });
    }
  };

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
  
  const vehicleDistribution = [
    { name: 'Cars', value: telemetry.cars || 0 },
    { name: 'Motorcycles', value: telemetry.motorcycles || 0 },
    { name: 'Buses', value: telemetry.buses || 0 },
    { name: 'Trucks', value: telemetry.trucks || 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Modes Toggle */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '-10px' }}>
        <button 
          onClick={() => setAppMode('VIDEO_INFERENCE')} 
          style={{ padding: '8px 16px', borderRadius: '8px', border: appMode === 'VIDEO_INFERENCE' ? '2px solid var(--accent)' : '1px solid var(--border-subtle)', background: appMode === 'VIDEO_INFERENCE' ? 'var(--accent)' : 'var(--bg-card)', color: appMode === 'VIDEO_INFERENCE' ? '#fff' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>
          MODE 1 - AI VIDEO INFERENCE
        </button>
        <button 
          onClick={() => setAppMode('DEMO')} 
          style={{ padding: '8px 16px', borderRadius: '8px', border: appMode === 'DEMO' ? '2px solid var(--amber-500)' : '1px solid var(--border-subtle)', background: appMode === 'DEMO' ? 'var(--amber-bg)' : 'var(--bg-card)', color: appMode === 'DEMO' ? 'var(--amber-500)' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>
          MODE 2 - DEMO INFERENCE
        </button>
      </div>
      
      {appMode === 'DEMO' && (
        <div style={{ padding: '12px 20px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: '8px', color: 'var(--amber-500)', fontWeight: 'bold' }}>
          DEMO MODE – Simulated AI Inference from JSON Data
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="glass-card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'var(--bg-card-hero)', border: '1px solid var(--border-subtle)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{getGreeting()}, {user?.name || 'BALAJI EN'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: 0, marginTop: '8px', display: 'flex', gap: '16px' }}>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </p>
        </div>

        {/* Live Traffic Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '8px 18px', borderRadius: '12px', background: level === 'CRITICAL' || level === 'HIGH' ? 'var(--rose-bg)' : level === 'MEDIUM' || level === 'MODERATE' ? 'var(--amber-bg)' : 'var(--emerald-bg)', border: '1px solid transparent', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '13px', color: level === 'CRITICAL' || level === 'HIGH' ? 'var(--rose-400)' : level === 'MEDIUM' || level === 'MODERATE' ? 'var(--amber-400)' : 'var(--emerald-400)' }}>
            <span className={`pulse-indicator ${level === 'CRITICAL' || level === 'HIGH' ? 'red' : level === 'MEDIUM' || level === 'MODERATE' ? 'amber' : 'green'}`} />
            <span>{level.toUpperCase()} CONGESTION</span>
          </div>
          <button onClick={() => fetchDashboard(true)} className="btn-secondary" style={{ padding: '8px 12px' }} title="Refresh">
            <RefreshCw size={14} className={refreshing ? 'radar-spinner' : ''} />
          </button>
        </div>
      </div>

      {/* Core KPI Cards */}
      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard title="Live Vehicle Count" value={telemetry.current_vehicles} unit="total" icon={Car} color="cyan" trend={appMode === 'DEMO' ? 'JSON Inference' : 'Live Video'} trendPositive={true} subtext="Main Gate" />
        <StatCard title="Queue Length" value={telemetry.queue_length} unit="vehicles" icon={TrendingUp} color={telemetry.queue_length > 12 ? 'rose' : 'amber'} trend={telemetry.queue_length > 10 ? 'High' : 'Normal'} trendPositive={telemetry.queue_length <= 10} subtext="Lane 1" />
        <StatCard title="Avg Wait Time" value={telemetry.waiting_time} unit="min" icon={Clock} color="purple" trend="Estimated" trendPositive={false} subtext="Per Vehicle" />
        <StatCard title="Cars" value={telemetry.cars} unit="count" icon={Car} color="cyan" trend="" trendPositive={true} subtext="Detected" />
        <StatCard title="Motorcycles" value={telemetry.motorcycles} unit="count" icon={Activity} color="emerald" trend="" trendPositive={true} subtext="Detected" />
        <StatCard title="Heavy Vehicles" value={(telemetry.buses || 0) + (telemetry.trucks || 0)} unit="count" icon={Bus} color="amber" trend="" trendPositive={false} subtext="Trucks/Buses" />
        <StatCard title="Predicted Status" value={telemetry.prediction || 'Stable'} unit="" icon={Navigation} color="purple" trend="Prototype AI" trendPositive={telemetry.prediction === 'Decreasing' || telemetry.prediction === 'Stable'} subtext="Next 15 mins" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Real-time Trend Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>Vehicle Count Over Time</h3>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData?.sparklines || []}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} /><stop offset="95%" stopColor="#0284c7" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 90]} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card-solid)', borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }} />
                <Area type="monotone" dataKey="vehicles" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#cyanArea)" name="Vehicles" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Distribution Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>Vehicle-Type Distribution</h3>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vehicleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card-solid)', borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
