u# ✈ AeroShield AI
## Multimodal Airport Identity & Document Screening System

> **"One Passenger. Multiple Signals. One Explainable Security Decision."**

AeroShield AI is a full-stack AI-powered multimodal airport identity verification and document screening system. Built for modern airport security and immigration operations, it integrates optical document scanning, image forensics, webcam facial verification, infrared iris biometric scanning, Supabase & Neon database syncing, and an explainable risk engine with real-time Red Flag alerts for security authorities.

---

## 🌟 Key Features

- **📷 Optical Passport Camera Scanner**: Live webcam document scanning with ICAO 9303 MRZ reticle alignment, snapshot capture, and OCR extraction.
- **👤 Live Webcam Facial Verification**: Face capture with liveness detection (`PASS`) and real-time facial vector matching against passport reference photos.
- **👁️ Biometric Iris Scanner**: Infrared dual-eye reticle target alignment, pupil Galton pattern extraction, and iris similarity match scoring.
- **🚨 Red Flag Security Strobe**: Real-time audio-visual alert broadcasting to Supabase database, security officer headers, and emergency action queues upon high risk detection.
- **✈ Express Passenger Self Check-in**: Kiosk portal (`/passenger-kiosk`) for travelers with automated background AI processing (backend complexity completely hidden from passenger view).
- **⚡ Dual Cloud Database Architecture**: Live database sync with **Supabase** (`@supabase/supabase-js`) and **Neon PostgreSQL** serverless cloud.
- **🛡️ Fraud Detection Demo**: 1-click interactive Fraud Simulation mode demonstrating instant red flags, iris pattern mismatches, and biometric security alerts.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│              Frontend (React + Vite + TypeScript)               │
│        Officer Workspace & Smart Gate Self-Service Kiosk        │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API / Supabase Client
┌────────────────────────────▼────────────────────────────────────┐
│                    Backend (FastAPI + Python)                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Verification Orchestrator                    │  │
│  └───────────┬──────────────┬──────────────┬───────────────┘  │
│              │              │              │                    │
│  ┌───────────▼──┐ ┌─────────▼──┐ ┌────────▼────────┐         │
│  │  OCR Service │ │ Forensics  │ │ Biometric       │         │
│  │  & Validation│ │ Engine     │ │ Face / FP / Iris│         │
│  └──────────────┘ └────────────┘ └─────────────────┘         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Identity Fusion → Risk Engine → Red Flag Broadcast     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  Cloud & Local Database Layer                   │
│        Supabase DB • Neon PostgreSQL • SQLite Local Cache       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Installation

**Frontend Setup:**
```bash
cd aeroshield-ai/frontend
npm install
npm run dev
```

**Backend Setup:**
```bash
cd aeroshield-ai/backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python scripts/seed_data.py
python -m uvicorn app.main:app --reload --port 8000
```

---

## 👤 Officer Demo Accounts

| Role | Officer ID | Password | Access |
| :--- | :--- | :--- | :--- |
| **Immigration Officer** | `IMM001` | `AeroShield@2026` | Screening workspace & passenger lookup |
| **Administrator** | `ADMIN001` | `AeroShield@2026` | Full system settings & operational metrics |
| **Security Officer** | `SEC001` | `AeroShield@2026` | Red flag alerts & action queue |
| **Auditor** | `AUD001` | `AeroShield@2026` | Audit logs & compliance reports |

---

## 🎮 How to Test the Demos

### 1. Officer Screening Workspace
1. Navigate to `http://localhost:5173/` and sign in as `IMM001`.
2. Click **Start Passenger Screening**.
3. Use the **Passport Camera Scanner** or **Live Webcam Face Verification**.
4. Run Scenario 5 to inspect the **Explainable AI Risk Engine** and broadcast **Red Flag Alerts**.

### 2. Express Passenger Self-Check-in Kiosk
1. Navigate to `http://localhost:5173/passenger-kiosk` (or click **LAUNCH PASSENGER KIOSK** on login screen).
2. Scan your passport and complete webcam facial & iris recognition.
3. Click **`⚡ SIMULATE FRAUD DETECTED DEMO`** to test real-time fraud detection and automatic security escalation!

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, @supabase/supabase-js
- **Backend**: Python 3.14, FastAPI, SQLAlchemy, Alembic, Pydantic v2, Pytest, Uvicorn
- **Database**: Supabase PostgreSQL, Neon Cloud DB, SQLite local fallback
- **Biometric Sensors**: WebRTC HTML5 Camera Feed, Optical Reticle Overlays, Galton Iris Extractor

---

## 📁 Repository Structure

```text
SIH26188/
├── aeroshield-ai/
│   ├── frontend/            # React + Vite TypeScript App
│   │   ├── src/
│   │   │   ├── components/  # PassportScanner, FaceVerification, IrisScanner, RedFlagAlerts
│   │   │   ├── pages/       # Dashboard, Verification, PassengerPortal, Reviews, AuditLog
│   │   │   ├── lib/         # Supabase client & Red Flag broadcasting
│   │   │   └── services/    # Demo scenario data
│   ├── backend/             # FastAPI Server
│   │   ├── app/             # API routes, Models, Schemas, AI interfaces, Risk Engine
│   │   └── scripts/         # Seed database script
│   ├── database/            # Supabase SQL Schema & DDL migrations
│   └── docker-compose.yml
└── README.md
```

---

## 👥 Team

Built for **Smart India Hackathon (SIH 2026)**  
*Repository*: [https://github.com/Jayaram002/SIH26188.git](https://github.com/Jayaram002/SIH26188.git)
Deployed Link:https://sih-26188-three.vercel.app/login
