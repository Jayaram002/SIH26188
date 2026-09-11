from sqlalchemy.orm import Session
from app.models.verification import VerificationSession

class VerificationService:
    def __init__(self, db: Session):
        self.db = db

    def get_session(self, sess_id: str) -> VerificationSession | None:
        return self.db.query(VerificationSession).filter(VerificationSession.id == sess_id).first()
