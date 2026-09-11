import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, Enum, ForeignKey, JSON
from app.database.engine import Base
from app.models.user import UUID

class ReviewStatus(str, enum.Enum):
    PENDING = "PENDING"
    ASSIGNED = "ASSIGNED"
    IN_REVIEW = "IN_REVIEW"
    APPROVED = "APPROVED"
    ESCALATED = "ESCALATED"
    REJECTED = "REJECTED"

class ManualReview(Base):
    __tablename__ = "manual_reviews"
    id = Column(UUID, primary_key=True, default=uuid4)
    case_id = Column(String(30), unique=True)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"))
    risk_score = Column(Integer)
    reason = Column(String(200))
    red_flag_types = Column(JSON)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING)
    assigned_officer_id = Column(UUID, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    justification = Column(Text, nullable=True)
    decision = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
