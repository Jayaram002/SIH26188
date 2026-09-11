from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.verification import VerificationStatus

class VerificationStartRequest(BaseModel):
    passenger_id: Optional[UUID] = None
    terminal: str = "T2"
    checkpoint: str = "Immigration"
    demo_scenario: Optional[int] = None

class VerificationSessionResponse(BaseModel):
    id: UUID
    verification_id: str
    status: VerificationStatus
    current_step: int
    started_at: datetime
    demo_scenario: Optional[int] = None
    
    class Config:
        from_attributes = True
