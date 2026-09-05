import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  Video,
  BrainCircuit,
  AlertTriangle,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Lock,
  Eye,
  Car,
  Layers,
  ArrowDown
} from 'lucide-react';
import { Navbar } from '../components/Navbar.jsx';
import { DemoBadge } from '../components/DemoBadge.jsx';

export function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Camera / Sensor Feed',
      desc: 'Simulated HD video stream captures multi-lane vehicle arrivals at the college entrance approach.',
      icon: Video,
      color: '#0284c7'
    },
    {
      num: '02',
      title: 'AI Vehicle Detection (YOLO)',
      desc: 'Deep learning detects and classifies Cars, Bikes, Buses, and Vans with bounding box localization.',
      icon: Eye,
      color: '#059669'
    },
    {
      num: '03',
      title: 'Traffic & Queue Analysis',
      desc: 'Multi-variate algorithms compute real-time queue length, arrival velocity, and congestion scoring.',
      icon: BrainCircuit,
      color: '#7c3aed'
    },
    {
      num: '04',
      title: 'Predictive Alerts & Actions',
      desc: 'Time-series engine forecasts peak rush surges and recommends opening secondary gate corridors.',
      icon: AlertTriangle,
      color: '#d97706'
    }
  ];

  const highlights = [
    { label: 'Detection Model', val: 'YOLO-v8 (Simulated)', note: 'Multi-class Classification' },
    { label: 'Forecast Horizon', val: '10m / 30m / 60m', note: 'Time-Series Rush Model' },
    { label: 'AI Congestion Index', val: '0 — 100 Score', note: 'Multi-factor Decision Matrix' },
    { label: 'Governance', val: 'Human-in-the-Loop', note: 'Officer Action Verification' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '80px 24px 100px 24px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Project Tag Banner */}
        <div
          className="animate-fade-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'var(--cyan-bg)',
            border: '1px solid var(--cyan-border)',
            marginBottom: '28px'
          }}
        >
          <Sparkles size={14} color="var(--cyan-500)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cyan-500)', letterSpacing: '0.04em' }}>
            COLLEGE AI IMMERSION / C29 INNOVATION PROJECT
          </span>
          <DemoBadge size="xs" text="SIMULATED PROTOTYPE" />
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: 'clamp(38px, 6vw, 68px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '960px',
            marginBottom: '20px',
            color: 'var(--text-main)'
          }}
        >
          SmartGate <span className="gradient-text-cyan">AI</span>
        </h1>

        <h2
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: 'var(--cyan-500)',
            marginBottom: '24px',
            letterSpacing: '-0.01em'
          }}
        >
          “Smarter Gates. Safer Campuses.”
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            lineHeight: 1.6,
            marginBottom: '36px'
          }}
        >
          AI-assisted traffic monitoring and congestion prediction for smarter college entrance management.
          Eliminates morning entrance bottlenecks, predicts vehicle surges, and empowers campus security staff with actionable intelligence.
        </p>

        {/* Hero CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
          <Link to="/login" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
            <Cpu size={18} />
            Launch Command Center
            <ArrowRight size={18} />
          </Link>

          <Link to="/c29-methodology" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            <BarChart3 size={18} />
            View C29 Methodology
          </Link>
        </div>

        {/* Interactive Futuristic Gate Visualization HUD */}
        <div
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: '1060px',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-modal)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Visual Header */}
          <div
            style={{
              padding: '14px 24px',
              background: 'var(--bg-header)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-indicator red" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-main)', fontWeight: 700 }}>
                SIMULATED AI INFLOW SENSOR (COLLEGE MAIN GATE)
              </span>
            </div>
            <DemoBadge text="DEMO SIMULATION ACTIVE" size="xs" />
          </div>

          {/* Visualization Diagram */}
          <div
            style={{
              padding: '40px 24px',
              background: 'var(--bg-hero-gradient)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '30px'
            }}
          >
            {/* Flow Pipeline */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                width: '100%'
              }}
            >
              {steps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      background: 'var(--bg-card-solid)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '20px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${s.color}15`,
                        border: `1px solid ${s.color}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: s.color,
                        marginBottom: '12px'
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: s.color, fontWeight: 800, marginBottom: '4px' }}>
                      STEP {s.num}
                    </span>

                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      {s.title}
                    </h4>

                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pipeline Arrow Bar */}
            <div
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                background: 'var(--cyan-bg)',
                border: '1px solid var(--cyan-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--cyan-500)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <span>Camera Stream</span>
              <span>→</span>
              <span>AI Detection</span>
              <span>→</span>
              <span>Traffic Analysis</span>
              <span>→</span>
              <span>Predictive Alert</span>
              <span>→</span>
              <span>Security Staff Action</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Strip */}
      <section
        style={{
          background: 'var(--bg-card-solid)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '40px 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}
        >
          {highlights.map((h, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                {h.label}
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--cyan-500)', margin: '4px 0' }} className="font-mono">
                {h.val}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{h.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
            Solving Real-World Campus Gate Bottlenecks
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
            Bridging the gap between manual traffic management and proactive AI-assisted campus security.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Problem Card */}
          <div
            className="glass-card"
            style={{
              padding: '32px',
              border: '1px solid var(--rose-border)',
              background: 'var(--rose-bg)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--rose-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--rose-400)', marginBottom: '12px' }}>
              The Real-World Problem
            </h3>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Students, staff, visitors, and transit vehicles experience heavy traffic congestion at the college entrance, especially during peak 08:00–09:30 AM arrival windows.
            </p>

            <ul style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li>Manual gate monitoring cannot compute arrival velocities in real-time.</li>
              <li>Growing queues spill over into municipal public access roads.</li>
              <li>Lack of early surge warnings forces reactive rather than proactive actions.</li>
            </ul>
          </div>

          {/* Solution Card */}
          <div
            className="glass-card"
            style={{
              padding: '32px',
              border: '1px solid var(--cyan-border)',
              background: 'var(--cyan-bg)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(2, 132, 199, 0.15)',
                color: 'var(--cyan-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}
            >
              <CheckCircle2 size={24} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--cyan-500)', marginBottom: '12px' }}>
              The SmartGate AI Solution
            </h3>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              An AI-assisted traffic monitoring system that analyzes vehicle-flow data, detects congestion patterns, predicts increasing traffic, and provides recommendations to security staff.
            </p>

            <ul style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li>Real-time vehicle counting and queue length estimation.</li>
              <li>10m/30m predictive forecasting to pre-empt traffic spikes.</li>
              <li>Human-in-the-loop recommendations for opening secondary gates.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          background: 'var(--bg-header)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ color: 'var(--text-main)' }}>SmartGate AI</strong> — College AI Immersion / C29 Project
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <DemoBadge text="DEMO / SIMULATED DATA" size="xs" />
            <span>“Smarter Gates. Safer Campuses.”</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
