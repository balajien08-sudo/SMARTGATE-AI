import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Clock, Car, Info, CheckCircle2 } from 'lucide-react';
import { trafficApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function FieldObservationPage() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchObservations();
  }, []);

  const fetchObservations = async () => {
    try {
      setLoading(true);
      const res = await trafficApi.getObservations();
      if (res.success) {
        setObservations(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      <div className="glass-card" style={{ padding: '24px 28px', border: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Field Observations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Manual traffic observations recorded by students at the college gates for AI validation.
        </p>
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: '8px', color: 'var(--amber-400)', fontSize: '13px', display: 'flex', gap: '8px' }}>
          <Info size={16} />
          <span>Field values are based on direct student observation and must not be confused with AI-generated demo data.</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading Observations..." />
      ) : error ? (
        <div className="glass-card" style={{ padding: '24px', color: 'var(--rose-400)' }}>Error: {error}</div>
      ) : observations.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Info size={32} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3>No observations recorded yet.</h3>
          <p>Please enter actual data from the college gate.</p>
          <div style={{ marginTop: '16px', display: 'inline-flex', padding: '6px 12px', background: 'var(--rose-bg)', color: 'var(--rose-400)', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
            Field Data Status: Pending Verification
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {observations.map((obs) => (
            <div key={obs.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{obs.location}</h3>
                {obs.verified ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px', background: 'var(--emerald-bg)', color: 'var(--emerald-400)', borderRadius: '6px', fontWeight: 600 }}>
                    <CheckCircle2 size={12} /> Verified by Student Observation
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', padding: '4px 8px', background: 'var(--rose-bg)', color: 'var(--rose-400)', borderRadius: '6px', fontWeight: 600 }}>
                    Pending Verification
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} /> <span>Date: {obs.observation_date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} /> <span>Duration: {obs.duration_minutes} mins</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={14} /> <span>Total Vehicles: {obs.total_vehicles}</span>
                </div>
                <div>
                  <strong>Max Queue Length:</strong> {obs.max_queue_length || 'Not entered yet'}
                </div>
                <div>
                  <strong>Average Wait Time:</strong> {obs.average_waiting_time ? `${obs.average_waiting_time} mins` : 'Not entered yet'}
                </div>
                <div>
                  <strong>Peak Period:</strong> {obs.peak_period || 'Not entered yet'}
                </div>
                <div>
                  <strong>Notes:</strong> {obs.notes || 'No notes provided'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
