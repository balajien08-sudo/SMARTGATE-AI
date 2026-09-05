import React from 'react';
import { DemoBadge } from './DemoBadge.jsx';

export function StatCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'cyan', // cyan, emerald, amber, rose, purple
  subtext,
  showDemoBadge = true,
  className = ''
}) {
  const colorMap = {
    cyan: {
      glow: 'var(--cyan-glow)',
      text: 'var(--cyan-500)',
      bg: 'var(--cyan-bg)',
      border: 'var(--cyan-border)'
    },
    emerald: {
      glow: 'var(--emerald-glow)',
      text: 'var(--emerald-400)',
      bg: 'var(--emerald-bg)',
      border: 'var(--emerald-border)'
    },
    amber: {
      glow: 'var(--amber-glow)',
      text: 'var(--amber-400)',
      bg: 'var(--amber-bg)',
      border: 'var(--amber-border)'
    },
    rose: {
      glow: 'var(--rose-glow)',
      text: 'var(--rose-400)',
      bg: 'var(--rose-bg)',
      border: 'var(--rose-border)'
    },
    purple: {
      glow: 'var(--purple-glow)',
      text: 'var(--purple-400)',
      bg: 'var(--purple-bg)',
      border: 'var(--purple-border)'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`glass-card ${className}`}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          {showDemoBadge && (
            <div style={{ marginTop: '4px' }}>
              <DemoBadge size="xs" />
            </div>
          )}
        </div>

        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: scheme.bg,
              border: `1px solid ${scheme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: scheme.text,
              boxShadow: `0 2px 10px ${scheme.glow}`
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Main value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '13.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
            {unit}
          </span>
        )}
      </div>

      {/* Subtext or Trend */}
      {(subtext || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginTop: '6px' }}>
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                color: trendPositive ? 'var(--emerald-400)' : 'var(--rose-400)',
                fontWeight: 700
              }}
            >
              {trend}
            </span>
          )}
          {subtext && (
            <span style={{ color: 'var(--text-muted)' }}>
              {subtext}
            </span>
          )}
        </div>
      )}

      {/* Subtle bottom glow strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${scheme.text}, transparent)`,
          opacity: 0.7
        }}
      />
    </div>
  );
}
