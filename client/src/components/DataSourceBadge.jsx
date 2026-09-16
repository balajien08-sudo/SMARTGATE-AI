import React from 'react';
import { Database, Activity, MonitorPlay } from 'lucide-react';

export function DataSourceBadge({ source, size = 'sm' }) {
  const isReal = source?.toLowerCase().includes('real') || source?.toLowerCase().includes('yolo inference');
  const isMock = source?.toLowerCase().includes('mock');
  const isDemo = !isReal && !isMock;

  const colorConfig = isReal 
    ? { bg: 'var(--emerald-bg)', border: 'var(--emerald-border)', text: 'var(--emerald-400)', icon: Activity, label: 'REAL YOLO INFERENCE' }
    : isMock
    ? { bg: 'var(--amber-bg)', border: 'var(--amber-border)', text: 'var(--amber-400)', icon: Database, label: 'STRUCTURED MOCK INFERENCE' }
    : { bg: 'var(--purple-bg)', border: 'var(--purple-border)', text: 'var(--purple-400)', icon: MonitorPlay, label: 'SIMULATED DEMO' };

  const padding = size === 'xs' ? '2px 6px' : size === 'sm' ? '4px 10px' : '6px 14px';
  const fontSize = size === 'xs' ? '9px' : size === 'sm' ? '11px' : '13px';
  const iconSize = size === 'xs' ? 10 : size === 'sm' ? 12 : 14;

  const Icon = colorConfig.icon;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        borderRadius: '8px',
        background: colorConfig.bg,
        border: `1px solid ${colorConfig.border}`,
        color: colorConfig.text,
        fontFamily: 'var(--font-mono)',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.5px',
      }}
      title={`Data Source: ${source}`}
    >
      <Icon size={iconSize} />
      <span>{colorConfig.label}</span>
    </div>
  );
}
