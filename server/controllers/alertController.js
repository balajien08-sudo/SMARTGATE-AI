import { memStore, autoIncrementIds } from '../database/db.js';

export function getAlerts(req, res, next) {
  try {
    const { severity, status } = req.query;
    let filtered = [...memStore.alerts];

    if (severity && severity !== 'ALL') {
      filtered = filtered.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
    }

    if (status && status !== 'ALL') {
      filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // Sort descending by created_at
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (err) {
    next(err);
  }
}

export function updateAlertStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userName = req.user?.name || 'Security Officer';

    if (!['Active', 'Acknowledged', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Active, Acknowledged, or Resolved.'
      });
    }

    const alertIndex = memStore.alerts.findIndex(a => a.id === Number(id));
    if (alertIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.'
      });
    }

    const targetAlert = memStore.alerts[alertIndex];
    targetAlert.status = status;

    if (status === 'Acknowledged') {
      targetAlert.acknowledged_at = new Date().toISOString();
      targetAlert.acknowledged_by = userName;
    } else if (status === 'Resolved') {
      targetAlert.resolved_at = new Date().toISOString();
      targetAlert.resolved_by = userName;
    }

    // Record Action Log
    memStore.action_logs.push({
      id: autoIncrementIds.action_logs++,
      user_id: req.user?.id || 1,
      user_name: userName,
      action: `Alert ${status}`,
      gate_id: targetAlert.location,
      details: `${targetAlert.title} status changed to ${status}`,
      is_simulated: true,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Alert successfully marked as ${status}.`,
      data: targetAlert
    });
  } catch (err) {
    next(err);
  }
}

export function createAlert(req, res, next) {
  try {
    const { severity = 'Warning', title, description, location = 'College Main Gate', recommended_action } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required to generate an alert.'
      });
    }

    const newAlert = {
      id: autoIncrementIds.alerts++,
      severity,
      title,
      description,
      location,
      recommended_action: recommended_action || 'Inspect incoming lane flow.',
      status: 'Active',
      is_simulated: true,
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      resolved_at: null,
      acknowledged_by: null,
      resolved_by: null
    };

    memStore.alerts.unshift(newAlert);

    res.status(201).json({
      success: true,
      message: 'Simulated alert created successfully.',
      data: newAlert
    });
  } catch (err) {
    next(err);
  }
}
