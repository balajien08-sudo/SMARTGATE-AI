import { memStore } from '../database/db.js';
import { getCurrentTelemetry } from '../simulation/trafficSimulator.js';
import { calculateCongestionMetrics } from '../ai/congestionModel.js';
import { generateTrafficPredictions } from '../ai/predictionEngine.js';

export function getLiveTraffic(req, res, next) {
  try {
    const telemetry = getCurrentTelemetry();
    const metrics = calculateCongestionMetrics({
      vehicle_count: telemetry.vehicle_count,
      queue_length: telemetry.queue_length,
      average_speed: telemetry.average_speed,
      arrival_rate: telemetry.arrival_rate,
      gate_capacity: 30
    });

    // Generate dynamic simulated bounding boxes for camera view
    const boundingBoxes = [];
    const vehicleTypes = ['Car', 'Bike', 'Bus', 'Van'];
    const totalBoxes = Math.min(10, Math.max(4, Math.floor(telemetry.vehicle_count / 5)));

    for (let i = 0; i < totalBoxes; i++) {
      const type = i === 0 && telemetry.buses > 0 ? 'Bus' :
                   i % 3 === 0 ? 'Bike' :
                   i % 4 === 0 ? 'Van' : 'Car';
      
      const lane = (i % 2) + 1;
      const x = lane === 1 ? 120 + (i * 45) % 240 : 420 + (i * 40) % 240;
      const y = 160 + (i * 42) % 220;
      const width = type === 'Bus' ? 120 : type === 'Van' ? 80 : type === 'Car' ? 65 : 35;
      const height = type === 'Bus' ? 70 : type === 'Van' ? 55 : type === 'Car' ? 45 : 30;
      const speed = +(telemetry.average_speed + (Math.random() * 4 - 2)).toFixed(1);
      const confidence = +(91 + Math.random() * 8).toFixed(1);

      boundingBoxes.push({
        id: `det-${i + 1}`,
        type,
        confidence,
        lane,
        speed,
        bbox: { x, y, width, height },
        status: speed < 12 ? 'Slow / Queuing' : 'Moving'
      });
    }

    res.json({
      success: true,
      data: {
        camera: {
          id: 'CAM-GATE-01',
          name: 'College Main Gate — Inbound Sensor Feed',
          resolution: '1080p (Simulated Stream)',
          fps: 30,
          status: 'ONLINE',
          is_simulated: true,
          label: 'SIMULATED CAMERA FEED — AI BOUNDING BOX OVERLAY'
        },
        telemetry,
        metrics,
        detections: boundingBoxes,
        lanes: [
          {
            lane_id: 1,
            name: 'Lane 1 (Heavy / Buses / Cars)',
            vehicle_count: Math.ceil(telemetry.vehicle_count * 0.58),
            status: telemetry.queue_length > 10 ? 'Congested' : 'Fluid'
          },
          {
            lane_id: 2,
            name: 'Lane 2 (2-Wheelers & Fast Pass)',
            vehicle_count: Math.floor(telemetry.vehicle_count * 0.42),
            status: 'Fluid'
          }
        ],
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
}

export function getTrafficAnalytics(req, res, next) {
  try {
    const { period = 'today' } = req.query;

    // 1. Hourly Vehicle Flow (24 hours)
    const hourlyFlow = [
      { hour: '00:00', vehicles: 8, cars: 4, bikes: 3, buses: 1, waitingTime: 0.5 },
      { hour: '02:00', vehicles: 4, cars: 2, bikes: 2, buses: 0, waitingTime: 0.3 },
      { hour: '04:00', vehicles: 6, cars: 3, bikes: 3, buses: 0, waitingTime: 0.4 },
      { hour: '06:00', vehicles: 18, cars: 8, bikes: 8, buses: 2, waitingTime: 1.1 },
      { hour: '07:00', vehicles: 42, cars: 18, bikes: 16, buses: 6, waitingTime: 2.8 },
      { hour: '08:00', vehicles: 88, cars: 40, bikes: 32, buses: 12, waitingTime: 5.6 }, // Morning Rush
      { hour: '09:00', vehicles: 94, cars: 44, bikes: 34, buses: 14, waitingTime: 6.2 }, // Peak
      { hour: '10:00', vehicles: 56, cars: 26, bikes: 22, buses: 6, waitingTime: 3.4 },
      { hour: '11:00', vehicles: 38, cars: 18, bikes: 16, buses: 3, waitingTime: 2.1 },
      { hour: '12:00', vehicles: 44, cars: 20, bikes: 18, buses: 4, waitingTime: 2.6 },
      { hour: '13:00', vehicles: 48, cars: 22, bikes: 20, buses: 4, waitingTime: 2.9 },
      { hour: '14:00', vehicles: 36, cars: 16, bikes: 16, buses: 3, waitingTime: 2.0 },
      { hour: '15:00', vehicles: 52, cars: 24, bikes: 22, buses: 4, waitingTime: 3.1 },
      { hour: '16:00', vehicles: 76, cars: 34, bikes: 30, buses: 8, waitingTime: 4.8 }, // Evening Rush
      { hour: '17:00', vehicles: 82, cars: 38, bikes: 32, buses: 9, waitingTime: 5.2 },
      { hour: '18:00', vehicles: 64, cars: 30, bikes: 26, buses: 6, waitingTime: 3.9 },
      { hour: '19:00', vehicles: 40, cars: 20, bikes: 16, buses: 3, waitingTime: 2.3 },
      { hour: '20:00', vehicles: 28, cars: 14, bikes: 12, buses: 2, waitingTime: 1.5 },
      { hour: '22:00', vehicles: 14, cars: 8, bikes: 5, buses: 1, waitingTime: 0.8 }
    ];

    // 2. Vehicle Type Distribution
    const telemetry = getCurrentTelemetry();
    const vehicleDistribution = [
      { name: 'Cars', value: 45, count: telemetry.cars, fill: '#00f2fe' },
      { name: 'Bikes & 2-Wheelers', value: 35, count: telemetry.bikes, fill: '#10b981' },
      { name: 'College Transit Buses', value: 12, count: telemetry.buses, fill: '#f59e0b' },
      { name: 'Staff Vans & Deliveries', value: 8, count: telemetry.vans, fill: '#8b5cf6' }
    ];

    // 3. Average Waiting Time per Slot
    const waitingTimeSlots = [
      { slot: '06:00 - 08:00', avgWaitMin: 2.4, queueAvg: 7 },
      { slot: '08:00 - 10:00', avgWaitMin: 5.8, queueAvg: 19 },
      { slot: '10:00 - 12:00', avgWaitMin: 2.8, queueAvg: 8 },
      { slot: '12:00 - 14:00', avgWaitMin: 2.7, queueAvg: 8 },
      { slot: '14:00 - 16:00', avgWaitMin: 3.2, queueAvg: 10 },
      { slot: '16:00 - 18:00', avgWaitMin: 5.1, queueAvg: 16 },
      { slot: '18:00 - 20:00', avgWaitMin: 2.2, queueAvg: 6 },
      { slot: '20:00 - 22:00', avgWaitMin: 1.2, queueAvg: 3 }
    ];

    // 4. Weekly Traffic Trend (Mon-Sun)
    const weeklyTrend = [
      { day: 'Mon', totalVehicles: 1540, peakQueue: 24, avgWait: 5.4 },
      { day: 'Tue', totalVehicles: 1620, peakQueue: 26, avgWait: 5.8 },
      { day: 'Wed', totalVehicles: 1590, peakQueue: 22, avgWait: 5.1 },
      { day: 'Thu', totalVehicles: 1680, peakQueue: 28, avgWait: 6.2 },
      { day: 'Fri', totalVehicles: 1740, peakQueue: 30, avgWait: 6.7 },
      { day: 'Sat', totalVehicles: 820, peakQueue: 11, avgWait: 2.1 },
      { day: 'Sun', totalVehicles: 390, peakQueue: 5, avgWait: 1.0 }
    ];

    // 5. Congestion Frequency (Days per month / peak occurrences)
    const congestionFrequency = [
      { period: 'Morning Rush (8-10 AM)', occurrences: 22, avgDurationMin: 45, severity: 'High' },
      { period: 'Noon Transition (1-2 PM)', occurrences: 9, avgDurationMin: 20, severity: 'Moderate' },
      { period: 'Evening Rush (4:30-6 PM)', occurrences: 19, avgDurationMin: 38, severity: 'High' },
      { period: 'Event & Exam Days', occurrences: 6, avgDurationMin: 65, severity: 'Critical' }
    ];

    res.json({
      success: true,
      period,
      data: {
        hourlyFlow,
        vehicleDistribution,
        waitingTimeSlots,
        weeklyTrend,
        congestionFrequency,
        summary: {
          totalVolume: 1590,
          peakHour: '08:30 - 09:30 AM',
          avgDailyWaitTime: '4.2 min',
          busiestDay: 'Friday'
        },
        disclaimer: 'DEMO / SIMULATED ANALYTICS DATA'
      }
    });
  } catch (err) {
    next(err);
  }
}

export function getTrafficPrediction(req, res, next) {
  try {
    const telemetry = getCurrentTelemetry();
    const predictions = generateTrafficPredictions(telemetry);

    res.json({
      success: true,
      data: {
        telemetry,
        predictions,
        methodology: {
          detectionModel: 'YOLO-v8 Architecture (Conceptual Simulated Inflow)',
          forecastingModel: 'Auto-Regressive Time Series with Rush-Hour Pattern Matching',
          anomalyDetector: 'Multi-variate Inflow Deceleration & Bus Convoy Filter'
        },
        disclaimer: 'SIMULATED AI PREDICTION — Experimental C29 Demo Pipeline'
      }
    });
  } catch (err) {
    next(err);
  }
}
