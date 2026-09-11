"""
AeroShield AI - Weighted Risk Engine
Produces explainable risk scores from multimodal identity verification signals.
"""
from typing import Optional

DEFAULT_WEIGHTS = {
    "ocr_confidence": 0.05,
    "document_validation": 0.10,
    "forensic_analysis": 0.15,
    "face_similarity": 0.20,
    "face_liveness": 0.05,
    "fingerprint_similarity": 0.15,
    "fingerprint_pad": 0.05,
    "iris_similarity": 0.15,
    "iris_pad": 0.05,
    "database_match": 0.05,
}

# Configurable thresholds (matched against system settings)
DEFAULT_THRESHOLDS = {
    "face_similarity_threshold": 0.80,
    "fingerprint_threshold": 0.85,
    "iris_threshold": 0.85,
    "ocr_confidence_threshold": 0.75,
    "risk_review_threshold": 30,
    "risk_high_threshold": 70,
}


def calculate_risk(signals: dict, weights: Optional[dict] = None, thresholds: Optional[dict] = None) -> dict:
    """
    Calculate overall risk score from verification signals.

    Signals expected (all optional, defaults to ideal):
        ocr_confidence: float (0-1) - OCR extraction confidence
        mrz_ok: bool - MRZ line detected and valid
        document_valid: bool - All document validation checks passed
        tampering_risk: str - LOW/MEDIUM/HIGH - forensic analysis result
        tampering_detected: bool - forensic tampering indicator
        face_score: float (0-1) - face similarity score
        face_liveness: str - PASS/FAIL/UNCERTAIN
        face_pad: str - PASS/FAIL/UNCERTAIN
        fingerprint_score: float (0-1) - fingerprint similarity
        fingerprint_pad: str - PASS/FAIL/UNCERTAIN
        iris_score: float (0-1) - iris similarity
        iris_pad: str - PASS/FAIL/UNCERTAIN
        database_match: bool - passenger found in database
        visa_expired: bool - travel visa expired
        scenario: int (1-5) - demo scenario override
    """
    if weights is None:
        weights = DEFAULT_WEIGHTS
    if thresholds is None:
        thresholds = DEFAULT_THRESHOLDS

    # Demo scenario override — deterministic results for demos
    scenario = signals.get("scenario")
    if scenario:
        return _scenario_result(int(scenario))

    risk_score = 0.0
    explanation = []
    red_flags = []

    # --- OCR Confidence ---
    ocr_conf = signals.get("ocr_confidence", 1.0)
    ocr_threshold = thresholds.get("ocr_confidence_threshold", 0.75)
    if ocr_conf < ocr_threshold:
        penalty = (ocr_threshold - ocr_conf) * 100 * 0.8
        risk_score += penalty
        red_flags.append({
            "type": "OCR_LOW_CONFIDENCE",
            "severity": "HIGH" if ocr_conf < 0.60 else "MEDIUM",
            "confidence": round(1 - ocr_conf, 2),
            "description": f"OCR confidence {ocr_conf*100:.1f}% is below threshold {ocr_threshold*100:.0f}%"
        })
        explanation.append(f"OCR confidence ({ocr_conf*100:.1f}%) below expected threshold — document quality concern")

    # --- MRZ ---
    if not signals.get("mrz_ok", True):
        risk_score += 15
        red_flags.append({
            "type": "DOCUMENT_INVALID_FORMAT",
            "severity": "HIGH",
            "confidence": 0.90,
            "description": "MRZ not detected or invalid"
        })
        explanation.append("Machine Readable Zone (MRZ) not detected or contains errors")

    # --- Document Validation ---
    if not signals.get("document_valid", True):
        risk_score += 10
        explanation.append("Document validation checks failed — field inconsistencies detected")

    # --- Forensic Analysis ---
    tampering_risk = signals.get("tampering_risk", "LOW")
    tampering_detected = signals.get("tampering_detected", False)
    if tampering_detected or tampering_risk == "HIGH":
        risk_score += 35
        red_flags.append({
            "type": "POSSIBLE_TAMPERING",
            "severity": "CRITICAL" if tampering_risk == "HIGH" else "HIGH",
            "confidence": 0.88,
            "description": "Document tampering indicators detected in forensic analysis"
        })
        explanation.append("Potential document manipulation detected — forensic analysis flagged anomalies")
    elif tampering_risk == "MEDIUM":
        risk_score += 15
        red_flags.append({
            "type": "POSSIBLE_TAMPERING",
            "severity": "MEDIUM",
            "confidence": 0.72,
            "description": "Minor document anomalies detected — possible tampering"
        })
        explanation.append("Minor document anomalies detected — requires secondary document inspection")

    # --- Face Verification ---
    face_score = signals.get("face_score", 1.0)
    face_threshold = thresholds.get("face_similarity_threshold", 0.80)
    if face_score < face_threshold:
        penalty = (face_threshold - face_score) * 100 * 1.5
        risk_score += min(penalty, 40)
        severity = "CRITICAL" if face_score < 0.50 else "HIGH"
        red_flags.append({
            "type": "FACE_MISMATCH",
            "severity": severity,
            "confidence": round(1 - face_score, 2),
            "description": f"Face similarity {face_score*100:.1f}% below threshold {face_threshold*100:.0f}%"
        })
        explanation.append(f"Face similarity ({face_score*100:.1f}%) is below configured threshold of {face_threshold*100:.0f}%")
    else:
        explanation.append(f"Face verification passed ({face_score*100:.1f}% similarity)")

    face_liveness = signals.get("face_liveness", "PASS")
    if face_liveness == "FAIL":
        risk_score += 25
        red_flags.append({
            "type": "FACE_LIVENESS_FAILURE",
            "severity": "HIGH",
            "confidence": 0.92,
            "description": "Face liveness check failed — possible presentation attack"
        })
        explanation.append("Face liveness check failed — potential presentation attack detected")

    # --- Fingerprint Verification ---
    fp_score = signals.get("fingerprint_score", 1.0)
    fp_threshold = thresholds.get("fingerprint_threshold", 0.85)
    if fp_score < fp_threshold:
        penalty = (fp_threshold - fp_score) * 100 * 1.2
        risk_score += min(penalty, 30)
        red_flags.append({
            "type": "FINGERPRINT_MISMATCH",
            "severity": "HIGH" if fp_score < 0.60 else "MEDIUM",
            "confidence": round(1 - fp_score, 2),
            "description": f"Fingerprint similarity {fp_score*100:.1f}% below threshold"
        })
        explanation.append(f"Fingerprint similarity ({fp_score*100:.1f}%) below configured threshold")
    else:
        explanation.append(f"Fingerprint verification passed ({fp_score*100:.1f}%)")

    fp_pad = signals.get("fingerprint_pad", "PASS")
    if fp_pad == "FAIL":
        risk_score += 20
        red_flags.append({"type": "FINGERPRINT_PAD_FAILURE", "severity": "HIGH", "confidence": 0.88, "description": "Fingerprint PAD check failed"})

    # --- Iris Verification ---
    iris_score = signals.get("iris_score", 1.0)
    iris_threshold = thresholds.get("iris_threshold", 0.85)
    if iris_score < iris_threshold:
        penalty = (iris_threshold - iris_score) * 100 * 1.2
        risk_score += min(penalty, 30)
        red_flags.append({
            "type": "IRIS_MISMATCH",
            "severity": "HIGH" if iris_score < 0.60 else "MEDIUM",
            "confidence": round(1 - iris_score, 2),
            "description": f"Iris similarity {iris_score*100:.1f}% below threshold"
        })
        explanation.append(f"Iris similarity ({iris_score*100:.1f}%) below configured threshold")
    else:
        explanation.append(f"Iris verification passed ({iris_score*100:.1f}%)")

    iris_pad = signals.get("iris_pad", "PASS")
    if iris_pad == "FAIL":
        risk_score += 20
        red_flags.append({"type": "IRIS_PAD_FAILURE", "severity": "HIGH", "confidence": 0.88, "description": "Iris PAD check failed"})

    # --- Biometric Conflict Detection ---
    face_match = face_score >= face_threshold
    fp_match = fp_score >= fp_threshold
    iris_match = iris_score >= iris_threshold
    matches = sum([face_match, fp_match, iris_match])
    if matches > 0 and matches < 3:
        # Some match, some don't — conflict
        risk_score += 15
        red_flags.append({
            "type": "BIOMETRIC_CONFLICT",
            "severity": "HIGH",
            "confidence": 0.88,
            "description": f"Biometric signals disagree: {matches}/3 modalities matched"
        })
        explanation.append(f"Biometric conflict detected: {matches}/3 modalities matched — independent signals disagree")

    # --- Database Match ---
    if not signals.get("database_match", True):
        risk_score += 10
        red_flags.append({"type": "DATABASE_CONFLICT", "severity": "MEDIUM", "confidence": 0.80, "description": "Passenger not found in database"})
        explanation.append("No matching database record found for this identity")

    # --- Visa Status ---
    if signals.get("visa_expired", False):
        risk_score += 35
        red_flags.append({
            "type": "VISA_EXPIRED",
            "severity": "HIGH",
            "confidence": 1.0,
            "description": "Travel visa has expired"
        })
        explanation.append("Travel visa is expired — entry clearance required from immigration authority")

    # --- Compute Derived Scores ---
    overall_risk_score = int(min(max(round(risk_score), 0), 100))

    # Identity confidence (inverse of risk from identity signals)
    id_penalties = (1 - face_score) * 40 + (1 - fp_score) * 20 + (1 - iris_score) * 20
    identity_confidence = round(max(0, min(100, 100 - id_penalties)), 1)

    # Document integrity
    doc_penalties = (1 - ocr_conf) * 20
    if tampering_detected:
        doc_penalties += 50
    elif tampering_risk == "MEDIUM":
        doc_penalties += 25
    doc_integrity = round(max(0, min(100, 100 - doc_penalties)), 1)

    # Biometric confidence
    bio_conf = round((face_score + fp_score + iris_score) / 3 * 100, 1)

    # Determine status
    review_threshold = thresholds.get("risk_review_threshold", 30)
    high_threshold = thresholds.get("risk_high_threshold", 70)

    if overall_risk_score < 15:
        status = "VERIFIED"
        recommendation = "Passenger cleared for boarding. All verification signals within acceptable parameters."
    elif overall_risk_score < review_threshold:
        status = "LOW_RISK"
        recommendation = "Passenger cleared with low risk indicators. Manual document spot-check recommended."
    elif overall_risk_score < high_threshold:
        status = "REVIEW_REQUIRED"
        recommendation = "Secondary verification required. Do not clear without manual officer review."
    else:
        status = "HIGH_RISK"
        recommendation = "Do not clear passenger. Escalate to senior officer and security for full investigation."

    # Add no-issues message if clean
    if not red_flags:
        explanation.append("No anomalies detected across any verification channel")
        explanation.append("All signals consistent with identity claim")

    return {
        "overall_risk_score": overall_risk_score,
        "identity_confidence": identity_confidence,
        "document_integrity_score": doc_integrity,
        "biometric_confidence": bio_conf,
        "risk_status": status,
        "red_flags": red_flags,
        "explanation": explanation,
        "recommendation": recommendation,
        "weights_used": weights,
        "signals_used": {k: v for k, v in signals.items() if k != "scenario"},
    }


