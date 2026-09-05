/**
 * SmartGate AI — Conversational Traffic Assistant
 * DEMO / SIMULATED AI ENGINE
 */

export function handleTrafficChatQuery({ message, currentTelemetry, activeAlerts, gates }) {
  const query = (message || '').toLowerCase().trim();
  const count = currentTelemetry?.vehicle_count || 45;
  const queue = currentTelemetry?.queue_length || 12;
  const waitTime = currentTelemetry?.waiting_time || 3.8;
  const level = currentTelemetry?.traffic_level || 'HIGH';
  const score = currentTelemetry?.congestion_score || 74;
  const avgSpeed = currentTelemetry?.average_speed || 14.5;
  
  const activeAlertCount = (activeAlerts || []).filter(a => a.status === 'Active').length;
  const mainGate = (gates || []).find(g => g.type === 'Main Gate') || { status: 'Open' };
  const secGate = (gates || []).find(g => g.type === 'Secondary Gate') || { status: 'Closed' };
  const emergLane = (gates || []).find(g => g.type === 'Emergency Lane') || { status: 'Available' };

  let responseText = '';
  let category = 'GENERAL';
  let suggestedActions = [];

  if (query.includes('why') && (query.includes('high') || query.includes('traffic') || query.includes('congestion'))) {
    category = 'CONGESTION_EXPLANATION';
    responseText = `Current campus entrance traffic is classified as **${level}** (Congestion Score: ${score}/100) because:\n\n` +
      `1. **Vehicle Inflow Rate**: Approximately ${count} active vehicles approaching Main Gate.\n` +
      `2. **Queue Buildup**: Current physical queue length is ${queue} vehicles with an estimated waiting time of ${waitTime} minutes.\n` +
      `3. **Speed Reduction**: Average vehicular speed near gate sensor is down to ${avgSpeed} km/h (below optimal 25 km/h threshold).\n\n` +
      `**AI Recommendation — Human Verification Required**:\n` +
      `Consider opening the **Secondary Gate (East)** to divert 2-wheelers and student cars, reducing Main Gate load by up to 35%.`;
    suggestedActions = ['Open Secondary Gate', 'View AI Prediction Breakdown', 'Check Alert Center'];
  } else if (query.includes('gate') || query.includes('status')) {
    category = 'GATE_STATUS';
    responseText = `**Current Gate Operational Status** (SIMULATED CONTROL):\n\n` +
      `• **${mainGate.name || 'Main Gate'}**: 🟢 **${mainGate.status}** (Flow: ${mainGate.current_flow || count} veh/min)\n` +
      `• **${secGate.name || 'Secondary Gate (East)'}**: ${secGate.status === 'Open' ? '🟢' : '🔴'} **${secGate.status}**\n` +
      `• **${emergLane.name || 'Emergency Corridor'}**: 🟢 **${emergLane.status}** (Dedicated rapid response path)\n\n` +
      `*Recommendation*: ${secGate.status === 'Closed' && level === 'HIGH' ? 'Secondary gate should be opened immediately to ease Main Gate bottleneck.' : 'Current gate configuration is stable.'}`;
    suggestedActions = ['Navigate to Gate Management', 'Review Action Audit Logs'];
  } else if (query.includes('peak') || query.includes('when') || query.includes('forecast') || query.includes('predict')) {
    category = 'PREDICTION';
    responseText = `**AI Peak-Hour Trend Forecast (DEMO / SIMULATED)**:\n\n` +
      `• **Next 10 Minutes**: Congestion expected to peak at **${count + 6} vehicles** (82% confidence score).\n` +
      `• **Next 30 Minutes**: Moderate influx will persist during class changeover before tapering off by 10:30 AM.\n` +
      `• **Predicted Peak Window**: 08:30 AM – 09:15 AM (Morning Inflow) and 04:30 PM – 05:30 PM (Evening Departure).\n\n` +
      `**AI Recommendation — Human Verification Required**:\n` +
      `Pre-stage security staff for manual scanning 10 minutes before the 08:30 AM peak window.`;
    suggestedActions = ['View AI Analytics Charts', 'Acknowledge Active Alerts'];
  } else if (query.includes('action') || query.includes('recommend') || query.includes('what should i do')) {
    category = 'RECOMMENDATION';
    responseText = `**Immediate Recommended Actions based on Live Telemetry**:\n\n` +
      `1. ${secGate.status === 'Closed' ? '🟢 **Action 1**: Open Secondary Gate (East Entrance) to halve the incoming queue.' : '✅ **Action 1**: Secondary Gate is currently operational.'}\n` +
      `2. 🚦 **Action 2**: Prioritize transit buses arriving at Lane 1 to prevent queue tailing into the public road.\n` +
      `3. 🛡️ **Action 3**: Ensure Emergency Corridor remains 100% unobstructed.\n\n` +
      `*(Note: All AI recommendations require human security officer verification prior to physical execution.)*`;
    suggestedActions = ['Open Secondary Gate', 'Go to Live Traffic Monitor'];
  } else if (query.includes('summary') || query.includes('today') || query.includes('overview')) {
    category = 'SUMMARY';
    responseText = `**Today's Campus Gate Traffic Intelligence Summary**:\n\n` +
      `• **Total Vehicles Processed (Simulated)**: ~1,420 vehicles\n` +
      `• **Peak Hourly Queue**: 22 vehicles (recorded at 08:45 AM)\n` +
      `• **Current Status**: **${level}** (${count} vehicles currently active, Queue: ${queue})\n` +
      `• **Active Alerts**: ${activeAlertCount} alert(s) pending human review\n` +
      `• **Average Clearance Speed**: ${avgSpeed} km/h`;
    suggestedActions = ['View Traffic Analytics', 'Export Summary Report'];
  } else {
    category = 'ASSISTANT';
    responseText = `Hello! I am **SmartGate AI Assistant**.\n\n` +
      `I analyze real-time gate telemetry (${count} vehicles, ${queue} queue, ${level} status) and generate proactive recommendations.\n\n` +
      `You can ask me:\n` +
      `• *"Why is traffic high right now?"*\n` +
      `• *"What is the current gate status?"*\n` +
      `• *"When is traffic expected to peak?"*\n` +
      `• *"What action do you recommend for staff?"*\n` +
      `• *"Show today's traffic summary."*`;
    suggestedActions = ['Why is traffic high?', 'What action do you recommend?', 'What is the current gate status?'];
  }

  return {
    query: message,
    response: responseText,
    category,
    suggestedActions,
    is_simulated: true,
    telemetrySnapshot: {
      vehicle_count: count,
      queue_length: queue,
      traffic_level: level,
      waiting_time: waitTime
    },
    timestamp: new Date().toISOString()
  };
}
