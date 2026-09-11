from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.audit import AuditAction

class AuditLogResponse(BaseModel):
    id: UUID
    action: AuditAction
    result: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime

    class Config:
        from_attributes = True