def _scenario_result(scenario_id: int) -> dict:
    """Return deterministic results for demo scenarios."""
    SCENARIOS = {
        1: {
            "overall_risk_score": 8,
            "identity_confidence": 97.6,
            "document_integrity_score": 96.0,
            "biometric_confidence": 98.2,
            "risk_status": "VERIFIED",
            "red_flags": [],
            "explanation": [
                "All biometric signals confirm identity match",
                "Document structure valid and consistent",
                "No tampering indicators detected",
                "Database record matches all fields",
                "Travel document valid and within expiry",
                "No anomalies detected across any verification channel",
            ],
            "recommendation": "Passenger cleared for boarding.",
        },
        2: {
            "overall_risk_score": 52,
            "identity_confidence": 78.0,
            "document_integrity_score": 54.0,
            "biometric_confidence": 96.7,
            "risk_status": "REVIEW_REQUIRED",
            "red_flags": [
                {"type": "POSSIBLE_TAMPERING", "severity": "MEDIUM", "confidence": 0.82, "description": "Potential alteration in passport number region"},
                {"type": "OCR_LOW_CONFIDENCE", "severity": "LOW", "confidence": 0.71, "description": "OCR confidence below optimal threshold"},
            ],
            "explanation": [
                "Potential document manipulation detected in passport number region",
                "OCR confidence lower than expected for this document type",
                "All biometric signals confirm identity match",
                "Document structure otherwise consistent",
            ],
            "recommendation": "Secondary verification required. Inspect original document manually.",
        },
        3: {
            "overall_risk_score": 68,
            "identity_confidence": 71.0,
            "document_integrity_score": 96.0,
            "biometric_confidence": 82.4,
            "risk_status": "REVIEW_REQUIRED",
            "red_flags": [
                {"type": "FACE_MISMATCH", "severity": "HIGH", "confidence": 0.91, "description": "Face similarity 51.2% below 80% threshold"},
                {"type": "BIOMETRIC_CONFLICT", "severity": "HIGH", "confidence": 0.89, "description": "Face mismatch conflicts with fingerprint and iris match"},
            ],
            "explanation": [
                "Face similarity (51.2%) is significantly below the configured threshold of 80%",
                "Fingerprint and iris both confirm identity match",
                "Biometric conflict: independent signals disagree — requires manual review",
                "Document is valid and shows no tampering indicators",
                "Possible causes: capture quality issue, or identity concern requiring investigation",
            ],
            "recommendation": "Secondary verification required. Re-attempt face capture and conduct manual identity check.",
        },
        4: {
            "overall_risk_score": 45,
            "identity_confidence": 96.2,
            "document_integrity_score": 91.0,
            "biometric_confidence": 97.1,
            "risk_status": "REVIEW_REQUIRED",
            "red_flags": [
                {"type": "VISA_EXPIRED", "severity": "HIGH", "confidence": 1.0, "description": "Travel visa expired 26 days ago"},
            ],
            "explanation": [
                "Passport is valid and shows no tampering indicators",
                "All biometric signals confirm identity",
                "Travel visa expired 26 days ago (2026-08-15)",
                "Passenger requires visa review and clearance from immigration authority",
            ],
            "recommendation": "Refer to immigration authority for visa status clearance before boarding.",
        },
        5: {
            "overall_risk_score": 91,
            "identity_confidence": 28.0,
            "document_integrity_score": 22.0,
            "biometric_confidence": 47.1,
            "risk_status": "HIGH_RISK",
            "red_flags": [
                {"type": "POSSIBLE_TAMPERING", "severity": "CRITICAL", "confidence": 0.94, "description": "High-confidence photo replacement indicators"},
                {"type": "FACE_MISMATCH", "severity": "HIGH", "confidence": 0.91, "description": "Face does not match document photo"},
                {"type": "IRIS_MISMATCH", "severity": "HIGH", "confidence": 0.88, "description": "Iris pattern does not match enrolled template"},
                {"type": "FINGERPRINT_MISMATCH", "severity": "HIGH", "confidence": 0.79, "description": "Fingerprint match uncertain"},
                {"type": "BIOMETRIC_CONFLICT", "severity": "CRITICAL", "confidence": 0.95, "description": "All biometric modalities show anomalies"},
                {"type": "DOCUMENT_EXPIRED", "severity": "HIGH", "confidence": 1.0, "description": "Document expired 2024-01-01"},
                {"type": "OCR_LOW_CONFIDENCE", "severity": "HIGH", "confidence": 0.89, "description": "Very low OCR confidence — possible forgery"},
            ],
            "explanation": [
                "Multiple high-severity anomalies detected across all verification channels",
                "Potential document forgery: photo replacement and field alteration indicators",
                "Face similarity (41.2%) significantly below threshold",
                "Iris match failed — pattern does not match enrolled template",
                "Fingerprint quality insufficient for reliable verification",
                "Document expired January 2024",
                "MRZ not detected or invalid",
            ],
            "recommendation": "DO NOT CLEAR. Detain passenger and escalate to senior security officer for full investigation.",
        },
    }
    result = SCENARIOS.get(scenario_id, SCENARIOS[1]).copy()
    result["weights_used"] = DEFAULT_WEIGHTS
    result["signals_used"] = {"scenario": scenario_id}
    return result
