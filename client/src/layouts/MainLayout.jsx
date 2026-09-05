import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { Header } from '../components/Header.jsx';
import { AskSmartGateModal } from '../components/AskSmartGateModal.jsx';
import { ToastContainer } from '../components/ToastContainer.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export function MainLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <LoadingSpinner text="Authenticating SmartGate AI Security Session..." size={36} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: '270px',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
        className="main-content-offset"
      >
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main style={{ flex: 1, padding: '28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </main>
      </div>

      {/* Global Floating AI Assistant & Notifications */}
      <AskSmartGateModal />
      <ToastContainer />
    </div>
  );
}
