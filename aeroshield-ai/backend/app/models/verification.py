import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, Enum, ForeignKey, JSON
from app.database.engine import Base
from app.models.user import UUID

class VerificationStatus(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    VERIFIED = "VERIFIED"
    LOW_RISK = "LOW_RISK"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    HIGH_RISK = "HIGH_RISK"
    REJECTED = "REJECTED"

class VerificationSession(Base):
    __tablename__ = "verification_sessions"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_id = Column(String(30), unique=True)
    passenger_id = Column(UUID, ForeignKey("passengers.id"), nullable=True)
    officer_id = Column(UUID, ForeignKey("users.id"))
    terminal = Column(String(10))
    checkpoint = Column(String(20))
    current_step = Column(Integer, default=1)
    status = Column(Enum(VerificationStatus), default=VerificationStatus.IN_PROGRESS)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    demo_scenario = Column(Integer, nullable=True)
    
class OCRResult(Base):
    __tablename__ = "ocr_results"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    document_id = Column(UUID, ForeignKey("identity_documents.id"))
    document_type = Column(String(50))
    ocr_confidence = Column(Float)
    mrz_detected = Column(Boolean)
    extracted_name = Column(String(200))
    extracted_doc_number_masked = Column(String(20))
    extracted_nationality = Column(String(3))
    extracted_dob = Column(Date, nullable=True)
    extracted_expiry = Column(Date, nullable=True)
    extracted_gender = Column(String(1))
    extracted_mrz_line1 = Column(String(50))
    extracted_mrz_line2 = Column(String(50))
    raw_text_hash = Column(String(255))
    processing_time_ms = Column(Integer)
    service_used = Column(String(50), default="DEMO_OCR")
    created_at = Column(DateTime, default=datetime.utcnow)

class DocumentValidation(Base):
    __tablename__ = "document_validations"
    id = Column(UUID, primary_key=True, default=uuid4)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    ocr_result_id = Column(UUID, ForeignKey("ocr_results.id"))
    structure_valid = Column(Boolean)
    required_fields_present = Column(Boolean)
    mrz_consistent = Column(Boolean)
    expiry_valid = Column(Boolean)
    doc_number_format_valid = Column(Boolean)
    database_record_found = Column(Boolean)
    name_matches_db = Column(Boolean)
    dob_matches_db = Column(Boolean)
    cross_doc_consistent = Column(Boolean)
    overall_valid = Column(Boolean)
    validation_details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
