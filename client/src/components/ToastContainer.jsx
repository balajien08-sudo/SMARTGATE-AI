import React from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let borderGlow = 'var(--cyan-border)';
        let IconComponent = Info;
        let iconColor = 'var(--cyan-500)';

        if (toast.type === 'success') {
          borderGlow = 'var(--emerald-border)';
          IconComponent = CheckCircle2;
          iconColor = 'var(--emerald-400)';
        } else if (toast.type === 'warning') {
          borderGlow = 'var(--amber-border)';
          IconComponent = AlertTriangle;
          iconColor = 'var(--amber-400)';
        } else if (toast.type === 'error') {
          borderGlow = 'var(--rose-border)';
          IconComponent = XCircle;
          iconColor = 'var(--rose-400)';
        }

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              background: 'var(--bg-glass-strong)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${borderGlow}`,
              boxShadow: 'var(--shadow-modal)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              color: 'var(--text-main)'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              <IconComponent size={20} color={iconColor} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>
                {toast.title}
              </h5>
              {toast.message && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
