# SmartGate AI — AI-Based Traffic Congestion Monitoring & Prediction System for College Gates

> **“Smarter Gates. Safer Campuses.”**  
> *A College AI Immersion / C29 Capstone Project*

---

## 📌 1. Project Overview

**SmartGate AI** is a startup-grade, full-stack AI traffic command center engineered specifically for college entrance management. During peak morning arrival (08:00–09:30 AM) and evening departure windows, campus entrances experience severe vehicular congestion. Manual monitoring by security staff makes it difficult to track incoming velocities, compute queue dynamics, and proactively alleviate bottlenecks.

**SmartGate AI** bridges this gap by combining computer vision vehicle telemetry, time-series forecasting, automated rule-based decision engines, and human-in-the-loop security action workflows.

---

## 🏛️ 2. Real-World Problem & C29 Context

### Problem Statement
> *“Students, staff, and visitors entering and leaving the college face traffic congestion at the college gate, especially during peak hours. Manual traffic management makes it difficult to continuously monitor vehicle flow and identify growing congestion, resulting in increased waiting time and crowding.”*

### Root Cause
> **Lack of continuous traffic monitoring and automated congestion prediction.**

### The 5 Whys Root Cause Analysis
1. **Why does congestion occur?** → Many vehicles arrive within a concentrated 45-minute window before classes start.
2. **Why does the queue grow?** → Vehicle inflow rate exceeds single-lane barrier clearance capacity.
3. **Why isn't it identified early?** → Traffic is monitored purely manually on the ground.
4. **Why is manual monitoring insufficient?** → Staff cannot continuously calculate multi-class density or queue acceleration.
5. **Why is prediction difficult?** → No automated system analyzes historical patterns and live telemetry in unison.
- **Identified Root Cause**: Lack of continuous AI-assisted monitoring and predictive intelligence.

---

## 🛠️ 3. Full-Stack Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript, CSS (Cyber Design System), React Router 6, Recharts, Lucide Icons | Responsive command center UI, CCTV HUD, dynamic charts, glassmorphic dashboards |
| **Backend** | Node.js, Express.js (ESM), Socket.IO | High-throughput REST API, live telemetry broadcast, AI simulation engine |
| **Cloud & Database** | Supabase Cloud (PostgreSQL 15, Auth & Realtime) + PostgreSQL (`pg`) with in-memory fallback | Relational data persistence (Users, Gates, Telemetry readings, Alerts, Predictions, Audit logs) |
| **Auth & Security** | Supabase Auth + JSON Web Tokens (JWT), Bcrypt password hashing | Role-Based Access Control (Administrator, Security Staff, Viewer) |
| **Real-Time** | Supabase Realtime Channels & WebSocket / Socket.IO | 3.5s live telemetry ticks, anomaly alerts, instant scenario switches |
| **AI / ML Layer** | Simulated YOLO-v8 Multi-Class Detector + Auto-Regressive Time-Series Engine | Inflow density scoring, 10m/30m/60m prediction horizons, conversational assistant |


---

## 🏗️ 4. System Architecture

```text
COLLEGE GATE (Physical Environment)
      ↓ (Raw Physical Traffic Flow)
CAMERA / SENSOR DATA (Perception Layer)
      ↓ (Raw Video Stream)
DATA ACQUISITION (Ingestion Layer)
      ↓ (Video Frames)
PREPROCESSING (ROI Masking & Normalization)
      ↓ (Processed Frames)
AI VEHICLE DETECTION (YOLO-Based Multi-Class Object Detection)
      ↓ (Detected Vehicle Bounding Boxes & Classes)
VEHICLE COUNTING (Virtual Tripwire & Density Matrix)
      ↓ (Lane Counts & Classified Stream)
TRAFFIC PATTERN ANALYSIS (Velocity & Queue Estimation)
      ↓ (Traffic Feature Vectors)
TIME-SERIES PREDICTION (Auto-Regressive Rush Pattern Model)
      ↓ (Forecast Horizon & Risk Probability)
CONGESTION DECISION LOGIC (Composite Congestion Index 0–100)
      ↓ (Congestion State: NORMAL, MODERATE, HIGH, CRITICAL)
ALERT GENERATION (Event Dispatcher)
      ↓ (Structured Alert Payload)
DASHBOARD / UI (React Command Center)
      ↓ (Visual Telemetry & Recommendations)
SECURITY STAFF (Human Governance)
      ↓ (Human Decision & Assessment)
HUMAN VERIFICATION (Safety Verification Gate)
      ↓ (Staff Confirmed Action Plan)
TRAFFIC MANAGEMENT ACTION (Secondary Gate Open / Emergency Corridor)
      ↓ (Closed-Loop Feedback)
FEEDBACK & MODEL OPTIMIZATION (↺ Model Calibration)
```

