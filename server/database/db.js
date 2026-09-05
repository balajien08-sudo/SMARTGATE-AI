import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

// Flag to track database provider
let usePostgres = false;
let pool = null;

// In-memory relational store fallback
export const memStore = {
  users: [],
  gates: [],
  traffic_readings: [],
  alerts: [],
  ai_predictions: [],
  action_logs: [],
  settings: {
    simulationSpeed: 1,
    isSimulationRunning: true,
    activeCongestionScenario: 'PEAK_MORNING'
  }
};

let autoIncrementIds = {
  users: 1,
  traffic_readings: 1,
  alerts: 1,
  ai_predictions: 1,
  action_logs: 1
};

// Initialize DB connection
export async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 3000
      });
      const client = await pool.connect();
      client.release();
      usePostgres = true;
      console.log('✅ Connected to PostgreSQL Database successfully.');
      return;
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed (' + err.message + '). Falling back to internal resilient memory store.');
      usePostgres = false;
    }
  } else {
    console.log('ℹ️ No DATABASE_URL specified. Running with active internal high-performance simulation data store.');
  }

  // Pre-seed memory store
  await seedMemoryStore();
}

export async function query(text, params = []) {
  if (usePostgres && pool) {
    return pool.query(text, params);
  }
  // If in memory fallback, execute in-memory query handler
  return handleMemoryQuery(text, params);
}

