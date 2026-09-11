from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.models.review import ManualReview, ReviewStatus
from app.schemas.review import ManualReviewResponse, ManualReviewCreate, ManualReviewUpdate
from app.audit.logger import AuditLogger
from app.models.audit import AuditAction
import uuid
import datetime

router = APIRouter()

@router.get("", response_model=list[ManualReviewResponse])
def get_reviews(status: str = "", risk_level: str = "", page: int = 1, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(ManualReview).limit(20).all()

@router.post("", response_model=ManualReviewResponse)
def create_review(req: ManualReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    rev = ManualReview(
        case_id=f"CASE-{datetime.datetime.utcnow().year}-T2-{uuid.uuid4().hex[:6].upper()}",
        verification_session_id=req.verification_session_id,
        reason=req.reason,
        status=ReviewStatus.PENDING,
        risk_score=50,
        red_flag_types=[]
    )
    db.add(rev)
    db.commit()
    db.refresh(rev)
    AuditLogger.log(db, AuditAction.REVIEW_ASSIGNED, "CREATED", officer_id=current_user.id, session_id=req.verification_session_id)
    return rev

@router.get("/{review_id}", response_model=ManualReviewResponse)
def get_review(review_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    rev = db.query(ManualReview).filter(ManualReview.id == uuid.UUID(review_id)).first()
    if not rev:
        raise HTTPException(status_code=404)
    return rev

@router.put("/{review_id}", response_model=ManualReviewResponse)
def update_review(review_id: str, req: ManualReviewUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    rev = db.query(ManualReview).filter(ManualReview.id == uuid.UUID(review_id)).first()
    if req.status: rev.status = req.status
    if req.notes: rev.notes = req.notes
    if req.decision: rev.decision = req.decision
    if req.justification: rev.justification = req.justification
    if req.status in [ReviewStatus.APPROVED, ReviewStatus.REJECTED]:
        rev.resolved_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(rev)
    return rev
