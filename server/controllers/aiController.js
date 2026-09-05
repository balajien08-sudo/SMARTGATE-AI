import { memStore } from '../database/db.js';
import { getCurrentTelemetry } from '../simulation/trafficSimulator.js';
import { calculateCongestionMetrics } from '../ai/congestionModel.js';
import { generateTrafficPredictions } from '../ai/predictionEngine.js';
import { handleTrafficChatQuery } from '../ai/chatAssistant.js';

export function getAiInsights(req, res, next) {
  try {
    const telemetry = getCurrentTelemetry();
    const metrics = calculateCongestionMetrics({
      vehicle_count: telemetry.vehicle_count,
      queue_length: telemetry.queue_length,
      average_speed: telemetry.average_speed,
      arrival_rate: telemetry.arrival_rate,
      gate_capacity: 30
    });
    const predictions = generateTrafficPredictions(telemetry);

    // AI Insight Cards
    const insightCards = [
      {
        id: 'card-1',
        type: 'risk',
        icon: '🚨',
        title: 'Congestion Risk',
        content: `Vehicle arrivals are increasing rapidly (${telemetry.arrival_rate} veh/min). Inflow exceeds current gate clearance capacity.`,
        severity: telemetry.traffic_level === 'CRITICAL' ? 'Critical' : telemetry.traffic_level === 'HIGH' ? 'High' : 'Moderate',
        badge: 'AI Detection'
      },
      {
        id: 'card-2',
        type: 'peak',
        icon: '⏰',
        title: 'Peak Period',
        content: 'Traffic intensity is expected to peak during the morning entry period (08:30 AM – 09:15 AM).',
        severity: 'Warning',
        badge: 'Time-Series Forecast'
      },
      {
        id: 'card-3',
        type: 'queue',
        icon: '🚗',
        title: 'Queue Growth',
        content: `The vehicle queue has reached ${telemetry.queue_length} vehicles at the main entrance approach. Average wait time is ${telemetry.waiting_time} min.`,
        severity: telemetry.queue_length > 10 ? 'High' : 'Normal',
        badge: 'Queue Dynamics'
      },
      {
        id: 'card-4',
        type: 'recommendation',
        icon: '💡',
        title: 'Recommendation',
        content: metrics.recommendation,
        severity: 'Actionable',
        badge: 'AI Recommendation — Human Verification Required'
      }
    ];

    // AI Techniques breakdown
    const aiTechniques = [
      {
        name: 'YOLO-Based Vehicle Detection',
        tag: 'Computer Vision',
        description: 'Conceptual real-time object detection model used to identify, classify, and count multi-class vehicles.',
        capabilities: [
          'Vehicle detection (Cars, Bikes, Buses, Vans)',
          'Vehicle classification and bounding box tracking',
          'Lane-level vehicle counting & density estimation'
        ],
        status: 'Active (Simulated Inflow)'
      },
      {
        name: 'Time-Series Forecasting',
        tag: 'Predictive Analytics',
        description: 'Auto-regressive and trend pattern matching algorithm estimating future arrival volumes and queue lengths.',
        capabilities: [
          'Traffic trend prediction (10m, 30m, 60m horizons)',
          'Peak-hour window estimation',
          'Proactive congestion probability scoring'
        ],
        status: 'Active (Simulated Pipeline)'
      },
      {
        name: 'Anomaly Detection',
        tag: 'Pattern Intelligence',
        description: 'Multi-variate statistical detector flagging sudden deceleration, lane obstructions, and transit bus convoy arrivals.',
        capabilities: [
          'Unusual queue growth spikes',
          'Gate barrier clearance delay identification',
          'Transit bus cluster alerts'
        ],
        status: 'Active'
      }
    ];

    res.json({
      success: true,
      data: {
        current_analysis: {
          status: `${metrics.riskLevel} CONGESTION RISK`,
          score: metrics.congestionScore,
          confidence: metrics.confidenceScore,
          summary: `AI has detected a rapid increase in vehicle arrivals at the main college gate (${telemetry.vehicle_count} active vehicles, queue: ${telemetry.queue_length}).`,
          level: telemetry.traffic_level,
          progression: {
            current: 'Current Inflow (42 veh/min)',
            transition: 'Increasing Trend (↑ 24%)',
            predicted: 'Predicted High (Next 10m)'
          }
        },
        prediction_summary: {
          next10Min: predictions.next10Min,
          next30Min: predictions.next30Min,
          next60Min: predictions.next60Min,
          disclaimer: 'SIMULATED AI PREDICTION — Demo Model'
        },
        insight_cards: insightCards,
        ai_techniques: aiTechniques,
        anomalies: predictions.anomalies,
        disclaimer: 'DEMO / SIMULATED AI ANALYSIS — Requires Human Verification for All Actions.'
      }
    });
  } catch (err) {
    next(err);
  }
}

export function chatWithAssistant(req, res, next) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message query is required.' });
    }

    const telemetry = getCurrentTelemetry();
    const activeAlerts = memStore.alerts;
    const gates = memStore.gates;

    const chatResult = handleTrafficChatQuery({
      message,
      currentTelemetry: telemetry,
      activeAlerts,
      gates
    });

    res.json({
      success: true,
      data: chatResult
    });
  } catch (err) {
    next(err);
  }
}
