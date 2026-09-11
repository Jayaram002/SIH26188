import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Enum, ForeignKey, JSON
from app.database.engine import Base
from app.models.user import UUID

class MatchResult(str, enum.Enum):
    MATCH = "MATCH"
    MISMATCH = "MISMATCH"
    UNCERTAIN = "UNCERTAIN"
    NOT_PERFORMED = "NOT_PERFORMED"

class PADResult(str, enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    UNCERTAIN = "UNCERTAIN"

class ForensicAnalysis(Base):
    __tablename__ = "forensic_analyses"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    document_id = Column(UUID, ForeignKey("identity_documents.id"))
    photo_region_risk = Column(String(10))
    text_region_risk = Column(String(10))
    stamp_region_risk = Column(String(10))
    metadata_anomaly = Column(Boolean)
    compression_anomaly = Column(Boolean)
    manipulation_detected = Column(Boolean)
    overall_risk = Column(String(10))
    suspicious_regions = Column(JSON)
    metadata_details = Column(JSON)
    processing_time_ms = Column(Integer)
    service_used = Column(String(50), default="DEMO_FORENSICS")
    created_at = Column(DateTime, default=datetime.utcnow)

class FaceVerification(Base):
    __tablename__ = "face_verifications"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    similarity_score = Column(Float)
    quality_score = Column(Float)
    liveness_result = Column(Enum(PADResult))
    pad_result = Column(Enum(PADResult))
    match_result = Column(Enum(MatchResult))
    face_detected = Column(Boolean)
    processing_time_ms = Column(Integer)
    service_used = Column(String(50), default="DEMO_FACE")
    created_at = Column(DateTime, default=datetime.utcnow)

class FingerprintVerification(Base):
    __tablename__ = "fingerprint_verifications"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    similarity_score = Column(Float)
    quality_score = Column(Float)
    pad_result = Column(Enum(PADResult))
    match_result = Column(Enum(MatchResult))
    finger_detected = Column(Boolean)
    processing_time_ms = Column(Integer)
    service_used = Column(String(50), default="DEMO_FINGERPRINT")
    created_at = Column(DateTime, default=datetime.utcnow)

class IrisVerification(Base):
    __tablename__ = "iris_verifications"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    left_similarity_score = Column(Float)
    right_similarity_score = Column(Float)
    combined_similarity_score = Column(Float)
    quality_score = Column(Float)
    pad_result = Column(Enum(PADResult))
    match_result = Column(Enum(MatchResult))
    left_captured = Column(Boolean)
    right_captured = Column(Boolean)
    processing_time_ms = Column(Integer)
    service_used = Column(String(50), default="DEMO_IRIS")
    created_at = Column(DateTime, default=datetime.utcnow)
