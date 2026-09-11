from sqlalchemy.orm import Session
from app.models.audit import AuditLog, AuditAction

class AuditLogger:
    @staticmethod
    def log(db: Session, action: AuditAction, result: str, officer_id=None, passenger_id=None, session_id=None, details=None, ip_address=None):
        log_entry = AuditLog(
            action=action,
            result=result,
            officer_id=officer_id,
            passenger_id=passenger_id,
            verification_session_id=session_id,
            details=details,
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()
