import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, ForeignKey, JSON
from app.database.engine import Base
from app.models.user import UUID

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    identity_confidence = Column(Float)
    document_integrity_score = Column(Float)
    biometric_confidence = Column(Float)
    overall_risk_score = Column(Integer)
    risk_status = Column(String(20))
    explanation = Column(JSON)
    recommendation = Column(String(500))
    weights_used = Column(JSON)
    signals_used = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class RedFlagType(str, enum.Enum):
    DOCUMENT_EXPIRED = "DOCUMENT_EXPIRED"
    DOCUMENT_INVALID_FORMAT = "DOCUMENT_INVALID_FORMAT"
    DOCUMENT_MISSING_FIELDS = "DOCUMENT_MISSING_FIELDS"
    OCR_LOW_CONFIDENCE = "OCR_LOW_CONFIDENCE"
    POSSIBLE_TAMPERING = "POSSIBLE_TAMPERING"
    METADATA_ANOMALY = "METADATA_ANOMALY"
    NAME_MISMATCH = "NAME_MISMATCH"
    DOB_MISMATCH = "DOB_MISMATCH"
    ID_MISMATCH = "ID_MISMATCH"
    DATABASE_CONFLICT = "DATABASE_CONFLICT"
    DUPLICATE_IDENTITY = "DUPLICATE_IDENTITY"
    FACE_MISMATCH = "FACE_MISMATCH"
    FACE_LIVENESS_FAILURE = "FACE_LIVENESS_FAILURE"
    FINGERPRINT_MISMATCH = "FINGERPRINT_MISMATCH"
    FINGERPRINT_PAD_FAILURE = "FINGERPRINT_PAD_FAILURE"
    IRIS_MISMATCH = "IRIS_MISMATCH"
    IRIS_PAD_FAILURE = "IRIS_PAD_FAILURE"
    BIOMETRIC_CONFLICT = "BIOMETRIC_CONFLICT"
    VISA_INVALID = "VISA_INVALID"
    VISA_EXPIRED = "VISA_EXPIRED"
    TRAVEL_RECORD_MISMATCH = "TRAVEL_RECORD_MISMATCH"

class RedFlag(Base):
    __tablename__ = "red_flags"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    risk_assessment_id = Column(UUID, ForeignKey("risk_assessments.id"))
    flag_type = Column(Enum(RedFlagType))
    severity = Column(String(10))
    confidence = Column(Float)
    description = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
