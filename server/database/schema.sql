-- SmartGate AI Database Schema (PostgreSQL)
-- "Smarter Gates. Safer Campuses."

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Security Staff' CHECK (role IN ('Security Staff', 'Administrator', 'Viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gates Table
CREATE TABLE IF NOT EXISTS gates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'Main Gate',
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Available', 'Restricted')),
    capacity_rate INTEGER DEFAULT 30, -- max vehicles per min
    current_flow INTEGER DEFAULT 0,
    is_emergency BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Traffic Readings Telemetry (Simulated & Historical)
CREATE TABLE IF NOT EXISTS traffic_readings (
    id SERIAL PRIMARY KEY,
    gate_id VARCHAR(50) REFERENCES gates(id) ON DELETE CASCADE,
    vehicle_count INTEGER NOT NULL DEFAULT 0,
    cars INTEGER NOT NULL DEFAULT 0,
    bikes INTEGER NOT NULL DEFAULT 0,
    buses INTEGER NOT NULL DEFAULT 0,
    vans INTEGER NOT NULL DEFAULT 0,
    average_speed NUMERIC(5,2) NOT NULL DEFAULT 20.0, -- km/h
    queue_length INTEGER NOT NULL DEFAULT 0, -- number of vehicles in queue
    waiting_time NUMERIC(5,2) NOT NULL DEFAULT 0.0, -- in minutes
    congestion_score INTEGER NOT NULL DEFAULT 0, -- 0-100
    traffic_level VARCHAR(20) DEFAULT 'NORMAL' CHECK (traffic_level IN ('NORMAL', 'MODERATE', 'HIGH', 'CRITICAL')),
    is_simulated BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'Warning', 'Information')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL DEFAULT 'Main Gate',
    recommended_action TEXT,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Acknowledged', 'Resolved')),
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by VARCHAR(255),
    resolved_by VARCHAR(255)
);

-- AI Predictions Table
CREATE TABLE IF NOT EXISTS ai_predictions (
    id SERIAL PRIMARY KEY,
    prediction VARCHAR(100) NOT NULL,
    timeframe VARCHAR(50) DEFAULT 'Next 10 Minutes',
    confidence INTEGER NOT NULL, -- percentage score
    risk_level VARCHAR(20) DEFAULT 'MODERATE' CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    explanation TEXT NOT NULL,
    recommended_lane_action VARCHAR(255),
    is_simulated BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Action Audit Logs Table
CREATE TABLE IF NOT EXISTS action_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    gate_id VARCHAR(50),
    details TEXT,
    is_simulated BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal analytics queries
CREATE INDEX IF NOT EXISTS idx_traffic_timestamp ON traffic_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_gate_id ON traffic_readings(gate_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
