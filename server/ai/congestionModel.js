/**
 * SmartGate AI — Congestion Analysis Model
 * DEMO / SIMULATED AI ENGINE
 * 
 * Computes congestion metrics based on simulated computer vision telemetry.
 */

export function calculateCongestionMetrics({
  vehicle_count = 0,
  queue_length = 0,
  average_speed = 25, // km/h
  arrival_rate = 15, // vehicles/min
  gate_capacity = 30 // vehicles/min
}) {
  // Density factor (normalized 0-40)
  const densityFactor = Math.min(40, (vehicle_count / 60) * 40);
  
  // Queue factor (normalized 0-35)
  const queueFactor = Math.min(35, (queue_length / 25) * 35);
  
  // Speed deficit factor: speed < 25 km/h increases congestion score (0-25)
  const speedDeficit = Math.max(0, Math.min(25, ((25 - average_speed) / 20) * 25));

  // Gate capacity stress ratio
  const capacityStress = (arrival_rate / gate_capacity) * 10;

  // Composite Congestion Score (0 - 100)
  const rawScore = densityFactor + queueFactor + speedDeficit + (capacityStress > 10 ? 5 : 0);
  const congestionScore = Math.max(5, Math.min(100, Math.round(rawScore)));

  // Determine Traffic Level
  let trafficLevel = 'NORMAL';
  let riskLevel = 'LOW';
  let badgeColor = '#10b981'; // Emerald

  if (congestionScore > 80) {
    trafficLevel = 'CRITICAL';
    riskLevel = 'CRITICAL';
    badgeColor = '#ef4444'; // Red
  } else if (congestionScore > 60) {
    trafficLevel = 'HIGH';
    riskLevel = 'HIGH';
    badgeColor = '#f59e0b'; // Amber
  } else if (congestionScore > 30) {
    trafficLevel = 'MODERATE';
    riskLevel = 'MODERATE';
    badgeColor = '#06b6d4'; // Cyan
  }

  // Calculate estimated waiting time (minutes)
  const estimatedWaitingTime = +(Math.max(0.8, (queue_length * 0.3) + ((30 - average_speed) * 0.12))).toFixed(1);

  // Confidence Score (Simulated ML metric)
  const confidenceScore = Math.round(91 + Math.random() * 6);

  // AI Recommendation Engine
  let recommendation = 'Traffic flow is optimal. Maintain standard gate clearance.';
  let requiresSecondaryGate = false;
  let requiresEmergencyLane = false;

  if (trafficLevel === 'CRITICAL') {
    recommendation = 'CRITICAL OVERFLOW: Immediately open Secondary Gate (East Entrance) and deploy manual wave-through on Lane 1.';
    requiresSecondaryGate = true;
  } else if (trafficLevel === 'HIGH') {
    recommendation = 'HIGH INFLOW: Prepare to open Secondary Gate within 5 minutes if queue exceeds 15 vehicles. Divert 2-wheelers to side corridor.';
    requiresSecondaryGate = true;
  } else if (trafficLevel === 'MODERATE') {
    recommendation = 'MODERATE TRAFFIC: Monitor queue growth rate. Keep security staff alert for upcoming lecture transition rush.';
  }

  return {
    congestionScore,
    trafficLevel,
    riskLevel,
    badgeColor,
    estimatedWaitingTime,
    confidenceScore,
    recommendation,
    requiresSecondaryGate,
    requiresEmergencyLane,
    is_simulated: true,
    breakdown: {
      densityFactor: Math.round(densityFactor),
      queueFactor: Math.round(queueFactor),
      speedDeficit: Math.round(speedDeficit)
    }
  };
}
