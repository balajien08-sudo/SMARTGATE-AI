import React, { useState, useEffect } from 'react';
import { Camera, Eye, Video, Layers, RefreshCw, Car, Bus, Bike, ShieldAlert } from 'lucide-react';
import { DemoBadge } from './DemoBadge.jsx';

export function LiveCameraFeed({ telemetry, detections = [], onRefresh }) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showLaneGuides, setShowLaneGuides] = useState(true);
  const [activeCam, setActiveCam] = useState('cam-1');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock tick for CCTV timecode
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const count = telemetry?.vehicle_count || 42;
  const queue = telemetry?.queue_length || 12;
  const speed = telemetry?.average_speed || 18.5;
  const level = telemetry?.traffic_level || 'HIGH';

  // Generate dynamic vehicle simulation coordinates
  const simulatedVehicles = [
    { id: 1, type: 'Bus', icon: Bus, lane: 1, x: 22, y: 35, speed: 12, label: 'Transit Bus #04', conf: '99.2%', color: '#f59e0b' },
    { id: 2, type: 'Car', icon: Car, lane: 1, x: 38, y: 55, speed: 16, label: 'Sedan (Faculty)', conf: '98.5%', color: '#00f2fe' },
    { id: 3, type: 'Car', icon: Car, lane: 1, x: 55, y: 72, speed: 14, label: 'Hatchback', conf: '97.8%', color: '#00f2fe' },
    { id: 4, type: 'Bike', icon: Bike, lane: 2, x: 70, y: 32, speed: 24, label: '2-Wheeler (Student)', conf: '96.4%', color: '#10b981' },
    { id: 5, type: 'Bike', icon: Bike, lane: 2, x: 84, y: 48, speed: 22, label: '2-Wheeler', conf: '95.9%', color: '#10b981' },
    { id: 6, type: 'Car', icon: Car, lane: 2, x: 78, y: 78, speed: 19, label: 'SUV (Visitor)', conf: '98.1%', color: '#8b5cf6' }
  ];

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* CCTV Header Bar */}
      <div
        style={{
          background: 'var(--bg-header)',
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-indicator red" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 800, color: 'var(--rose-400)', letterSpacing: '0.08em' }}>
              REC LIVE
            </span>
          </div>

          <div style={{ height: '14px', width: '1px', background: 'var(--border-subtle)' }} />

          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
            {activeCam === 'cam-1' ? 'CAM-01 • COLLEGE MAIN GATE (INBOUND)' : 'CAM-02 • EAST CORRIDOR APPROACH'}
          </span>

          <DemoBadge text="SIMULATED CAMERA FEED" size="xs" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>1080P @ 30FPS</span>
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Main CCTV Feed Viewport */}
      <div
        style={{
          position: 'relative',
          height: '420px',
          background: 'radial-gradient(circle at 50% 50%, #0a1733 0%, #040813 100%)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Radar Scanner Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 242, 254, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 242, 254, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            pointerEvents: 'none'
          }}
        />

        {/* Roadway & Gate Lanes Perspective */}
        <div
          style={{
            position: 'absolute',
            inset: '20px 40px 20px 40px',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            display: 'flex',
            overflow: 'hidden',
            background: 'rgba(7, 14, 28, 0.4)'
          }}
        >
          {/* Lane 1 */}
          <div
            style={{
              flex: 1,
              borderRight: '2px dashed rgba(0, 242, 254, 0.3)',
              position: 'relative',
              padding: '16px'
            }}
          >
            {showLaneGuides && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#00f2fe',
                  background: 'rgba(0, 242, 254, 0.15)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 242, 254, 0.35)'
                }}
              >
                LANE 1: CARS & BUSES (FLOW: {Math.ceil(count * 0.58)} VEH)
              </div>
            )}
          </div>

          {/* Lane 2 */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              padding: '16px'
            }}
          >
            {showLaneGuides && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(16, 185, 129, 0.35)'
                }}
              >
                LANE 2: 2-WHEELERS & FAST PASS (FLOW: {Math.floor(count * 0.42)} VEH)
              </div>
            )}
          </div>
        </div>

        {/* Gate Barrier Horizon Line */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '30px',
            right: '30px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#ef4444',
              background: '#070c1a',
              padding: '1px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            GATE SENSOR BARRIER LINE
          </span>
        </div>

        {/* Simulated Vehicle Bounding Boxes */}
        {simulatedVehicles.map((veh) => {
          const Icon = veh.icon;
          return (
            <div
              key={veh.id}
              style={{
                position: 'absolute',
                top: `${veh.y}%`,
                left: `${veh.x}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                transition: 'all 0.6s ease'
              }}
            >
              {/* Bounding Box Outline */}
              <div
                style={{
                  border: showBoundingBoxes ? `1.5px solid ${veh.color}` : 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  background: showBoundingBoxes ? 'rgba(6, 12, 26, 0.75)' : 'transparent',
                  backdropFilter: showBoundingBoxes ? 'blur(4px)' : 'none',
                  boxShadow: showBoundingBoxes ? `0 0 14px ${veh.color}44` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {showBoundingBoxes && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: veh.color,
                      background: 'rgba(7, 12, 24, 0.95)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      border: `1px solid ${veh.color}55`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {veh.type} • {veh.conf} • {veh.speed} km/h
                  </div>
                )}

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: `${veh.color}22`,
                    border: `1px solid ${veh.color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: veh.color
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Radar Sweep Animation in Corner */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            right: '24px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            background: 'rgba(6, 15, 30, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <div
            className="radar-spinner"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 242, 254, 0.6) 100%)'
            }}
          />
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#00f2fe', zIndex: 2 }}>
            AI RADAR
          </span>
        </div>

        {/* Live HUD Telemetry Widget */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '24px',
            background: 'rgba(6, 12, 26, 0.92)',
            backdropFilter: 'blur(10px)',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ color: '#94a3b8' }}>COUNT: </span>
            <strong style={{ color: '#00f2fe' }}>{count} VEH</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>QUEUE: </span>
            <strong style={{ color: queue > 10 ? '#ef4444' : '#10b981' }}>{queue} IN LINE</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>AVG SPEED: </span>
            <strong style={{ color: '#f8fafc' }}>{speed} km/h</strong>
          </div>
        </div>
      </div>

      {/* CCTV Bottom Controls Bar */}
      <div
        style={{
          background: 'var(--bg-header)',
          padding: '12px 18px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderColor: showBoundingBoxes ? 'var(--cyan-500)' : 'var(--border-subtle)'
            }}
          >
            <Eye size={14} color={showBoundingBoxes ? 'var(--cyan-500)' : 'var(--text-muted)'} />
            Bounding Boxes {showBoundingBoxes ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowLaneGuides(!showLaneGuides)}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderColor: showLaneGuides ? 'var(--emerald-400)' : 'var(--border-subtle)'
            }}
          >
            <Layers size={14} color={showLaneGuides ? 'var(--emerald-400)' : 'var(--text-muted)'} />
            Lane Guides
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setActiveCam(activeCam === 'cam-1' ? 'cam-2' : 'cam-1')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <Video size={14} />
            Switch to {activeCam === 'cam-1' ? 'East Corridor' : 'Main Gate'}
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '12px' }}
              title="Refresh Camera Telemetry"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
