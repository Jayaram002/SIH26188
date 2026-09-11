import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, JSON
from app.database.engine import Base
from app.models.user import UUID

class AuditAction(str, enum.Enum):
    OFFICER_LOGIN = "OFFICER_LOGIN"
    OFFICER_LOGOUT = "OFFICER_LOGOUT"
    PASSENGER_SEARCH = "PASSENGER_SEARCH"
    PASSENGER_IDENTIFIED = "PASSENGER_IDENTIFIED"
    DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD"
    OCR_PERFORMED = "OCR_PERFORMED"
    DOCUMENT_VALIDATION = "DOCUMENT_VALIDATION"
    FORENSIC_ANALYSIS = "FORENSIC_ANALYSIS"
    FACE_VERIFICATION = "FACE_VERIFICATION"
    FINGERPRINT_VERIFICATION = "FINGERPRINT_VERIFICATION"
    IRIS_VERIFICATION = "IRIS_VERIFICATION"
    RISK_CALCULATED = "RISK_CALCULATED"
    REVIEW_ASSIGNED = "REVIEW_ASSIGNED"
    FINAL_DECISION = "FINAL_DECISION"
    SETTINGS_CHANGED = "SETTINGS_CHANGED"
    SESSION_STARTED = "SESSION_STARTED"

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"), nullable=True)
    officer_id = Column(UUID, ForeignKey("users.id"), nullable=True)
    passenger_id = Column(UUID, ForeignKey("passengers.id"), nullable=True)
    action = Column(Enum(AuditAction))
    result = Column(String(50))
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
