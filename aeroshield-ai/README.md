# ✈ AeroShield AI
## Airport Identity Security & Screening Platform

> **"One Passenger. Multiple Signals. One Explainable Security Decision."**

AeroShield AI is a full-stack hackathon prototype demonstrating AI-powered multimodal identity verification for airport security and immigration operations. It combines document intelligence, image forensics, facial verification, fingerprint verification, iris verification, database matching, liveness/PAD checks, and an explainable risk engine.

---

## 🏆 SIH Hackathon Prototype

This system is designed for demonstration purposes to showcase how an airport security/immigration officer can rapidly screen a passenger using multiple independent verification signals and receive an explainable risk decision.

> ⚠️ **DISCLAIMER**: This is a prototype using demo/simulated biometric services. It is NOT connected to any real airport, government, or biometric database system. All biometric results are simulated for demonstration purposes. Production deployment would require compliance with applicable privacy, biometric, aviation, cybersecurity, and government regulations.

---

## 🎯 Problem Statement

Airport security officers face the challenge of:
- Rapidly verifying passenger identity across hundreds of travelers per shift
- Detecting forged documents and presentation attacks
- Correlating multiple identity signals (face, fingerprint, iris, document)
- Making defensible, auditable decisions
- Handling edge cases (biometric conflicts, document anomalies) systematically

## 💡 Solution: AeroShield AI

A multimodal identity screening platform that:
1. **Extracts** data from travel documents via OCR + MRZ parsing
2. **Validates** document structure, fields, and database consistency
3. **Analyzes** documents for tampering and forgery indicators
4. **Verifies** identity via face, fingerprint, and iris comparison
5. **Detects** presentation attacks (liveness/PAD checks)
6. **Fuses** all signals into a weighted risk score
7. **Explains** every decision with human-readable reasoning
8. **Audits** every action for accountability

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                    │
│              Airport Security Operations Interface              │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
┌────────────────────────────▼────────────────────────────────────┐
│                    Backend (FastAPI + Python)                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Verification Orchestrator                    │  │
│  └───────────┬──────────────┬──────────────┬───────────────┘  │
│              │              │              │                    │
│  ┌───────────▼──┐ ┌─────────▼──┐ ┌────────▼────────┐         │
│  │  OCR Service │ │ Forensics  │ │ Biometric       │         │
│  │  (Demo/Real) │ │ Service    │ │ Services        │         │
│  └──────────────┘ └────────────┘ │ Face/FP/Iris    │         │
│                                  └─────────────────┘         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Identity Fusion → Risk Engine → Red Flag Engine         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    PostgreSQL Database                          │
│         Passengers, Verifications, Audit Logs, Settings        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- 4GB RAM minimum

### One-Command Setup
```bash
git clone <repo>
cd aeroshield-ai
cp .env.example .env
docker compose up --build
```

The application will be available at:
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Local Development Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
cp .env.example .env

# Create database
createdb aeroshield_db

# Run migrations
alembic upgrade head

# Seed demo data
python scripts/seed_data.py

# Start server
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 👤 Demo Accounts

| Role | Officer ID | Password | Access |
|------|-----------|---------|--------|
| **Admin** | `ADMIN001` | `AeroShield@2026` | Full system access |
| **Immigration Officer** | `IMM001` | `AeroShield@2026` | Screening, passengers |
| **Security Officer** | `SEC001` | `AeroShield@2026` | Screening, alerts |
| **Auditor** | `AUD001` | `AeroShield@2026` | View-only, reports |

---

## 🎭 Demo Scenarios

| # | Scenario | Expected Result |
|---|---------|----------------|
| **1** | Genuine Passenger — All signals match | ✅ VERIFIED (Risk: 8/100) |
| **2** | Document Tampering — Forensic anomalies | ⚠️ REVIEW REQUIRED (Risk: 52/100) |
| **3** | Possible Impersonation — Face mismatch | ⚠️ BIOMETRIC CONFLICT (Risk: 68/100) |
| **4** | Expired Visa — Valid passport, expired visa | ⚠️ REVIEW REQUIRED (Risk: 45/100) |
| **5** | Multiple Conflicts — Document + biometric | 🔴 HIGH RISK (Risk: 91/100) |

