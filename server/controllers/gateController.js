import { memStore, autoIncrementIds } from '../database/db.js';

export function getGates(req, res, next) {
  try {
    res.json({
      success: true,
      data: memStore.gates,
      disclaimer: 'SIMULATED GATE CONTROL — NO PHYSICAL HARDWARE CONNECTED'
    });
  } catch (err) {
    next(err);
  }
}

export function updateGateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userName = req.user?.name || 'Security Officer';

    if (!['Open', 'Closed', 'Available', 'Restricted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gate status. Must be Open, Closed, Available, or Restricted.'
      });
    }

    const gate = memStore.gates.find(g => g.id === id);
    if (!gate) {
      return res.status(404).json({
        success: false,
        message: 'Gate not found.'
      });
    }

    const previousStatus = gate.status;
    gate.status = status;
    gate.last_updated = new Date().toISOString();

    // If opening secondary gate, simulate flow adjustment
    if (gate.type === 'Secondary Gate') {
      gate.current_flow = status === 'Open' ? 14 : 0;
    }

    // Add Action Audit Log
    const actionRecord = {
      id: autoIncrementIds.action_logs++,
      user_id: req.user?.id || 1,
      user_name: userName,
      action: `Gate State Changed: ${gate.name}`,
      gate_id: gate.id,
      details: `Status toggled from ${previousStatus} -> ${status} (Simulated Barrier Actuation).`,
      is_simulated: true,
      timestamp: new Date().toISOString()
    };
    memStore.action_logs.push(actionRecord);

    res.json({
      success: true,
      message: `${gate.name} status updated to ${status}.`,
      data: gate,
      log: actionRecord,
      disclaimer: 'SIMULATED GATE CONTROL — NO PHYSICAL HARDWARE CONNECTED'
    });
  } catch (err) {
    next(err);
  }
}

export function getGateLogs(req, res, next) {
  try {
    const logs = [...memStore.action_logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
}
