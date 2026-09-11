from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.models.verification import VerificationSession
from app.schemas.dashboard import DashboardStatistics

router = APIRouter()

@router.get("/statistics", response_model=DashboardStatistics)
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    total = db.query(VerificationSession).count()
    verified = db.query(VerificationSession).filter(VerificationSession.status == "VERIFIED").count()
    review = db.query(VerificationSession).filter(VerificationSession.status == "REVIEW_REQUIRED").count()
    high_risk = db.query(VerificationSession).filter(VerificationSession.status == "HIGH_RISK").count()
    
    return DashboardStatistics(
        total_verifications=total,
        verified_count=verified,
        review_required_count=review,
        high_risk_count=high_risk,
        avg_processing_time=4.5
    )

@router.get("/live-feed")
def live_feed(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    sessions = db.query(VerificationSession).order_by(VerificationSession.started_at.desc()).limit(20).all()
    return sessions
