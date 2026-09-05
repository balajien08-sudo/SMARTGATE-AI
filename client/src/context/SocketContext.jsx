import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useToast } from './ToastContext.jsx';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveTelemetry, setLiveTelemetry] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    // Connect to server (proxied in Vite or direct)
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket.IO] Connected to backend telemetry stream');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket.IO] Disconnected from backend telemetry');
    });

    // Initial telemetry snapshot
    socketInstance.on('traffic:initial', (data) => {
      if (data?.telemetry) {
        setLiveTelemetry(data.telemetry);
      }
    });

    // Periodic telemetry update broadcast
    socketInstance.on('traffic:telemetry', (data) => {
      if (data?.telemetry) {
        setLiveTelemetry(data.telemetry);
      }
    });

    // Real-time new alert trigger
    socketInstance.on('alert:new', (alert) => {
      addToast({
        type: alert.severity === 'Critical' ? 'error' : 'warning',
        title: `AI Alert: ${alert.title}`,
        message: `${alert.description} (${alert.location})`
      });
    });

    // Toast notification event
    socketInstance.on('notification:toast', (notification) => {
      addToast(notification);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [addToast]);

  const changeScenario = (scenario) => {
    if (socket && isConnected) {
      socket.emit('simulation:set_scenario', scenario);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, liveTelemetry, changeScenario }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