> **Human-in-the-Loop Principle**: *“AI detects and recommends. Human staff verify and take action.”*

---

## 📂 5. Project File Structure

```text
smartgate-ai/
│
├── client/                                 # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                  # Public landing navbar
│   │   │   ├── Sidebar.jsx                 # 10 navigation modules
│   │   │   ├── Header.jsx                  # Status pill & scenario switcher
│   │   │   ├── StatCard.jsx                # Glassmorphic KPI card
│   │   │   ├── DemoBadge.jsx               # Safety indicator
│   │   │   ├── LiveCameraFeed.jsx          # CCTV video HUD & bounding boxes
│   │   │   ├── AskSmartGateModal.jsx       # Floating AI chatbot
│   │   │   ├── ToastContainer.jsx          # Notification stack
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             # JWT session & login state
│   │   │   ├── SocketContext.jsx           # Socket.IO live stream
│   │   │   └── ToastContext.jsx            # Toast alerts
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx              # Protected app layout
│   │   │   └── AuthLayout.jsx              # Auth layout
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx             # Futuristic Hero & pipeline steps
│   │   │   ├── LoginPage.jsx               # Sign in + demo button
│   │   │   ├── RegisterPage.jsx            # Role-based registration
│   │   │   ├── DashboardPage.jsx           # Command Center overview & KPIs
│   │   │   ├── LiveTrafficPage.jsx         # Simulated CCTV stream & lanes
│   │   │   ├── AiAnalysisPage.jsx          # YOLO & Predictive diagnostics
│   │   │   ├── AlertCenterPage.jsx         # Acknowledge & resolve alerts
│   │   │   ├── AnalyticsPage.jsx           # 5 Interactive Recharts graphs
│   │   │   ├── GateManagementPage.jsx      # Gate controls & audit logs
│   │   │   ├── SystemArchitecturePage.jsx  # Interactive flow diagram
│   │   │   ├── C29MethodologyPage.jsx      # Field observation & 5 Whys
│   │   │   └── SettingsPage.jsx            # Profile & simulation reset
│   │   ├── services/
│   │   │   └── api.js                      # REST API client
│   │   ├── App.jsx                         # React router setup
│   │   ├── index.css                       # Cyber design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                                 # Express.js Backend
│   ├── ai/
│   │   ├── congestionModel.js              # Congestion scoring & rules
│   │   ├── predictionEngine.js             # Time-series forecasting
│   │   └── chatAssistant.js                # Natural language traffic AI
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── trafficController.js
│   │   ├── alertController.js
│   │   ├── gateController.js
│   │   ├── aiController.js
│   │   └── projectController.js
│   ├── database/
│   │   ├── db.js                           # Postgres + in-memory dual layer
│   │   ├── schema.sql                      # SQL table definitions
│   │   └── seed.js
│   ├── middleware/
│   │   ├── authMiddleware.js               # JWT verification
│   │   └── errorHandler.js
│   ├── routes/
│   ├── simulation/
│   │   └── trafficSimulator.js             # Telemetry generator & loop
│   ├── package.json
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json                            # Root orchestration
└── README.md
```

---

## 🚀 6. Installation & Running Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **PostgreSQL**: (Optional) If omitted, internal resilient in-memory storage runs automatically.

### Step 1: Install Dependencies
```bash
npm run install-all
```
*Or manually:*
```bash
cd server && npm install
cd ../client && npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` into `server/.env`:
```bash
PORT=5050
JWT_SECRET=smartgate_ai_secure_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartgate_ai # Optional
```

### Step 3: Run Full-Stack Application
To start both Backend API and Frontend Vite server concurrently:
```bash
npm run dev
```

Alternatively, in separate terminals:
- **Terminal 1 (Backend API & Telemetry Server)**:
  ```bash
  npm run server
  # Server starts on http://localhost:5050
  ```
- **Terminal 2 (Frontend Client)**:
  ```bash
  npm run client
  # Client starts on http://localhost:5173 or http://localhost:5174
  ```