To run a demo:
1. Log in as `IMM001`
2. Click **START PASSENGER SCREENING**
3. Select a demo scenario
4. Click **RUN FULL AUTO SCREENING**

---

## 🔌 AI Modules

### Document Intelligence
| Module | Description | Implementation |
|--------|-------------|---------------|
| **OCR Service** | Extracts text fields from document images | Demo: structured simulation. Production: Tesseract/AWS Textract/Azure OCR |
| **MRZ Parser** | Reads Machine Readable Zone from passports | Demo: simulated. Production: pymrtd/mrz-parse |
| **Document Validation** | Validates field formats, dates, consistency | Rule-based engine (fully implemented) |
| **Forensics Service** | Detects tampering, photo replacement, metadata anomalies | Demo: scenario-driven simulation. Production: ELA analysis, CNNs |

### Biometric Verification
| Module | Description | Implementation |
|--------|-------------|---------------|
| **Face Verification** | Compares document photo to live face | Demo: DEMO_FACE adapter. Production: DeepFace/InsightFace/AWS Rekognition |
| **Face Liveness (PAD)** | Detects presentation attacks | Demo: simulated. Production: 3D depth maps, texture analysis |
| **Fingerprint Verification** | Matches fingerprint templates | Demo: DEMO_FINGERPRINT adapter. Production: NIST NBIS/commercial SDK |
| **Fingerprint PAD** | Detects fake fingerprints | Demo: simulated. Production: material analysis, pulse detection |
| **Iris Verification** | Compares iris patterns | Demo: DEMO_IRIS adapter. Production: IriShield/VeriEye/Innovatrics |
| **Iris PAD** | Detects printed/digital iris attacks | Demo: simulated. Production: texture analysis |

### Risk Engine
- Weighted fusion of all verification signals
- Configurable weights and thresholds
- Produces: Identity Confidence, Document Integrity, Biometric Confidence, Overall Risk Score
- Status thresholds: VERIFIED(<15), LOW_RISK(<30), REVIEW_REQUIRED(<70), HIGH_RISK(≥70)

---

## 🛡️ Security Features

- **JWT Authentication** — HS256 signed tokens, 8-hour session
- **RBAC** — Role-based access control (Admin, Immigration, Security, Auditor)
- **Password Hashing** — bcrypt with salt
- **File Upload Validation** — Type, size, and content validation
- **SQL Injection Protection** — SQLAlchemy ORM parameterized queries
- **CORS** — Configured whitelist
- **Rate Limiting** — slowapi
- **Audit Logging** — Every action logged with officer ID, timestamp, result
- **Data Masking** — Sensitive fields masked in API responses
- **Biometric Vault** — No raw templates exposed through APIs

---

## 📊 Database Schema

```
users                    # Officer accounts with roles
passengers               # Passenger profiles (masked sensitive fields)
travel_records           # Flight, visa, travel data
identity_documents       # Uploaded document files (server-side)
verification_sessions    # Active and completed screenings
ocr_results              # OCR extraction results
document_validations     # Field validation results
forensic_analyses        # Document tampering analysis
face_verifications       # Face comparison results
fingerprint_verifications # Fingerprint comparison results
iris_verifications       # Iris comparison results
risk_assessments         # Calculated risk scores and explanations
red_flags                # Individual risk indicators
manual_reviews           # Review queue cases
audit_logs               # Complete action audit trail
system_settings          # Configurable thresholds and parameters
```

---

## 📡 API Documentation

Full interactive API documentation at: http://localhost:8000/docs

### Key Endpoints

```
POST /api/auth/login              — Officer login
GET  /api/auth/me                 — Current officer info

GET  /api/passengers              — Search passengers
GET  /api/passengers/{id}         — Get passenger details
GET  /api/passengers/{id}/history — Screening history

POST /api/documents/upload        — Upload identity document
POST /api/documents/{id}/ocr     — Run OCR extraction
POST /api/documents/{id}/validate — Validate document fields
POST /api/documents/{id}/forensics — Run tampering analysis

POST /api/face/verify             — Face verification
POST /api/fingerprint/verify      — Fingerprint verification
POST /api/iris/verify             — Iris verification

POST /api/verification/start      — Start new screening session
GET  /api/verification/{id}       — Get session details
POST /api/verification/{id}/risk  — Calculate risk score
POST /api/verification/{id}/decision — Submit final decision

GET  /api/reviews                 — Get review queue
POST /api/reviews                 — Create review case
PUT  /api/reviews/{id}            — Update review status

GET  /api/dashboard/statistics    — Dashboard KPIs
GET  /api/audit-logs              — Audit log entries
GET  /api/system/health           — Service health status
GET  /api/settings                — System configuration
```

