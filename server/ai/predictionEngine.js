/**
 * SmartGate AI — Prediction & Anomaly Detection Engine
 * DEMO / SIMULATED AI ENGINE
 */

export function generateTrafficPredictions(currentReading = {}) {
  const currentCount = currentReading.vehicle_count || 45;
  const currentQueue = currentReading.queue_length || 12;
  const now = new Date();
  const currentHour = now.getHours();

  // Peak period detection
  const isMorningPeak = currentHour >= 8 && currentHour <= 10;
  const isEveningPeak = currentHour >= 16 && currentHour <= 18;
  const isPeak = isMorningPeak || isEveningPeak;

  // Trend factor based on time of day
  const trendMultiplier = isPeak ? 1.25 : 0.95;

  // Forecast 10 minutes
  const forecast10mCount = Math.round(currentCount * (1 + (Math.random() * 0.2 - 0.05) * trendMultiplier));
  const forecast10mQueue = Math.max(0, Math.round(currentQueue + (forecast10mCount > 40 ? 3 : -2)));
  const forecast10mRisk = forecast10mQueue > 14 ? 'HIGH' : forecast10mQueue > 7 ? 'MODERATE' : 'LOW';
  const confidence10m = Math.round(92 + Math.random() * 5);

  // Forecast 30 minutes
  const forecast30mCount = Math.round(currentCount * (isPeak ? 1.35 : 0.85) + (Math.random() * 8 - 4));
  const forecast30mRisk = forecast30mCount > 55 ? 'HIGH' : forecast30mCount > 35 ? 'MODERATE' : 'LOW';
  const confidence30m = Math.round(85 + Math.random() * 7);

  // Forecast 60 minutes
  const forecast60mCount = Math.round(currentCount * (isPeak ? 1.1 : 0.75));
  const forecast60mRisk = forecast60mCount > 50 ? 'HIGH' : 'LOW';
  const confidence60m = Math.round(79 + Math.random() * 8);

  // Time-series points for the next 60 minutes in 5-minute intervals
  const forecastTimeline = [];
  let simTime = new Date(now.getTime());
  let runningCount = currentCount;

  for (let i = 1; i <= 12; i++) {
    simTime = new Date(simTime.getTime() + 5 * 60 * 1000);
    const wave = Math.sin(i / 2) * 6;
    runningCount = Math.max(10, Math.round(runningCount + (isPeak ? 2.5 : -1.5) + wave + (Math.random() * 4 - 2)));
    const queueEstimate = Math.max(0, Math.round((runningCount - 25) * 0.7));
    
    forecastTimeline.push({
      time: simTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predictedCount: runningCount,
      predictedQueue: queueEstimate,
      risk: runningCount > 50 ? 'HIGH' : runningCount > 30 ? 'MODERATE' : 'NORMAL'
    });
  }

  // Anomaly checks
  const anomalies = [];
  if (currentReading.buses >= 4) {
    anomalies.push({
      id: 'anom-bus-cluster',
      type: 'Bus Convoy Detected',
      severity: 'Warning',
      description: `${currentReading.buses} transit buses arrived concurrently. Potential entry bottleneck at Lane 1.`,
      detectedAt: new Date().toISOString()
    });
  }
  if (currentReading.average_speed < 10 && currentReading.vehicle_count > 30) {
    anomalies.push({
      id: 'anom-speed-drop',
      type: 'Unusual Speed Deceleration',
      severity: 'Critical',
      description: 'Vehicle speed dropped below 10 km/h with high density. Gate barrier clearance delay suspected.',
      detectedAt: new Date().toISOString()
    });
  }

  return {
    next10Min: {
      prediction: `High Congestion Anticipated (${forecast10mRisk} Risk)`,
      score: confidence10m,
      predictedCount: forecast10mCount,
      predictedQueue: forecast10mQueue,
      riskLevel: forecast10mRisk,
      trend: forecast10mCount > currentCount ? 'INCREASING' : 'STABLE',
      explanation: isPeak
        ? 'Time-series model correlates incoming telemetry with standard C29 Morning Inflow burst pattern.'
        : 'Steady-state vehicle inflow observed across campus approaches.'
    },
    next30Min: {
      prediction: `Traffic Expected to Peak around ${(new Date(now.getTime() + 25 * 60000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      score: confidence30m,
      predictedCount: forecast30mCount,
      riskLevel: forecast30mRisk,
      trend: isPeak ? 'PEAKING' : 'TAPERING'
    },
    next60Min: {
      prediction: 'Projected Normalization toward Off-Peak Baseline',
      score: confidence60m,
      predictedCount: forecast60mCount,
      riskLevel: forecast60mRisk
    },
    timeline: forecastTimeline,
    anomalies,
    is_simulated: true
  };
}
