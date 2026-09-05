/**
 * SmartGate AI — Real-time Traffic Telemetry Simulation Engine
 * DEMO / SIMULATED TRAFFIC DATA
 */

import { memStore, autoIncrementIds } from '../database/db.js';
import { calculateCongestionMetrics } from '../ai/congestionModel.js';
import { generateTrafficPredictions } from '../ai/predictionEngine.js';

let ioInstance = null;
let simulationInterval = null;
let currentScenario = 'NORMAL_FLOW'; // NORMAL_FLOW, PEAK_MORNING, BUS_CONVOY, RAIN_SLOWDOWN

// Base state
let state = {
  vehicle_count: 42,
  cars: 19,
  bikes: 15,
  buses: 5,
  vans: 3,
  average_speed: 18.5,
  queue_length: 12,
  waiting_time: 3.4,
  congestion_score: 65,
  traffic_level: 'HIGH',
  arrival_rate: 18,
  last_updated: new Date().toISOString()
};

export function setIoInstance(io) {
  ioInstance = io;
}

export function getCurrentTelemetry() {
  return { ...state };
}

export function setSimulationScenario(scenario) {
  currentScenario = scenario;
  console.log(`[Simulation] Switched scenario to: ${scenario}`);
  tickSimulation();
}

export function startSimulationLoop() {
  if (simulationInterval) clearInterval(simulationInterval);
  
  console.log('🚀 Starting SmartGate AI Traffic Simulation Engine (Demo Telemetry loop)...');
  
  // Tick every 3.5 seconds
  simulationInterval = setInterval(() => {
    tickSimulation();
  }, 3500);
}

export function stopSimulationLoop() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

export function tickSimulation() {
  // Generate realistic delta changes based on scenario
  let targetCount = 35;
  let targetSpeed = 22;
  let targetArrival = 14;

  if (currentScenario === 'PEAK_MORNING') {
    targetCount = 52 + Math.floor(Math.random() * 12);
    targetSpeed = 12 + Math.random() * 5;
    targetArrival = 28 + Math.random() * 8;
  } else if (currentScenario === 'BUS_CONVOY') {
    targetCount = 48 + Math.floor(Math.random() * 8);
    targetSpeed = 10 + Math.random() * 4;
    targetArrival = 22;
  } else if (currentScenario === 'NORMAL_FLOW') {
    targetCount = 28 + Math.floor(Math.random() * 14);
    targetSpeed = 22 + Math.random() * 6;
    targetArrival = 12 + Math.random() * 5;
  }

  // Smooth transition toward target
  const deltaCount = Math.round((targetCount - state.vehicle_count) * 0.25 + (Math.random() * 4 - 2));
  state.vehicle_count = Math.max(8, Math.min(85, state.vehicle_count + deltaCount));

  // Breakdown distribution
  let busWeight = currentScenario === 'BUS_CONVOY' ? 0.2 : 0.1;
  state.cars = Math.max(3, Math.round(state.vehicle_count * 0.45));
  state.bikes = Math.max(3, Math.round(state.vehicle_count * 0.35));
  state.buses = Math.max(1, Math.round(state.vehicle_count * busWeight));
  state.vans = Math.max(0, state.vehicle_count - state.cars - state.bikes - state.buses);

  // Speed and queue dynamics
  const deltaSpeed = (targetSpeed - state.average_speed) * 0.2 + (Math.random() * 2 - 1);
  state.average_speed = +(Math.max(6, Math.min(38, state.average_speed + deltaSpeed))).toFixed(1);

  // Queue depends on count vs gate capacity (approx 25 flow capacity)
  const estimatedQueue = Math.max(0, Math.round((state.vehicle_count - 24) * 0.75 + (Math.random() * 2 - 1)));
  state.queue_length = estimatedQueue;
  state.arrival_rate = Math.round(targetArrival);

  // AI model calculation
  const metrics = calculateCongestionMetrics({
    vehicle_count: state.vehicle_count,
    queue_length: state.queue_length,
    average_speed: state.average_speed,
    arrival_rate: state.arrival_rate,
    gate_capacity: 30
  });

  state.congestion_score = metrics.congestionScore;
  state.traffic_level = metrics.trafficLevel;
  state.waiting_time = metrics.estimatedWaitingTime;
  state.last_updated = new Date().toISOString();

  // Record reading in memory buffer
  const newReading = {
    id: autoIncrementIds.traffic_readings++,
    gate_id: 'gate-main-01',
    vehicle_count: state.vehicle_count,
    cars: state.cars,
    bikes: state.bikes,
    buses: state.buses,
    vans: state.vans,
    average_speed: state.average_speed,
    queue_length: state.queue_length,
    waiting_time: state.waiting_time,
    congestion_score: state.congestion_score,
    traffic_level: state.traffic_level,
    is_simulated: true,
    timestamp: state.last_updated
  };

  memStore.traffic_readings.push(newReading);
  if (memStore.traffic_readings.length > 500) {
    memStore.traffic_readings.shift(); // keep buffer clean
  }

  // Check automated alert creation trigger
  checkAndTriggerAlert(metrics);

  // Broadcast through WebSockets / Socket.IO
  if (ioInstance) {
    ioInstance.emit('traffic:telemetry', {
      telemetry: state,
      metrics,
      timestamp: state.last_updated
    });
  }
}

// Automated alert generator when thresholds are crossed
function checkAndTriggerAlert(metrics) {
  const activeAlerts = memStore.alerts.filter(a => a.status === 'Active');
  
  if (metrics.trafficLevel === 'CRITICAL' && !activeAlerts.some(a => a.severity === 'Critical')) {
    const newAlert = {
      id: autoIncrementIds.alerts++,
      severity: 'Critical',
      title: 'Critical Congestion at Main Gate',
      description: `Inflow rate reached ${state.arrival_rate} veh/min with a queue of ${state.queue_length} vehicles. Congestion score: ${metrics.congestionScore}/100.`,
      location: 'College Main Gate',
      recommended_action: metrics.recommendation,
      status: 'Active',
      is_simulated: true,
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      acknowledged_by: null,
      resolved_by: null
    };
    memStore.alerts.unshift(newAlert);
    if (ioInstance) {
      ioInstance.emit('alert:new', newAlert);
    }
  } else if (metrics.trafficLevel === 'HIGH' && state.queue_length >= 14 && !activeAlerts.some(a => a.title.includes('Queue Length'))) {
    const newAlert = {
      id: autoIncrementIds.alerts++,
      severity: 'Warning',
      title: 'Queue Length Warning (14+ Vehicles)',
      description: `Queue buildup detected at entrance approach. Average wait time increased to ${metrics.estimatedWaitingTime} min.`,
      location: 'College Main Gate',
      recommended_action: 'Monitor Lane 1 scanner and prepare Secondary Gate for overflow bypass.',
      status: 'Active',
      is_simulated: true,
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      acknowledged_by: null,
      resolved_by: null
    };
    memStore.alerts.unshift(newAlert);
    if (ioInstance) {
      ioInstance.emit('alert:new', newAlert);
    }
  }
}