// In-memory SQL/Query Handler for fallback mode
function handleMemoryQuery(text, params) {
  const normalized = text.trim().replace(/\s+/g, ' ');
  // Basic query parsing for common app operations
  if (normalized.startsWith('SELECT * FROM users WHERE email = $1')) {
    const user = memStore.users.find(u => u.email.toLowerCase() === params[0].toLowerCase());
    return { rows: user ? [user] : [] };
  }
  if (normalized.startsWith('SELECT * FROM users WHERE id = $1')) {
    const user = memStore.users.find(u => u.id === Number(params[0]));
    return { rows: user ? [user] : [] };
  }
  if (normalized.startsWith('SELECT * FROM gates')) {
    return { rows: [...memStore.gates] };
  }
  if (normalized.startsWith('SELECT * FROM alerts')) {
    return { rows: [...memStore.alerts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
  }
  return { rows: [] };
}

// Seed memory store with initial state & demo accounts
export async function seedMemoryStore() {
  if (memStore.users.length > 0) return;

  const passwordHash = await bcrypt.hash('3329', 10);
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const staffHash = await bcrypt.hash('Staff@123', 10);

  // 1. Seed Users
  memStore.users = [
    {
      id: autoIncrementIds.users++,
      name: 'BALAJI EN',
      email: 'balajien08@gmail.com',
      password_hash: passwordHash,
      role: 'Administrator',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: autoIncrementIds.users++,
      name: 'Campus Security Lead',
      email: 'security@smartgate.ai',
      password_hash: staffHash,
      role: 'Security Staff',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: autoIncrementIds.users++,
      name: 'Faculty Observer',
      email: 'viewer@smartgate.ai',
      password_hash: adminHash,
      role: 'Viewer',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  // 2. Seed Gates
  memStore.gates = [
    {
      id: 'gate-main-01',
      name: 'College Main Gate',
      type: 'Main Gate',
      status: 'Open',
      capacity_rate: 35,
      current_flow: 28,
      is_emergency: false,
      last_updated: new Date().toISOString()
    },
    {
      id: 'gate-secondary-02',
      name: 'Secondary Gate (East Entrance)',
      type: 'Secondary Gate',
      status: 'Closed',
      capacity_rate: 20,
      current_flow: 0,
      is_emergency: false,
      last_updated: new Date().toISOString()
    },
    {
      id: 'gate-emergency-03',
      name: 'Emergency / VIP Corridor',
      type: 'Emergency Lane',
      status: 'Available',
      capacity_rate: 15,
      current_flow: 0,
      is_emergency: true,
      last_updated: new Date().toISOString()
    }
  ];

  // 3. Seed historical traffic readings (last 24 hours in 1-hour chunks)
  const now = Date.now();
  memStore.traffic_readings = [];
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600 * 1000).toISOString();
    const hour = new Date(timestamp).getHours();
    
    // Simulate typical college rush hours: 8-10 AM and 4-6 PM
    let baseMultiplier = 0.3;
    if (hour >= 8 && hour <= 10) baseMultiplier = 1.4;
    else if (hour >= 11 && hour <= 13) baseMultiplier = 0.7;
    else if (hour >= 16 && hour <= 18) baseMultiplier = 1.2;
    else if (hour >= 19 && hour <= 22) baseMultiplier = 0.5;

    const vehicle_count = Math.floor((30 + Math.random() * 25) * baseMultiplier);
    const cars = Math.floor(vehicle_count * 0.45);
    const bikes = Math.floor(vehicle_count * 0.35);
    const buses = Math.floor(vehicle_count * 0.12);
    const vans = vehicle_count - cars - bikes - buses;
    const queue_length = Math.max(0, Math.floor((vehicle_count - 25) * 0.8));
    const average_speed = +(Math.max(8, 32 - queue_length * 1.2)).toFixed(1);
    const waiting_time = +(Math.max(0.5, queue_length * 0.28 + (30 - average_speed) * 0.1)).toFixed(1);
    
    let congestion_score = Math.min(100, Math.floor((vehicle_count * 1.1) + (queue_length * 2.5) + (35 - average_speed)));
    let traffic_level = 'NORMAL';
    if (congestion_score > 80) traffic_level = 'CRITICAL';
    else if (congestion_score > 60) traffic_level = 'HIGH';
    else if (congestion_score > 30) traffic_level = 'MODERATE';

    memStore.traffic_readings.push({
      id: autoIncrementIds.traffic_readings++,
      gate_id: 'gate-main-01',
      vehicle_count,
      cars,
      bikes,
      buses,
      vans,
      average_speed,
      queue_length,
      waiting_time,
      congestion_score,
      traffic_level,
      is_simulated: true,
      timestamp
    });
  }

  // 4. Seed Alerts
  memStore.alerts = [
    {
      id: autoIncrementIds.alerts++,
      severity: 'Critical',
      title: 'High Congestion Detected at Main Gate',
      description: 'Vehicle inflow rate exceeded gate clearance throughput by 42%. Queue length reached 18 vehicles.',
      location: 'College Main Gate (Lane 1 & 2)',
      recommended_action: 'Open Secondary Gate (East) to divert outbound/inbound bike and 2-wheeler traffic.',
      status: 'Active',
      is_simulated: true,
      created_at: new Date(now - 12 * 60 * 1000).toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      acknowledged_by: null,
      resolved_by: null
    },
    {
      id: autoIncrementIds.alerts++,
      severity: 'Warning',
      title: 'Queue Length Rapidly Increasing',
      description: 'Consecutive batch of 4 college transit buses arriving simultaneously.',
      location: 'College Main Gate',
      recommended_action: 'Deploy manual wave-through on RFID reader sensor lane.',
      status: 'Acknowledged',
      is_simulated: true,
      created_at: new Date(now - 38 * 60 * 1000).toISOString(),
      acknowledged_at: new Date(now - 25 * 60 * 1000).toISOString(),
      resolved_at: null,
      acknowledged_by: 'Campus Security Lead',
      resolved_by: null
    },
    {
      id: autoIncrementIds.alerts++,
      severity: 'Information',
      title: 'Traffic Returned to Baseline Normal',
      description: 'Gate flow normalized to 18 vehicles/min with zero sustained queue buildup.',
      location: 'Secondary Gate (East)',
      recommended_action: 'Normal gate surveillance mode resumed.',
      status: 'Resolved',
      is_simulated: true,
      created_at: new Date(now - 120 * 60 * 1000).toISOString(),
      acknowledged_at: new Date(now - 110 * 60 * 1000).toISOString(),
      resolved_at: new Date(now - 85 * 60 * 1000).toISOString(),
      acknowledged_by: 'BALAJI EN',
      resolved_by: 'BALAJI EN'
    }
  ];

  // 5. Seed AI Predictions
  memStore.ai_predictions = [
    {
      id: autoIncrementIds.ai_predictions++,
      prediction: 'High Congestion Expected in Next 10 Minutes',
      timeframe: 'Next 10 Minutes',
      confidence: 94,
      risk_level: 'HIGH',
      explanation: 'YOLO detection telemetry shows surge of incoming private vehicles matching peak arrival trend model (C29 Morning Rush Pattern).',
      recommended_lane_action: 'Pre-emptively open Secondary Gate to balance vehicle distribution.',
      is_simulated: true,
      timestamp: new Date().toISOString()
    },
    {
      id: autoIncrementIds.ai_predictions++,
      prediction: 'Moderate Traffic Flow for Next 30 Minutes',
      timeframe: 'Next 30 Minutes',
      confidence: 88,
      risk_level: 'MODERATE',
      explanation: 'Lecture transition influx anticipated at main corridor.',
      recommended_lane_action: 'Keep Emergency corridor on standby alert.',
      is_simulated: true,
      timestamp: new Date(now - 15 * 60 * 1000).toISOString()
    }
  ];

  // 6. Seed Action Logs
  memStore.action_logs = [
    {
      id: autoIncrementIds.action_logs++,
      user_id: 1,
      user_name: 'BALAJI EN',
      action: 'Simulated Gate State Inspected',
      gate_id: 'gate-main-01',
      details: 'Reviewed live CCTV computer vision telemetry overlays.',
      is_simulated: true,
      timestamp: new Date(now - 5 * 60 * 1000).toISOString()
    },
    {
      id: autoIncrementIds.action_logs++,
      user_id: 2,
      user_name: 'Campus Security Lead',
      action: 'Alert Acknowledged',
      gate_id: 'gate-main-01',
      details: 'Acknowledged Warning: Queue Length Rapidly Increasing.',
      is_simulated: true,
      timestamp: new Date(now - 25 * 60 * 1000).toISOString()
    }
  ];

  console.log('🌱 Database store initialized & seeded with demo data successfully.');
}

export { autoIncrementIds };
