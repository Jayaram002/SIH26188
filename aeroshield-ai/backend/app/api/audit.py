from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse
from typing import List
import uuid

router = APIRouter()

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(verification_id: str = "", officer_id: str = "", action: str = "", page: int = 1, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    query = db.query(AuditLog)
    if verification_id:
        query = query.filter(AuditLog.verification_session_id == uuid.UUID(verification_id))
    if action:
        query = query.filter(AuditLog.action == action)
    logs = query.order_by(AuditLog.timestamp.desc()).offset((page - 1) * 20).limit(20).all()
    return logs
