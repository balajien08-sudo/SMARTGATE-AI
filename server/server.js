import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';

import { initDb } from './database/db.js';
import { startSimulationLoop, setIoInstance, getCurrentTelemetry, setSimulationScenario } from './simulation/trafficSimulator.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import trafficRoutes from './routes/trafficRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import gateRoutes from './routes/gateRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import supabaseRoutes from './routes/supabaseRoutes.js';
import { testSupabaseServerConnection } from './database/supabase.js';

import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5050;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.IO Setup with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Pass IO instance to traffic simulator for live broadcasts
setIoInstance(io);

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory serving
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Request logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production' && req.path !== '/api/health') {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'SmartGate AI Backend API & Simulation Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/gates', gateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/supabase', supabaseRoutes);

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Send immediate telemetry snapshot upon connection
  socket.emit('traffic:initial', {
    telemetry: getCurrentTelemetry(),
    timestamp: new Date().toISOString()
  });

  // Client requests scenario change (Rush hour, normal, etc.)
  socket.on('simulation:set_scenario', (scenario) => {
    setSimulationScenario(scenario);
    io.emit('notification:toast', {
      type: 'info',
      title: 'Simulation Scenario Updated',
      message: `Scenario switched to: ${scenario}`
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

// Bootstrap Server & DB
async function bootstrap() {
  try {
    await initDb();
    
    // Supabase Cloud Connectivity Check
    const supabaseStatus = await testSupabaseServerConnection();
    if (supabaseStatus.success) {
      console.log(`⚡ Connected to Supabase Cloud (${supabaseStatus.projectUrl}) successfully.`);
    } else {
      console.warn(`⚠️ Supabase Cloud connection status: ${supabaseStatus.message}`);
    }

    startSimulationLoop();

    server.listen(PORT, () => {
      console.log(`
==========================================================
🚦 SMARTGATE AI — Server Started Successfully!
==========================================================
📡 API Server URL: http://localhost:${PORT}
⚡ Supabase Cloud: ${supabaseStatus.success ? 'CONNECTED' : 'DISCONNECTED'} (${supabaseStatus.projectUrl})
🔌 WebSocket (Socket.IO): Ready on port ${PORT}
👤 Demo Admin Login: balajien08@gmail.com | 3329 (BALAJI EN)
🚀 Simulation Engine: ACTIVE (Auto-broadcasting telemetry)
==========================================================
      `);
    });
  } catch (err) {
    console.error('❌ Failed to start SmartGate AI server:', err);
    process.exit(1);
  }
}

bootstrap();
