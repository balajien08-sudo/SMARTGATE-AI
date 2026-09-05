import React, { useState, useEffect } from 'react';
import {
  DoorClosed,
  DoorOpen,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  History,
  RefreshCw,
  Clock,
  UserCheck
} from 'lucide-react';
import { gateApi } from '../services/api.js';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function GateManagementPage() {
  const [gates, setGates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  const { addToast } = useToast();

  const fetchGateData = async () => {
    try {
      const [gatesRes, logsRes] = await Promise.all([
        gateApi.getGates(),
        gateApi.getLogs()
      ]);
      if (gatesRes.success) setGates(gatesRes.data);
      if (logsRes.success) setLogs(logsRes.data);
    } catch (err) {
      console.error('Failed to load gate data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateData();
  }, []);

  const handleToggleGate = async (gateId, newStatus) => {
    setActionInProgress(gateId);
    try {
      const res = await gateApi.updateStatus(gateId, newStatus);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Simulated Gate Actuation',
          message: `${res.data.name} switched to ${newStatus}. Logged to audit trail.`
        });
        fetchGateData();
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Gate Operation Failed',
        message: err.message
      });
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading && !gates.length) {
    return <LoadingSpinner text="Connecting to Gate Actuation Controllers..." size={36} />;
  }

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
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>Campus Gate Management</h1>
            <DemoBadge size="xs" text="SIMULATED CONTROLS" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            Simulated barrier controls, secondary lane diverters & emergency response corridors
          </p>
        </div>

        <button
          onClick={fetchGateData}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <RefreshCw size={14} />
          Refresh Status
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div
        style={{
          padding: '14px 20px',
          borderRadius: '14px',
          background: 'var(--purple-bg)',
          border: '1px solid var(--purple-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={20} color="var(--purple-400)" />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <strong>SIMULATED GATE CONTROL</strong> — Actions trigger virtual barrier state transitions for academic demonstration. No physical motorized actuators connected.
          </span>
        </div>
        <DemoBadge size="xs" />
      </div>

      {/* Interactive Gate Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
        {gates.map((gate) => {
          const isOpen = gate.status === 'Open';
          const isAvailable = gate.status === 'Available';
          const isClosed = gate.status === 'Closed';

          let statusColor = isOpen ? 'var(--emerald-400)' : isAvailable ? 'var(--cyan-500)' : 'var(--rose-400)';
          let statusBg = isOpen ? 'var(--emerald-bg)' : isAvailable ? 'var(--cyan-bg)' : 'var(--rose-bg)';
          let statusBorder = isOpen ? 'var(--emerald-border)' : isAvailable ? 'var(--cyan-border)' : 'var(--rose-border)';

          return (
            <div
              key={gate.id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: `1px solid ${statusBorder}`,
                boxShadow: 'var(--shadow-card)',
                background: 'var(--bg-card-solid)'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: statusBg,
                      border: `1px solid ${statusBorder}`,
                      color: statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isOpen || isAvailable ? <DoorOpen size={22} /> : <DoorClosed size={22} />}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: statusBg,
                      color: statusColor,
                      border: `1px solid ${statusBorder}`
                    }}
                  >
                    {gate.status === 'Open' ? '🟢 OPEN' : gate.status === 'Available' ? '🟢 AVAILABLE' : '🔴 CLOSED'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  {gate.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Type: <strong style={{ color: 'var(--text-main)' }}>{gate.type}</strong> • Max Capacity: {gate.capacity_rate} vehicles/min
                </p>

                {/* Flow indicator */}
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--bg-pill)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '20px',
                    fontSize: '12.5px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Current Flow Rate:</span>
                  <strong className="font-mono" style={{ color: isOpen || isAvailable ? 'var(--cyan-500)' : 'var(--text-muted)' }}>
                    {gate.current_flow || 0} veh/min
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                {gate.type === 'Emergency Lane' ? (
                  <button
                    onClick={() => handleToggleGate(gate.id, gate.status === 'Available' ? 'Restricted' : 'Available')}
                    disabled={actionInProgress === gate.id}
                    className={gate.status === 'Available' ? 'btn-rose' : 'btn-emerald'}
                    style={{ width: '100%', fontSize: '13px', padding: '10px' }}
                  >
                    <ShieldAlert size={15} />
                    {gate.status === 'Available' ? 'Restrict Emergency Lane' : 'Activate Emergency Lane'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleToggleGate(gate.id, 'Open')}
                      disabled={isOpen || actionInProgress === gate.id}
                      className="btn-emerald"
                      style={{
                        flex: 1,
                        fontSize: '13px',
                        padding: '10px',
                        opacity: isOpen ? 0.5 : 1,
                        cursor: isOpen ? 'default' : 'pointer'
                      }}
                    >
                      <Unlock size={14} />
                      Open Gate
                    </button>

                    <button
                      onClick={() => handleToggleGate(gate.id, 'Closed')}
                      disabled={isClosed || actionInProgress === gate.id}
                      className="btn-rose"
                      style={{
                        flex: 1,
                        fontSize: '13px',
                        padding: '10px',
                        opacity: isClosed ? 0.5 : 1,
                        cursor: isClosed ? 'default' : 'pointer'
                      }}
                    >
                      <Lock size={14} />
                      Close Gate
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Logs Audit Trail */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={18} color="var(--cyan-500)" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>Security Action & Actuation Audit Trail</h3>
          </div>
          <DemoBadge size="xs" text="PERSISTED LOGS" />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Timestamp</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Operator</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Action</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Target Gate / Location</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-pill)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--cyan-500)', fontWeight: 700 }}>
                    {log.user_name}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 600 }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {log.gate_id}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
