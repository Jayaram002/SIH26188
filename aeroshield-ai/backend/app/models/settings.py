from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from app.database.engine import Base
from app.models.user import UUID

class SystemSetting(Base):
    __tablename__ = "system_settings"
    id = Column(UUID, primary_key=True, default=uuid4)
    key = Column(String(100), unique=True)
    value = Column(String(500))
    category = Column(String(50))
    description = Column(String(500))
    requires_admin = Column(Boolean, default=True)
    updated_by = Column(UUID, ForeignKey("users.id"), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)
