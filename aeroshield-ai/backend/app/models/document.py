import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey
from app.database.engine import Base
from app.models.user import UUID

class DocumentType(str, enum.Enum):
    PASSPORT = "PASSPORT"
    VISA = "VISA"
    NATIONAL_ID = "NATIONAL_ID"
    DRIVING_LICENSE = "DRIVING_LICENSE"
    RESIDENCE_PERMIT = "RESIDENCE_PERMIT"

class IdentityDocument(Base):
    __tablename__ = "identity_documents"
    id = Column(UUID, primary_key=True, default=uuid4)
    passenger_id = Column(UUID, ForeignKey("passengers.id"), nullable=True)
    verification_session_id = Column(UUID, ForeignKey("verification_sessions.id"), nullable=True)
    document_type = Column(Enum(DocumentType))
    file_path = Column(String(500))
    file_hash = Column(String(255))
    file_size = Column(Integer)
    mime_type = Column(String(100))
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    uploaded_by = Column(UUID, ForeignKey("users.id"), nullable=True)
