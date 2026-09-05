import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Clock,
  Calendar,
  Filter,
  RefreshCw,
  Car,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { trafficApi } from '../services/api.js';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export function AnalyticsPage() {
  const [period, setPeriod] = useState('today');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await trafficApi.getAnalytics(period);
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading && !analyticsData) {
    return <LoadingSpinner text="Compiling Historical Gate Telemetry & Charts..." size={36} />;
  }

  const {
    hourlyFlow = [],
    vehicleDistribution = [],
    waitingTimeSlots = [],
    weeklyTrend = [],
    congestionFrequency = [],
    summary = {}
  } = analyticsData || {};

  const PIE_COLORS = ['#0284c7', '#059669', '#d97706', '#7c3aed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Page Header with Time Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>Campus Traffic Analytics</h1>
            <DemoBadge size="xs" text="SIMULATED TELEMETRY" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Historical vehicle arrival trends, queue waiting times & peak congestion frequency
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-pill)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          {['today', '7d', '30d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: period === p ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: period === p ? '#ffffff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: period === p ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
              }}
            >
              {p === 'today' ? 'Today (24h)' : p === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL PROCESSED VEHICLES</span>
          <h3 className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--cyan-500)', margin: '4px 0 0 0' }}>
            {summary.totalVolume || 1590} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>veh</span>
          </h3>
        </div>

        <div className="glass-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>RECORDED PEAK HOUR</span>
          <h3 className="font-mono" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--amber-400)', margin: '4px 0 0 0' }}>
            {summary.peakHour || '08:30 - 09:30 AM'}
          </h3>
        </div>

        <div className="glass-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>AVG DAILY QUEUE WAIT</span>
          <h3 className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--purple-400)', margin: '4px 0 0 0' }}>
            {summary.avgDailyWaitTime || '4.2 min'}
          </h3>
        </div>

        <div className="glass-card" style={{ padding: '18px 22px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>BUSIEST DAY OF WEEK</span>
          <h3 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--emerald-400)', margin: '4px 0 0 0' }}>
            {summary.busiestDay || 'Friday'}
          </h3>
        </div>
      </div>

      {/* Chart 1: Hourly Vehicle Flow (Line Chart) */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>1. Hourly Vehicle Arrival Flow</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Inbound vehicle volume across 24-hour campus gate monitoring cycle
            </p>
          </div>
          <DemoBadge size="xs" />
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyFlow}>
              <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
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
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="vehicles" stroke="#0284c7" strokeWidth={3} dot={{ r: 3 }} name="Total Vehicles" />
              <Line type="monotone" dataKey="cars" stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" name="Cars" />
              <Line type="monotone" dataKey="bikes" stroke="#059669" strokeWidth={2} strokeDasharray="3 3" name="2-Wheelers" />
              <Line type="monotone" dataKey="buses" stroke="#d97706" strokeWidth={2} strokeDasharray="3 3" name="Buses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid: Vehicle Type Distribution & Waiting Time */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Chart 2: Vehicle Type Distribution (Donut Chart) */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>2. Vehicle Type Distribution</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Classification share breakdown (Cars, Bikes, Buses, Vans)
              </p>
            </div>
            <DemoBadge size="xs" />
          </div>

          <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="var(--bg-card-solid)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val}% Share`, 'Volume']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Average Waiting Time (Bar Chart) */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>3. Average Gate Waiting Time</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Minutes elapsed in physical queue per operating time slot
              </p>
            </div>
            <DemoBadge size="xs" />
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitingTimeSlots}>
                <XAxis dataKey="slot" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val} Minutes`, 'Avg Wait']}
                />
                <Bar dataKey="avgWaitMin" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Avg Wait (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid: Weekly Traffic Trend & Congestion Frequency */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Chart 4: Weekly Traffic Trend (Area Chart) */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>4. Weekly Traffic Pattern (Mon – Sun)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Day-to-day cumulative vehicular volume
              </p>
            </div>
            <DemoBadge size="xs" />
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
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
                <Area type="monotone" dataKey="totalVehicles" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#emeraldArea)" name="Total Vehicles" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Congestion Frequency (Bar Chart) */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>5. Congestion Frequency by Period</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Monthly bottleneck occurrences and average duration
              </p>
            </div>
            <DemoBadge size="xs" />
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={congestionFrequency} layout="vertical">
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis dataKey="period" type="category" stroke="var(--text-muted)" fontSize={10} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: '12px'
                  }}
                  formatter={(val, name) => [val, name === 'occurrences' ? 'Occurrences/Mo' : 'Duration (min)']}
                />
                <Bar dataKey="occurrences" fill="#d97706" radius={[0, 6, 6, 0]} name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