---

## 🧪 Testing

```bash
cd backend
pytest tests/ -v

# Run specific test categories
pytest tests/test_auth.py -v
pytest tests/test_risk.py -v
pytest tests/test_workflow.py -v

# Coverage report
pytest tests/ --cov=app --cov-report=html
```

### Test Coverage
- ✅ Authentication (login, invalid creds, RBAC)
- ✅ OCR extraction (valid doc, invalid doc)
- ✅ Document validation (expired, field mismatch)
- ✅ Forensics (normal, suspicious)
- ✅ Biometrics (face/fp/iris match and mismatch)
- ✅ Risk engine (low/medium/high, biometric conflict)
- ✅ End-to-end workflow

---

## 🏁 Verification Workflow

```
01. PASSENGER IDENTIFICATION
    └── Search by ID / QR / Barcode / Passport Number
02. DOCUMENT CAPTURE
    └── Upload / Camera / Demo → Document Preview
    └── OCR Extraction (animated)
    └── Document Validation (field-by-field)
03. AI FORENSICS
    └── Tampering Detection
    └── Forensic Viewer (5 views)
04. FACE VERIFICATION
    └── Live Camera vs Document Photo
    └── Liveness Check / PAD
05. FINGERPRINT VERIFICATION
    └── Scanner Interface
    └── PAD Check
06. IRIS VERIFICATION
    └── Dual-Eye Capture
    └── PAD Check
    └── Biometric Consistency Panel
07. RISK ASSESSMENT
    └── Identity Confidence
    └── Document Integrity
    └── Biometric Confidence
    └── Overall Risk Score + Red Flags
08. FINAL DECISION
    └── VERIFIED / LOW RISK / REVIEW REQUIRED / HIGH RISK
    └── Explainable AI reasoning
    └── Officer action (Approve / Send to Review)
```

---

## ⚠️ Limitations & Ethical Considerations

1. **Demo adapters**: All biometric services use simulated results, not real measurements
2. **No real databases**: Not connected to any government or biometric database
3. **Human-in-the-loop**: System supports, never replaces, authorized personnel decisions
4. **No definitive fraud claims**: Uses language like "potential anomaly" and "requires review"
5. **No accuracy guarantees**: "verification confidence" not "100% accurate detection"
6. **Privacy**: Production deployment requires biometric data protection regulations compliance

---

## 🔮 Future Improvements

- [ ] Real OCR integration (Tesseract/AWS Textract)
- [ ] Real face verification (InsightFace/ArcFace)
- [ ] ICAO-compliant MRZ parsing
- [ ] WebSocket for real-time officer notifications
- [ ] PDF report generation (WeasyPrint)
- [ ] Multi-language document support
- [ ] Watchlist integration
- [ ] Hardware biometric sensor SDK integration
- [ ] Advanced PAD models
- [ ] Federated learning for threshold optimization
- [ ] Multi-terminal/multi-airport deployment

---

## 📁 Project Structure

```
aeroshield-ai/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Auth state management
│   │   ├── types/         # TypeScript type definitions
│   │   └── services/      # Demo data service
│   └── Dockerfile
├── backend/               # FastAPI + Python
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── models/        # SQLAlchemy DB models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── ai/            # AI service interfaces + demo adapters
│   │   ├── risk/          # Risk engine + red flag engine
│   │   ├── security/      # JWT + RBAC
│   │   └── audit/         # Audit logging
│   ├── tests/             # Pytest test suite
│   ├── scripts/           # Seed data script
│   └── Dockerfile
├── database/
│   └── init.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 👥 Team

Built for **Smart India Hackathon (SIH) 2026**

---

*AeroShield AI — Airport Identity Security & Screening Platform*  
*Prototype | Demo Mode | Not for Production Use*
