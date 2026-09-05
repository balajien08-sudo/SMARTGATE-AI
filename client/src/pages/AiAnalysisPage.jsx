import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Eye,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  Lightbulb,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { aiApi } from '../services/api.js';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export function AiAnalysisPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const res = await aiApi.getInsights();
      if (res.success && res.data) {
        setAnalysisData(res.data);
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

  if (loading && !analysisData) {
    return <LoadingSpinner text="Running AI Telemetry Analysis & Prediction Models..." size={36} />;
  }

  const analysis = analysisData?.current_analysis || {
    status: 'HIGH CONGESTION RISK',
    score: 74,
    confidence: 94,
    summary: 'AI has detected a rapid increase in vehicle arrivals at the main college gate.',
    progression: {
      current: 'Current Inflow (42 veh/min)',
      transition: 'Increasing Trend (↑ 24%)',
      predicted: 'Predicted High (Next 10m)'
    }
  };

  const predictions = analysisData?.prediction_summary || {};
  const insightCards = analysisData?.insight_cards || [];
  const aiTechniques = analysisData?.ai_techniques || [];

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
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>AI Traffic Intelligence</h1>
            <DemoBadge size="xs" text="SIMULATED AI PREDICTION" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Multi-model traffic computer vision, anomaly detection & time-series congestion forecasting
          </p>
        </div>

        <div
          style={{
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'var(--purple-bg)',
            border: '1px solid var(--purple-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--purple-400)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={14} />
          <span>Demo Model Score: {analysis.confidence}%</span>
        </div>
      </div>

      {/* Primary Current Analysis Card */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          background: 'var(--bg-card-hero)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan-500)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              CURRENT AI TELEMETRY DIAGNOSIS
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--rose-400)', margin: '6px 0 0 0' }}>
              {analysis.status}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Congestion Index</span>
              <strong className="font-mono" style={{ fontSize: '20px', color: 'var(--amber-400)' }}>
                {analysis.score}/100
              </strong>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Confidence Score</span>
              <strong className="font-mono" style={{ fontSize: '20px', color: 'var(--cyan-500)' }}>
                {analysis.confidence}%
              </strong>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
          {analysis.summary}
        </p>

        {/* Progression Indicator: Current -> Increasing -> Predicted High */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'var(--bg-pill)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="pulse-indicator green" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>State 1: Baseline</span>
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{analysis.progression?.current}</strong>
            </div>
          </div>

          <ArrowRight size={18} color="var(--cyan-500)" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="pulse-indicator amber" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>State 2: Inflow Trend</span>
              <strong style={{ fontSize: '13px', color: 'var(--amber-400)' }}>{analysis.progression?.transition}</strong>
            </div>
          </div>

          <ArrowRight size={18} color="var(--cyan-500)" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="pulse-indicator red" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>State 3: Predictive Surge</span>
              <strong style={{ fontSize: '13px', color: 'var(--rose-400)' }}>{analysis.progression?.predicted}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 AI Insight Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>Real-Time AI Insight Cards</h3>
          <span style={{ fontSize: '12px', color: 'var(--purple-400)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            AI Recommendation — Human Verification Required
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {insightCards.map((card) => {
            const isRec = card.type === 'recommendation';
            return (
              <div
                key={card.id}
                className="glass-card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isRec ? '1px solid var(--cyan-border)' : '1px solid var(--border-subtle)',
                  background: isRec ? 'var(--cyan-bg)' : 'var(--bg-card-solid)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{card.icon}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {card.title}
                      </h4>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '16px' }}>
                    {card.content}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: isRec ? 'var(--cyan-500)' : 'var(--text-muted)',
                      fontWeight: 700
                    }}
                  >
                    {card.badge}
                  </span>
                  {isRec && <DemoBadge size="xs" text="VERIFY ACTION" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Prediction Horizons (Next 10m, 30m, 60m) */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Time-Series Predictive Forecasting</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Multi-horizon forward projection based on arrival velocity & rush-hour profile matching
            </p>
          </div>
          <DemoBadge size="xs" text="SIMULATED AI PREDICTION" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* 10 Min */}
          <div
            style={{
              background: 'var(--rose-bg)',
              border: '1px solid var(--rose-border)',
              borderRadius: '14px',
              padding: '18px'
            }}
          >
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--rose-400)', fontWeight: 800 }}>
              NEXT 10 MINUTES
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0' }}>
              High Congestion
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Score: <strong style={{ color: 'var(--cyan-500)' }}>{predictions.next10Min?.score || 78}% Demo Score</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {predictions.next10Min?.explanation || 'Vehicle arrivals accelerating during morning entrance window.'}
            </p>
          </div>

          {/* 30 Min */}
          <div
            style={{
              background: 'var(--amber-bg)',
              border: '1px solid var(--amber-border)',
              borderRadius: '14px',
              padding: '18px'
            }}
          >
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--amber-400)', fontWeight: 800 }}>
              NEXT 30 MINUTES
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0' }}>
              Peak Rush Influx
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Score: <strong style={{ color: 'var(--cyan-500)' }}>{predictions.next30Min?.score || 85}% Demo Score</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Anticipated transition toward steady-state campus arrival volume.
            </p>
          </div>

          {/* 60 Min */}
          <div
            style={{
              background: 'var(--emerald-bg)',
              border: '1px solid var(--emerald-border)',
              borderRadius: '14px',
              padding: '18px'
            }}
          >
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--emerald-400)', fontWeight: 800 }}>
              NEXT 60 MINUTES
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0' }}>
              Off-Peak Baseline
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Score: <strong style={{ color: 'var(--cyan-500)' }}>{predictions.next60Min?.score || 82}% Demo Score</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Expected return to fluid standard gate throughput operations.
            </p>
          </div>
        </div>
      </div>

      {/* AI Techniques Breakdown Section */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
          Conceptual AI Architecture & Methodologies
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {aiTechniques.map((tech, i) => (
            <div key={i} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-demo">{tech.tag}</span>
                <span style={{ fontSize: '11px', color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  ● {tech.status}
                </span>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                {tech.name}
              </h4>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {tech.description}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  CORE CAPABILITIES:
                </span>
                <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {tech.capabilities.map((cap, cIdx) => (
                    <li key={cIdx}>{cap}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
