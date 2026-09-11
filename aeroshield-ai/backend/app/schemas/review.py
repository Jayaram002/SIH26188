from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.review import ReviewStatus

class ManualReviewCreate(BaseModel):
    verification_session_id: UUID
    reason: str

class ManualReviewUpdate(BaseModel):
    status: Optional[ReviewStatus] = None
    notes: Optional[str] = None
    decision: Optional[str] = None
    justification: Optional[str] = None

class ManualReviewResponse(BaseModel):
    id: UUID
    case_id: str
    verification_session_id: UUID
    risk_score: Optional[int] = None
    reason: Optional[str] = None
    status: ReviewStatus
    notes: Optional[str] = None
    decision: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