---

## 🔑 7. Demo Login Credentials

The database is pre-seeded with verified test accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator (BALAJI EN)** | `balajien08@gmail.com` | `3329` | Full command center, gate control, alert resolution |
| **Security Staff** | `security@smartgate.ai` | `Staff@123` | Live monitor, alert acknowledge, gate actuation |
| **Viewer** | `viewer@smartgate.ai` | `Admin@123` | Read-only analytics, observation review |

*(Clicking **"One-Click Demo Access"** on the login page signs in immediately as BALAJI EN.)*

---

## 📡 8. REST API Endpoints

### Authentication
- `POST /api/auth/register` — Register new security operator
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET  /api/auth/me` — Get current logged-in operator details

### Dashboard & Telemetry
- `GET  /api/dashboard` — Live KPI metrics, status pill, active gates, sparklines
- `GET  /api/traffic/live` — Simulated CCTV feed, bounding boxes, lane counts
- `GET  /api/traffic/analytics?period=today|7d|30d` — 5 interactive chart datasets
- `GET  /api/traffic/prediction` — Time-series forecast (10m, 30m, 60m)

### Alert Center
- `GET   /api/alerts` — Filter alerts by severity (`Critical`, `Warning`, `Info`) and status (`Active`, `Acknowledged`, `Resolved`)
- `PATCH /api/alerts/:id` — Acknowledge or Resolve alert
- `POST  /api/alerts` — Trigger simulated test alert

### Gate Management
- `GET   /api/gates` — Retrieve operational statuses for all gates
- `PATCH /api/gates/:id` — Actuate gate (`Open`, `Closed`, `Available`)
- `GET   /api/gates/logs` — Retrieve security action audit trail

### AI Assistant & Insights
- `GET  /api/ai/insights` — YOLO detection stats & AI insight cards
- `POST /api/ai/chat` — Conversational assistant linked to live telemetry

### C29 Project Methodology
- `GET   /api/project` — Field observation, 5 Whys, stakeholders, solutions comparison
- `PATCH /api/project/field-numbers` — Edit 3 Field numbers during viva presentation

---

## 🛡️ 9. Responsible AI Principles

1. **Human-in-the-Loop Governance**: AI generates recommendations; human security personnel always verify before opening/closing gates.
2. **Privacy by Design**: No facial recognition or biometric driver identification is stored.
3. **Data Minimization**: Only aggregate vehicle classifications (Cars, Bikes, Buses, Vans) and queue lengths are logged.
4. **Transparent Demo Demarcation**: All simulated values and models are labeled with `DEMO / SIMULATED DATA` badges.
5. **False Alarm Mitigation**: Multi-factor decision matrix prevents premature alarms.

---

## ⚖️ 10. Limitations & Future Scope

### Current Prototype Limitations
- Video feeds and computer vision bounding boxes are simulated for academic demonstration.
- Requires edge-gateway hardware (e.g. NVIDIA Jetson) for physical IP camera streaming.

### Future Scope
- On-premise deployment of actual YOLO-v8 model on physical RTSP campus camera streams.
- Automated RFID / FastTag barrier integration.
- Mobile push notifications for college bus drivers to stage at alternate holding areas.

---

## 🎓 11. Presentation Walkthrough for Evaluators

When presenting for C29 evaluation, follow this sequence:
1. **Landing Page**: Show the problem statement and the 4-step AI workflow.
2. **Dashboard**: Highlight the 6 KPI cards, the status pill (Normal/High), and real-time sparklines.
3. **Live Traffic**: Demonstrate the simulated CCTV camera view, vehicle classification (Cars, Bikes, Buses, Vans), and lane tracking.
4. **AI Traffic Analysis**: Explain the YOLO detection layer, the 10m/30m forecast progression, and the 4 insight cards.
5. **Alert Center**: Acknowledge an active alert and show how it syncs to the database and audit trail.
6. **Gate Management**: Open the Secondary Gate to show simulated barrier actuation.
7. **Ask SmartGate AI**: Ask *"Why is traffic high?"* and *"What action do you recommend?"* to show natural language intelligence.
8. **C29 Methodology**: Walk through the Field Observation, the 5 Whys, the Stakeholder Map, the 3 Field Numbers, and the Responsible AI principles.

---

*SmartGate AI © 2026 — AI Immersion Project*
