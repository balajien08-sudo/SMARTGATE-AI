import React, { useState, useEffect } from 'react';
import { Video, Car, Bus, Bike, Truck, RefreshCw, Layers, Gauge, Clock, ShieldAlert } from 'lucide-react';
import { useSocket } from '../context/SocketContext.jsx';
import { trafficApi } from '../services/api.js';
import { LiveCameraFeed } from '../components/LiveCameraFeed.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export function LiveTrafficPage() {
  const { liveTelemetry } = useSocket();
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLiveTraffic = async () => {
    try {
      const res = await trafficApi.getLive();
      if (res.success && res.data) {
        setLiveData(res.data);
      }
    } catch (err) {
      console.error('Failed to load live traffic:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTraffic();
    const interval = setInterval(fetchLiveTraffic, 4000);
    return () => clearInterval(interval);
  }, []);

  const telemetry = liveTelemetry || liveData?.telemetry || {
    vehicle_count: 47,
    cars: 21,
    bikes: 16,
    buses: 6,
    vans: 4,
    average_speed: 18.2,
    queue_length: 14,
    waiting_time: 3.9,
    traffic_level: 'HIGH',
    congestion_score: 72
  };

  if (loading && !liveData) {
    return <LoadingSpinner text="Connecting to Simulated CCTV Video Stream..." size={36} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>College Main Gate — Live Monitoring</h1>
            <DemoBadge size="xs" text="SIMULATED CAMERA FEED" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Real-time computer vision detection stream with bounding box localization & queue telemetry
          </p>
        </div>

        <button
          onClick={fetchLiveTraffic}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <RefreshCw size={14} />
          Refresh Stream
        </button>
      </div>

      {/* Main CCTV Stream HUD Component */}
      <LiveCameraFeed
        telemetry={telemetry}
        detections={liveData?.detections || []}
        onRefresh={fetchLiveTraffic}
      />

      {/* Vehicle Category Breakdown Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Active Vehicle Class Breakdown</h3>
          <DemoBadge size="xs" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div
            className="glass-card"
            style={{
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderLeft: '4px solid var(--cyan-500)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--cyan-bg)',
                color: 'var(--cyan-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Car size={22} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                🚗 Cars & Sedans
              </span>
              <h4 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                {telemetry.cars || 21} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>veh</span>
              </h4>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderLeft: '4px solid var(--emerald-400)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--emerald-bg)',
                color: 'var(--emerald-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bike size={22} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                🏍️ Bikes & 2-Wheelers
              </span>
              <h4 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                {telemetry.bikes || 16} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>veh</span>
              </h4>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderLeft: '4px solid var(--amber-400)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--amber-bg)',
                color: 'var(--amber-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bus size={22} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                🚌 College Buses
              </span>
              <h4 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                {telemetry.buses || 6} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>veh</span>
              </h4>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderLeft: '4px solid var(--purple-400)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--purple-bg)',
                color: 'var(--purple-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                🚐 Vans & Deliveries
              </span>
              <h4 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                {telemetry.vans || 4} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>veh</span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Live Lane Inflow Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Lane 1: Heavy Inbound Traffic</h4>
            <span className="badge badge-high">High Inflow</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Primary lane for college buses, faculty four-wheelers, and commercial deliveries.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Vehicles:</span>
            <strong className="font-mono" style={{ color: 'var(--cyan-500)' }}>{Math.ceil(telemetry.vehicle_count * 0.58)} veh</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Lane 2: 2-Wheelers & Fast Pass</h4>
            <span className="badge badge-normal">Fluid Clearance</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Dedicated student motorcycle approach and digital RFID express pass scanner.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Vehicles:</span>
            <strong className="font-mono" style={{ color: 'var(--emerald-400)' }}>{Math.floor(telemetry.vehicle_count * 0.42)} veh</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
