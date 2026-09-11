import random
import time
from fastapi import APIRouter

router = APIRouter()

SERVICES = [
    {"name": "OCR Engine", "key": "ocr_engine", "base_latency": 182},
    {"name": "Face Verification", "key": "face_engine", "base_latency": 245},
    {"name": "Fingerprint Service", "key": "fingerprint_service", "base_latency": 130},
    {"name": "Iris Service", "key": "iris_service", "base_latency": 190},
    {"name": "Risk Engine", "key": "risk_engine", "base_latency": 32},
    {"name": "Document Forensics", "key": "forensics_engine", "base_latency": 310},
    {"name": "Database", "key": "database", "base_latency": 8},
    {"name": "Audit Service", "key": "audit_service", "base_latency": 12},
    {"name": "Biometric Vault", "key": "biometric_vault", "base_latency": 18},
]

@router.get("/health")
def system_health():
    """Get real-time system health status with simulated service latencies."""
    services = {}
    all_healthy = True

    for svc in SERVICES:
        # Add realistic random variation to latency
        latency = svc["base_latency"] + random.randint(-20, 30)
        latency = max(5, latency)

        status = "online"
        if latency > 500:
            status = "degraded"
            all_healthy = False

        services[svc["key"]] = {
            "name": svc["name"],
            "status": status,
            "latency_ms": latency,
            "mode": "DEMO",
            "version": "1.0.0",
        }

    return {
        "overall_status": "operational" if all_healthy else "degraded",
        "demo_mode": True,
        "services": services,
        "uptime_seconds": int(time.time()) % 86400,  # fake uptime
        "timestamp": time.time(),
    }
