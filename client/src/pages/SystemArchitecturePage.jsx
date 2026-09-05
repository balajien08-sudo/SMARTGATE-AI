import React, { useState } from 'react';
import {
  Network,
  Video,
  Eye,
  BrainCircuit,
  Cpu,
  AlertTriangle,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';
import { DemoBadge } from '../components/DemoBadge.jsx';

export function SystemArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState(null);

  const architectureNodes = [
    {
      id: 'node-1',
      title: 'COLLEGE GATE',
      category: 'Physical Environment',
      icon: '🏛️',
      desc: 'Physical entrance infrastructure accommodating multi-lane vehicular arrival (cars, bikes, buses, vans).',
      arrowLabel: 'Raw Physical Traffic Flow',
      tech: 'On-premise Gate Perimeter'
    },
    {
      id: 'node-2',
      title: 'CAMERA / SENSOR DATA',
      category: 'Perception Layer',
      icon: '📹',
      desc: 'Optical video capture feeds from inbound approach cameras and ultrasonic barrier presence sensors.',
      arrowLabel: 'Raw Video Feed (RTSP/H.264)',
      tech: '1080p 30FPS Simulated Stream'
    },
    {
      id: 'node-3',
      title: 'DATA ACQUISITION',
      category: 'Ingestion Layer',
      icon: '📡',
      desc: 'Real-time video frame buffering, frame sampling rate normalization, and stream synchronization.',
      arrowLabel: 'Synchronized Video Frames',
      tech: 'Node.js Stream Buffer'
    },
    {
      id: 'node-4',
      title: 'PREPROCESSING',
      category: 'Computer Vision Prep',
      icon: '⚙️',
      desc: 'Frame resizing, contrast enhancement, ROI (Region of Interest) lane masking, and noise filtering.',
      arrowLabel: 'Processed Normalized Frames',
      tech: 'Perspective Transformation & Grid Matrix'
    },
    {
      id: 'node-5',
      title: 'AI VEHICLE DETECTION (YOLO-Based Detection)',
      category: 'Core AI Perception',
      icon: '🤖',
      desc: 'Real-time multi-class object detection identifying Cars, 2-Wheelers, Transit Buses, and Delivery Vans with bounding boxes.',
      arrowLabel: 'Detected Vehicle Bounding Boxes & Classes',
      tech: 'YOLO-v8 Architecture (Conceptual Model)'
    },
    {
      id: 'node-6',
      title: 'VEHICLE COUNTING',
      category: 'Telemetry Extraction',
      icon: '🔢',
      desc: 'Virtual tripwire boundary tracking to compute instantaneous vehicle counts and lane density distributions.',
      arrowLabel: 'Lane Count Arrays & Densities',
      tech: 'Centroid Tracking & Optical Crossing Logic'
    },
    {
      id: 'node-7',
      title: 'TRAFFIC PATTERN ANALYSIS',
      category: 'Heuristics & Spatial Model',
      icon: '📊',
      desc: 'Queue length estimation, vehicle velocity reduction tracking, and headway gap calculation.',
      arrowLabel: 'Traffic Feature Vectors (Velocity, Queue Length)',
      tech: 'Dynamic Queue Estimation Matrix'
    },
    {
      id: 'node-8',
      title: 'TIME-SERIES PREDICTION',
      category: 'Predictive Analytics',
      icon: '📈',
      desc: 'Auto-regressive trend forecasting model estimating 10-minute and 30-minute rush arrival probabilities.',
      arrowLabel: 'Predicted Rush Surges & Horizon Score',
      tech: 'Auto-Regressive Rush Pattern Model'
    },
    {
      id: 'node-9',
      title: 'CONGESTION DECISION LOGIC',
      category: 'Decision Engine',
      icon: '🧠',
      desc: 'Computes composite Congestion Index (0–100) and classifies operational state: NORMAL, MODERATE, HIGH, CRITICAL.',
      arrowLabel: 'Congestion State Classification',
      tech: 'Multi-factor Decision Matrix'
    },
    {
      id: 'node-10',
      title: 'ALERT GENERATION',
      category: 'Event Dispatcher',
      icon: '🚨',
      desc: 'Automated threshold evaluators dispatching categorized alerts (Critical, Warning, Info) with mitigation recommendations.',
      arrowLabel: 'Structured Alert Payload',
      tech: 'Socket.IO Real-time Broadcaster'
    },
    {
      id: 'node-11',
      title: 'DASHBOARD / UI',
      category: 'Command Center',
      icon: '💻',
      desc: 'Startup-grade cyber frontend displaying live CCTV HUD, KPI cards, charts, and interactive controls.',
      arrowLabel: 'Visual Telemetry & Recommendations',
      tech: 'React 18 + Vite + Recharts + WebSockets'
    },
    {
      id: 'node-12',
      title: 'SECURITY STAFF',
      category: 'Human Governance',
      icon: '👮',
      desc: 'On-duty campus security officers and gate operators evaluating system recommendations.',
      arrowLabel: 'Human Decision & Assessment',
      tech: 'Authorized Operator Session'
    },
    {
      id: 'node-13',
      title: 'HUMAN VERIFICATION',
      category: 'Human-in-the-Loop Safeguard',
      icon: '🛡️',
      desc: 'Mandatory human approval gate preventing accidental automated lockouts and ensuring safety compliance.',
      arrowLabel: 'Staff Confirmed Action Plan',
      tech: 'Responsible AI Verification Barrier'
    },
    {
      id: 'node-14',
      title: 'TRAFFIC MANAGEMENT ACTION',
      category: 'Execution',
      icon: '🚦',
      desc: 'Opening Secondary Gate (East Corridor), manual express wave-through, or activating dedicated emergency corridor.',
      arrowLabel: 'Ground Intervention Results',
      tech: 'Simulated Gate Barrier Actuation'
    },
    {
      id: 'node-15',
      title: 'FEEDBACK & MODEL OPTIMIZATION',
      category: 'Continuous Learning Loop',
      icon: '↺',
      desc: 'Action outcome logging feeds back into prediction recalibration and baseline threshold refinement.',
      arrowLabel: 'Closed Loop Calibration Data (↺)',
      tech: 'Audit Log & Parameter Optimization'
    }
  ];

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
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>System Architecture & AI Pipeline</h1>
            <DemoBadge size="xs" text="C29 PIPELINE SPEC" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Complete end-to-end data flow: Edge capture → YOLO detection → Predictive logic → Human verification
          </p>
        </div>
      </div>

      {/* Human-in-the-Loop Key Principle Banner */}
      <div
        style={{
          padding: '18px 24px',
          borderRadius: '16px',
          background: 'var(--cyan-bg)',
          border: '1px solid var(--cyan-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--cyan-bg)',
            border: '1px solid var(--cyan-border)',
            color: 'var(--cyan-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <UserCheck size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            Human-in-the-Loop Operational Principle
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            “AI detects and recommends. Human staff verify and take action.” All automated congestion forecasts and gate diversion advisories require security operator verification prior to barrier actuation.
          </p>
        </div>
      </div>

      {/* Interactive Vertical Flow Diagram */}
      <div
        className="glass-card"
        style={{
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--bg-card-hero)'
        }}
      >
        <div style={{ maxWidth: '780px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {architectureNodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isCoreAi = node.id === 'node-5' || node.id === 'node-8' || node.id === 'node-9';
            const isHuman = node.id === 'node-12' || node.id === 'node-13';

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className="glass-card"
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    border: isSelected
                      ? '2px solid var(--cyan-500)'
                      : isCoreAi
                      ? '1.5px solid var(--purple-border)'
                      : isHuman
                      ? '1.5px solid var(--emerald-border)'
                      : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? 'var(--cyan-bg)'
                      : isCoreAi
                      ? 'var(--purple-bg)'
                      : isHuman
                      ? 'var(--emerald-bg)'
                      : 'var(--bg-card-solid)',
                    boxShadow: isSelected
                      ? '0 0 20px var(--cyan-glow)'
                      : 'var(--shadow-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '24px' }}>{node.icon}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: isCoreAi ? 'var(--purple-400)' : isHuman ? 'var(--emerald-400)' : 'var(--cyan-500)', fontWeight: 800 }}>
                          {node.category.toUpperCase()}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0' }}>
                        {node.title}
                      </h4>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                        {node.desc}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-pill)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      {node.tech}
                    </span>
                  </div>
                </div>

                {/* Down Arrow with Explicit Label */}
                {index < architectureNodes.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      margin: '8px 0',
                      gap: '4px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--cyan-500)',
                        background: 'var(--cyan-bg)',
                        padding: '3px 12px',
                        borderRadius: '999px',
                        border: '1px solid var(--cyan-border)',
                        fontWeight: 700
                      }}
                    >
                      ↓ {node.arrowLabel}
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
