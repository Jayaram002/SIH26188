from sqlalchemy.orm import Session
from app.models.user import User

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_officer_id(self, officer_id: str) -> User | None:
        return self.db.query(User).filter(User.officer_id == officer_id).first()
