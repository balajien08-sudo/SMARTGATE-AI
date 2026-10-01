# SmartGate AI — AI-Based Traffic Congestion Monitoring & Prediction System for College Gates

> **“Smarter Gates. Safer Campuses.”**  
> *A College AI Immersion / C29 Capstone Project*

---

## 📌 1. Project Overview

**SmartGate AI** is a startup-grade, full-stack AI traffic command center engineered specifically for college entrance management. During peak morning arrival (08:00–09:30 AM) and evening departure windows, campus entrances experience severe vehicular congestion. Manual monitoring by security staff makes it difficult to track incoming velocities, compute queue dynamics, and proactively alleviate bottlenecks.

**SmartGate AI** bridges this gap by combining computer vision vehicle telemetry, time-series forecasting, automated rule-based decision engines, and human-in-the-loop security action workflows.

### New Features (Evidence-Based Enhancements)
- **Field Observations**: Manual data entry for college gate traffic. Allows entering Date, Duration, Peak Time, Max Queue, etc.
- **Python YOLO Pipeline**: `ai/vehicle_detection.py` to run inference on sample footage and generate JSON results.
- **Backend Data Modes**: 
  - **REAL FIELD DATA**: Actual observed values by human personnel on the ground.
  - **AI INFERENCE**: Real AI model predictions derived from sample CCTV footage.
  - **SIMULATED DEMO DATA**: Mock data to prototype UI interactions without real sensors.
- **Dynamic Dashboard**: Shows live data modes, inference mode toggle, and data source indicators.
- **JSON Inference**: Standardized structured JSON output for AI predictions.

## Data Sources

The application visualizes data from three primary origins:
1. **REAL FIELD DATA**: Data manually recorded by human staff during observation periods.
2. **AI INFERENCE**: Data processed via the Python YOLO pipeline from sample traffic footage.
3. **DEMO / SIMULATED DATA**: Pre-configured mock data for UX/UI testing without active sensors.

Example AI JSON output format:
```json
{
  "timestamp": "2026-09-30T10:30:00",
  "vehicle_count": 24,
  "cars": 15,
  "motorcycles": 7,
  "buses": 1,
  "trucks": 1,
  "queue_length": 8,
  "congestion_level": "Medium",
  "prediction": "Increasing"
}
```

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

- **Frontend**: React/Vite Dashboard.
- **Backend**: Node.js/Express REST API serving as a central hub.
- **AI**: Python YOLOv8 pipeline for object detection.
- **Database**: PostgreSQL (via Supabase) and local memory fallback.
- **Dashboard**: Command Center UI.

## AI Pipeline

The vehicle analysis lifecycle operates as follows:
1. **Video**: Sample footage (e.g., `gate_video.mp4`).
2. **YOLO**: Python execution using Ultralytics YOLOv8.
3. **Vehicle Detection**: Bounding box extraction and filtering by target classes.
4. **Vehicle Counting**: Frame-by-frame aggregation.
5. **JSON**: Structured serialization.
6. **API**: Submission to the Node.js backend.
7. **Dashboard**: Live visualization of inference results.

## Error Handling

- **Frontend Error Boundaries**: React ErrorBoundary component catches unexpected rendering crashes.
- **Backend Centralized Error Handling**: `errorHandler.js` formats unexpected API errors into safe, unified JSON structure without stack traces.
- **YOLO Error Handling**: Checks for missing videos, failed model loads, and HTTP backend failures with clear terminal warnings.
- **API Validation**: Traffic payload strict validation (e.g., missing or invalid `vehicle_count` returns 400).

## Testing

For complete testing details, refer to: [Testing Documentation](docs/testing.md).
- **Setup**: Install Vitest (JS) and Pytest (Python).
- **Execution**: Run `npm test` for backend, and `pytest` for AI.
- **Coverage**: Includes critical traffic API validation and Python detection edge cases.

## Database Schema

For complete schema definitions and ER Diagram, refer to: [Database Schema Documentation](docs/database-schema.md).
- **users**: Accounts.
- **gates**: Physical gates.
- **traffic_readings**: AI and manual telemetry.
- **alerts**: System events.
- **ai_predictions**: Future traffic forecasts.
- **action_logs**: Audit trail.
- **field_observations**: Manual records.

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
├── ai/                                     # Python YOLO Pipeline
│   ├── vehicle_detection.py                # YOLOv8 inference script
│   ├── requirements.txt
│   ├── README.md
│   ├── sample_video/                       # Place gate_video.mp4 here
│   ├── output/                             # Annotated videos
│   └── results/                            # JSON structured outputs
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
Copy `.env.example` into `server/.env` (and root `.env`):
```bash
PORT=5050
JWT_SECRET=smartgate_ai_secure_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartgate_ai # Optional
TRAFFIC_DATA_MODE=mock # Options: real, mock, demo
```

### Step 2.5: Supabase Setup (Optional but recommended)
1. In your Supabase Dashboard, go to the SQL Editor.
2. Copy the contents of `server/database/schema.sql`.
3. Run the script to initialize tables: `traffic_readings`, `alerts`, `ai_predictions`, and `field_observations`.

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

### Step 4: Python YOLO Setup
1. `cd ai`
2. `pip install -r requirements.txt`
3. Place a sample video in `ai/sample_video/gate_video.mp4`
4. Run inference: `python vehicle_detection.py --source sample_video/gate_video.mp4`

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

## 📡 8. API Reference

For detailed endpoints, here are the core existing implementations:

### POST /api/traffic/inference
Purpose: Submit structured YOLO traffic inference results.
Request:
```json
{
  "vehicle_count": 10,
  "cars": 5,
  "motorcycles": 4,
  "buses": 1,
  "source": "gate_video.mp4"
}
```
Success:
```json
{
  "success": true,
  "message": "Inference data received."
}
```
Errors:
- 400 – Invalid payload: vehicle_count required or invalid.
- 500 – Server error.

### GET /api/traffic/live
Purpose: Fetch real, mock, or demo telemetry based on server mode.

### GET /api/traffic/observations
Purpose: Fetch field observations.

### POST /api/auth/login
Purpose: Authenticate operator.

### POST /api/alerts
Purpose: Create system alert.

---

## 🛡️ 9. Responsible AI Principles

1. **Human-in-the-Loop Governance**: AI generates recommendations; human security personnel always verify before opening/closing gates. AI does NOT automatically control the college gate.
2. **Privacy by Design**: No facial recognition or biometric driver identification is stored. Avoid exposing vehicle registration numbers.
3. **Data Minimization**: Do not store unnecessary personal information. Use anonymized/processed video where possible. Only aggregate vehicle classifications and queue lengths are logged.
4. **Transparent Demo Demarcation**: All simulated values and models are labeled with `DEMO / SIMULATED DATA` badges. Never present simulated data as real field data.
5. **Validation and Accuracy**: Do not claim model accuracy or validate predictions without actual testing and field evidence. Predictions are prototype recommendations only.

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
