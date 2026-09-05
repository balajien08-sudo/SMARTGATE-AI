import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './layouts/MainLayout.jsx';
import { AuthLayout } from './layouts/AuthLayout.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LiveTrafficPage } from './pages/LiveTrafficPage.jsx';
import { AiAnalysisPage } from './pages/AiAnalysisPage.jsx';
import { AlertCenterPage } from './pages/AlertCenterPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { GateManagementPage } from './pages/GateManagementPage.jsx';
import { SystemArchitecturePage } from './pages/SystemArchitecturePage.jsx';
import { C29MethodologyPage } from './pages/C29MethodologyPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

export function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes (Main Layout with Sidebar & Header) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/live-traffic" element={<LiveTrafficPage />} />
        <Route path="/ai-analysis" element={<AiAnalysisPage />} />
        <Route path="/alerts" element={<AlertCenterPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/gates" element={<GateManagementPage />} />
        <Route path="/architecture" element={<SystemArchitecturePage />} />
        <Route path="/c29-methodology" element={<C29MethodologyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
