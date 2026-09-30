import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Clock, Car, Info, CheckCircle2, Save, MapPin } from 'lucide-react';

export function FieldObservationPage() {
  const [observations, setObservations] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    location: '',
    observation_date: '',
    duration_minutes: '',
    total_vehicles: '',
    max_queue_length: '',
    average_waiting_time: '',
    peak_period: '',
    notes: ''
  });

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('field_observations');
    if (saved) {
      setObservations(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newObs = {
      ...formData,
      id: Date.now(),
      verified: true
    };
    const updated = [newObs, ...observations];
    setObservations(updated);
    localStorage.setItem('field_observations', JSON.stringify(updated));
    setFormData({
      location: '',
      observation_date: '',
      duration_minutes: '',
      total_vehicles: '',
      max_queue_length: '',
      average_waiting_time: '',
      peak_period: '',
      notes: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      <div className="glass-card" style={{ padding: '24px 28px', border: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Field Observations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Manual traffic observations recorded at the college gates for AI validation.
        </p>
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: '8px', color: 'var(--amber-400)', fontSize: '13px', display: 'flex', gap: '8px' }}>
          <Info size={16} />
          <span>Demo Data – Replace with Actual Field Observation. Do NOT fabricate real field-observation values.</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          Add New Observation
        </h3>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Gate Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Main Gate" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Observation Date</label>
            <input type="date" name="observation_date" value={formData.observation_date} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Observation Duration (minutes)</label>
            <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} placeholder="e.g. 60" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total Vehicles Observed</label>
            <input type="number" name="total_vehicles" value={formData.total_vehicles} onChange={handleChange} placeholder="e.g. 150" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Maximum Queue Length (vehicles)</label>
            <input type="number" name="max_queue_length" value={formData.max_queue_length} onChange={handleChange} placeholder="e.g. 12" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Average Waiting Time (minutes)</label>
            <input type="number" name="average_waiting_time" value={formData.average_waiting_time} onChange={handleChange} placeholder="e.g. 5" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Peak Traffic Period</label>
            <input type="text" name="peak_period" value={formData.peak_period} onChange={handleChange} placeholder="e.g. 08:30 AM - 09:00 AM" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }} required />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              <Save size={16} /> Save Observation
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {observations.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Info size={32} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3>No observations recorded yet.</h3>
            <p>Please enter actual data from the college gate.</p>
          </div>
        ) : (
          observations.map((obs) => (
            <div key={obs.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} /> {obs.location}
                </h3>
                {obs.verified ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px', background: 'var(--emerald-bg)', color: 'var(--emerald-400)', borderRadius: '6px', fontWeight: 600 }}>
                    <CheckCircle2 size={12} /> Verified
                  </span>
                ) : null}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} /> <span>Date: {obs.observation_date || 'Not entered'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} /> <span>Duration: {obs.duration_minutes ? `${obs.duration_minutes} mins` : 'Not entered'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={14} /> <span>Total Vehicles: {obs.total_vehicles || 'Not entered'}</span>
                </div>
                <div>
                  <strong>Max Queue Length:</strong> {obs.max_queue_length ? `${obs.max_queue_length} vehicles` : 'Not entered'}
                </div>
                <div>
                  <strong>Average Wait Time:</strong> {obs.average_waiting_time ? `${obs.average_waiting_time} mins` : 'Not entered'}
                </div>
                <div>
                  <strong>Peak Period:</strong> {obs.peak_period || 'Not entered'}
                </div>
                <div>
                  <strong>Notes:</strong> {obs.notes || 'None'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
