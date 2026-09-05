import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading Telemetry...', size = 28 }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '14px',
        color: 'var(--text-muted)'
      }}
    >
      <Loader2 size={size} className="radar-spinner" style={{ color: 'var(--cyan-500)' }} />
      <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', fontWeight: 600 }}>
        {text}
      </span>
    </div>
  );
}
