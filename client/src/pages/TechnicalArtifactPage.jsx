import React from 'react';
import { GitCommit, Layers, Server, Activity, Database, Zap } from 'lucide-react';

export function TechnicalArtifactPage() {
  const steps = [
    { id: 1, name: 'Input Traffic Video', status: 'Implemented', desc: 'Sample video source for the AI pipeline.' },
    { id: 2, name: 'Frame Preprocessing', status: 'Implemented', desc: 'OpenCV frame extraction & resizing.' },
    { id: 3, name: 'YOLO Vehicle Detection', status: 'Implemented', desc: 'Ultralytics YOLOv8 inference.' },
    { id: 4, name: 'Vehicle Classification', status: 'Implemented', desc: 'Classification into Car, Motorcycle, Bus, Truck.' },
    { id: 5, name: 'Vehicle Counting', status: 'Implemented', desc: 'Counting bounding boxes per frame.' },
    { id: 6, name: 'Traffic Feature Extraction', status: 'Prototype', desc: 'Extracting queue lengths and wait times.' },
    { id: 7, name: 'Congestion Analysis', status: 'Implemented', desc: 'Assigning congestion severity (Low, Medium, High).' },
    { id: 8, name: 'Prediction Logic', status: 'Prototype', desc: 'Rule-based prototype logic for short-term prediction.' },
    { id: 9, name: 'Backend API', status: 'Implemented', desc: 'Node.js/Express ingestion of inference data.' },
    { id: 10, name: 'Dashboard Visualization', status: 'Implemented', desc: 'React real-time analytics and charts.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      <div className="glass-card" style={{ padding: '24px 28px', border: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          AI Technical Pipeline
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          End-to-end architecture from video ingestion to dashboard visualization.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {steps.map((step) => (
          <div key={step.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-pill)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-main)' 
            }}>
              {step.id}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {step.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {step.desc}
              </p>
            </div>

            <div style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              background: step.status === 'Implemented' ? 'var(--emerald-bg)' : step.status === 'Prototype' ? 'var(--amber-bg)' : 'var(--purple-bg)',
              color: step.status === 'Implemented' ? 'var(--emerald-400)' : step.status === 'Prototype' ? 'var(--amber-400)' : 'var(--purple-400)',
              border: `1px solid ${step.status === 'Implemented' ? 'var(--emerald-border)' : step.status === 'Prototype' ? 'var(--amber-border)' : 'var(--purple-border)'}`
            }}>
              {step.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
