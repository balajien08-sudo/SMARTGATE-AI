import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, Eye, TrendingUp, AlertTriangle, Sparkles,
  ShieldCheck, CheckCircle2, Clock, Car, Lightbulb, Layers,
  ArrowRight, Info, Video, Database, LayoutDashboard
} from 'lucide-react';
import { aiApi, dashboardApi } from '../services/api.js';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useSocket } from '../context/SocketContext.jsx';

export function AiAnalysisPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { liveTelemetry } = useSocket();

  const fetchInsights = async () => {
    try {
      const res = await dashboardApi.getOverview();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 5000);
    return () => clearInterval(interval);
  }, []);

  const telemetry = liveTelemetry || dashboardData?.telemetry;

  if (loading && !telemetry) {
    return <LoadingSpinner text="Running AI Telemetry Analysis & Prediction Models..." size={36} />;
  }

  const isConnected = !!telemetry;
  const sourceText = telemetry?.source === 'YOLO inference' ? 'AI INFERENCE' : 
                     (telemetry?.source === 'simulated demo' ? 'DEMO / SIMULATED DATA' : 'WAITING FOR AI INFERENCE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>AI Traffic Intelligence</h1>
            <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'var(--purple-bg)', color: 'var(--purple-400)', fontWeight: 700, border: '1px solid var(--purple-border)' }}>
              {sourceText}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Multi-model traffic computer vision, anomaly detection & time-series congestion forecasting
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Latest Inference Results
        </h3>
        {isConnected ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <div><strong>Model:</strong> YOLOv8 (Python Pipeline)</div>
            <div><strong>Source Video:</strong> sample_video/gate_video.mp4</div>
            <div><strong>Inference Timestamp:</strong> {new Date(telemetry?.timestamp || Date.now()).toLocaleString()}</div>
            <div><strong>Frames Processed:</strong> {telemetry?.frames_processed || 'N/A'}</div>
            <div><strong>Total Vehicles:</strong> {telemetry?.vehicle_count || 0}</div>
            <div><strong>Cars:</strong> {telemetry?.cars || 0}</div>
            <div><strong>Motorcycles:</strong> {telemetry?.motorcycles || 0}</div>
            <div><strong>Buses:</strong> {telemetry?.buses || 0}</div>
            <div><strong>Trucks:</strong> {telemetry?.trucks || 0}</div>
            <div><strong>Queue Length:</strong> {telemetry?.queue_length || 0} vehicles</div>
            <div><strong>Congestion Level:</strong> {telemetry?.congestionLevel || telemetry?.traffic_level || 'Low'}</div>
            <div><strong>Data Source:</strong> {sourceText}</div>
          </div>
        ) : (
          <div style={{ padding: '20px', color: 'var(--amber-500)' }}>Waiting for AI inference...</div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
         <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          AI Pipeline Flow
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', color: 'var(--text-main)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Video size={24} color="var(--cyan-500)"/><span style={{ fontSize: '12px', marginTop: '4px' }}>VIDEO</span></div>
            <ArrowRight size={16} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Eye size={24} color="var(--purple-400)"/><span style={{ fontSize: '12px', marginTop: '4px' }}>YOLO DETECTION</span></div>
            <ArrowRight size={16} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Car size={24} color="var(--emerald-400)"/><span style={{ fontSize: '12px', marginTop: '4px' }}>VEHICLE COUNTING</span></div>
            <ArrowRight size={16} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Database size={24} color="var(--amber-400)"/><span style={{ fontSize: '12px', marginTop: '4px' }}>JSON POST</span></div>
            <ArrowRight size={16} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Layers size={24} color="var(--rose-400)"/><span style={{ fontSize: '12px', marginTop: '4px' }}>BACKEND (EXPRESS)</span></div>
            <ArrowRight size={16} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><LayoutDashboard size={24} color="var(--cyan-400)"/><span style={{ fontSize: '12px', marginTop: '4px' }}>DASHBOARD</span></div>
        </div>
      </div>
      
    </div>
  );
}
