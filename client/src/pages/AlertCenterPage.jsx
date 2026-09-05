import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ShieldAlert,
  Info,
  RefreshCw,
  PlusCircle,
  MapPin,
  Lightbulb,
  Check,
  CheckCheck
} from 'lucide-react';
import { alertApi } from '../services/api.js';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function AlertCenterPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const { addToast } = useToast();

  const fetchAlerts = async () => {
    try {
      const res = await alertApi.getAlerts(severityFilter, statusFilter);
      if (res.success && res.data) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter, statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      const res = await alertApi.updateStatus(id, newStatus);
      if (res.success) {
        addToast({
          type: 'success',
          title: `Alert Marked as ${newStatus}`,
          message: 'Status updated and recorded in action audit logs.'
        });
        fetchAlerts();
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSimulatedAlert = async () => {
    try {
      const res = await alertApi.createAlert({
        severity: 'Critical',
        title: 'Simulated Gate Rush Surge',
        description: 'Simulated alert triggered for viva demonstration. Sudden influx of student 2-wheelers.',
        location: 'College Main Gate — Approach Road',
        recommended_action: 'Open Secondary Gate (East) to divert oncoming motorcycle queue.'
      });
      if (res.success) {
        addToast({
          type: 'error',
          title: 'Simulated Critical Alert Created',
          message: 'New alert generated in backend database.'
        });
        fetchAlerts();
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  if (loading && !alerts.length) {
    return <LoadingSpinner text="Retrieving Gate Security Alerts..." size={36} />;
  }

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

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
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>Campus Alert Center</h1>
            <DemoBadge size="xs" text="DATABASE CONNECTED" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Automated anomaly detection alerts & human-in-the-loop incident resolution workflows
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCreateSimulatedAlert}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <PlusCircle size={15} />
            Trigger Test Alert
          </button>

          <button
            onClick={fetchAlerts}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '13px' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--rose-400)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE CRITICAL</span>
          <h3 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--rose-400)', margin: '2px 0 0 0' }}>
            {criticalCount}
          </h3>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--amber-400)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL ACTIVE ALERTS</span>
          <h3 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--amber-400)', margin: '2px 0 0 0' }}>
            {activeCount}
          </h3>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--emerald-400)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>RESOLVED TODAY</span>
          <h3 className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--emerald-400)', margin: '2px 0 0 0' }}>
            {alerts.filter(a => a.status === 'Resolved').length}
          </h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="var(--cyan-500)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Filter Alerts:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Severity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">🔴 Critical</option>
              <option value="Warning">🟡 Warning</option>
              <option value="Information">🔵 Information</option>
            </select>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {alerts.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="var(--emerald-400)" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '16px', color: 'var(--text-main)' }}>No Alerts Matching Filter</h4>
            <p style={{ fontSize: '13px', margin: '4px 0 0 0' }}>All clear! Campus gate traffic is operating within baseline parameters.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'Critical';
            const isWarning = alert.severity === 'Warning';
            const isInfo = alert.severity === 'Information';

            let borderColor = isCritical ? 'var(--rose-border)' :
                              isWarning ? 'var(--amber-border)' : 'var(--cyan-border)';
            let badgeBg = isCritical ? 'var(--rose-bg)' :
                          isWarning ? 'var(--amber-bg)' : 'var(--cyan-bg)';
            let badgeColor = isCritical ? 'var(--rose-400)' : isWarning ? 'var(--amber-400)' : 'var(--cyan-500)';

            return (
              <div
                key={alert.id}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'var(--bg-card-solid)'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${borderColor}`,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      {alert.severity.toUpperCase()}
                    </span>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {alert.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      <span>{alert.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.5, margin: 0 }}>
                  {alert.description}
                </p>

                {/* Recommended Action Box */}
                {alert.recommended_action && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'var(--cyan-bg)',
                      border: '1px solid var(--cyan-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '12.5px'
                    }}
                  >
                    <Lightbulb size={16} color="var(--cyan-500)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--cyan-500)' }}>Recommended Action: </strong>
                      <span style={{ color: 'var(--text-main)' }}>{alert.recommended_action}</span>
                    </div>
                  </div>
                )}

                {/* Actions & Status Bar */}
                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: alert.status === 'Active' ? 'var(--rose-bg)' :
                                    alert.status === 'Acknowledged' ? 'var(--amber-bg)' : 'var(--emerald-bg)',
                        color: alert.status === 'Active' ? 'var(--rose-400)' :
                               alert.status === 'Acknowledged' ? 'var(--amber-400)' : 'var(--emerald-400)',
                        border: `1px solid ${alert.status === 'Active' ? 'var(--rose-border)' :
                               alert.status === 'Acknowledged' ? 'var(--amber-border)' : 'var(--emerald-border)'}`
                      }}
                    >
                      {alert.status.toUpperCase()}
                    </span>

                    {alert.acknowledged_by && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        (Ack by {alert.acknowledged_by})
                      </span>
                    )}
                    {alert.resolved_by && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        (Resolved by {alert.resolved_by})
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {alert.status === 'Active' && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'Acknowledged')}
                        disabled={actionLoading === alert.id}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        <Check size={14} />
                        Acknowledge
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'Resolved')}
                        disabled={actionLoading === alert.id}
                        className="btn-emerald"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        <CheckCheck size={14} />
                        Resolve Alert
                      </button>
                    )}

                    {alert.status === 'Resolved' && (
                      <span style={{ fontSize: '12px', color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                        <CheckCircle2 size={14} />
                        Resolved & Logged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
