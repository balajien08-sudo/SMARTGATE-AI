/**
 * SmartGate AI — Client API Service
 * Handles HTTP requests, JWT token attachment, and unified error handling.
 */

const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('smartgate_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        // Clear token if expired
        localStorage.removeItem('smartgate_token');
        localStorage.removeItem('smartgate_user');
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// Auth APIs
export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me')
};

// Dashboard API
export const dashboardApi = {
  getOverview: () => request('/dashboard')
};

// Traffic APIs
export const trafficApi = {
  getLive: () => request('/traffic/live'),
  getAnalytics: (period = 'today') => request(`/traffic/analytics?period=${period}`),
  getPrediction: () => request('/traffic/prediction')
};

// Alert APIs
export const alertApi = {
  getAlerts: (severity, status) => {
    const params = new URLSearchParams();
    if (severity) params.append('severity', severity);
    if (status) params.append('status', status);
    return request(`/alerts?${params.toString()}`);
  },
  updateStatus: (id, status) => request(`/alerts/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  createAlert: (alertData) => request('/alerts', { method: 'POST', body: JSON.stringify(alertData) })
};

// Gate APIs
export const gateApi = {
  getGates: () => request('/gates'),
  updateStatus: (id, status) => request(`/gates/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getLogs: () => request('/gates/logs')
};

// AI APIs
export const aiApi = {
  getInsights: () => request('/ai/insights'),
  askAssistant: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) })
};

// Project / Methodology API
export const projectApi = {
  getMethodology: () => request('/project'),
  updateFieldNumbers: (data) => request('/project/field-numbers', { method: 'PATCH', body: JSON.stringify(data) }),
  uploadPhoto: (photoData) => request('/project/photo', { method: 'POST', body: JSON.stringify(photoData) }),
  deletePhoto: () => request('/project/photo', { method: 'DELETE' })
};
