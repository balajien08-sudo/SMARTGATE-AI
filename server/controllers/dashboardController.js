import { memStore } from '../database/db.js';
import { getCurrentTelemetry } from '../simulation/trafficSimulator.js';
import { calculateCongestionMetrics } from '../ai/congestionModel.js';

export function getDashboardOverview(req, res, next) {
  try {
    const telemetry = getCurrentTelemetry();
    const metrics = calculateCongestionMetrics({
      vehicle_count: telemetry.vehicle_count,
      queue_length: telemetry.queue_length,
      average_speed: telemetry.average_speed,
      arrival_rate: telemetry.arrival_rate,
      gate_capacity: 30
    });

    // Recent 10 readings for mini sparklines
    const sparklineData = memStore.traffic_readings.slice(-12).map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicles: r.vehicle_count,
      queue: r.queue_length,
      score: r.congestion_score
    }));

    // Active and recent alerts
    const activeAlerts = memStore.alerts.filter(a => a.status === 'Active');
    const recentAlerts = memStore.alerts.slice(0, 5);

    // Gate statuses
    const gates = memStore.gates;

    // Latest AI prediction
    const latestPrediction = memStore.ai_predictions[0] || {
      prediction: 'High Congestion Expected in Next 10 Minutes',
      confidence: 94,
      risk_level: 'HIGH',
      explanation: 'YOLO detection telemetry matches morning peak pattern.'
    };

    // Action logs
    const recentLogs = memStore.action_logs.slice(-5).reverse();

    res.json({
      success: true,
      data: {
        telemetry: {
          current_vehicles: telemetry.vehicle_count,
          queue_length: telemetry.queue_length,
          waiting_time: telemetry.waiting_time,
          traffic_flow: Math.round(telemetry.arrival_rate * 4.2), // vehicles/hr normalized flow
          average_speed: telemetry.average_speed,
          cars: telemetry.cars,
          bikes: telemetry.bikes,
          buses: telemetry.buses,
          vans: telemetry.vans,
          congestion_score: telemetry.congestion_score,
          traffic_level: telemetry.traffic_level,
          ai_confidence: metrics.confidenceScore,
          is_simulated: true
        },
        status_indicator: {
          level: telemetry.traffic_level,
          color: metrics.badgeColor,
          label: telemetry.traffic_level === 'CRITICAL' ? '🔴 CRITICAL CONGESTION' :
                 telemetry.traffic_level === 'HIGH' ? '🔴 HIGH CONGESTION' :
                 telemetry.traffic_level === 'MODERATE' ? '🟡 MODERATE TRAFFIC' : '🟢 NORMAL FLOW'
        },
        metrics_breakdown: metrics.breakdown,
        recommendation: metrics.recommendation,
        gates,
        alerts: {
          total: memStore.alerts.length,
          active: activeAlerts.length,
          critical: activeAlerts.filter(a => a.severity === 'Critical').length,
          items: recentAlerts
        },
        prediction: latestPrediction,
        sparklines: sparklineData,
        recent_activity: recentLogs,
        disclaimer: 'DEMO / SIMULATED TRAFFIC DATA — Not actual physical gate sensors.'
      }
    });
  } catch (err) {
    next(err);
  }
}
