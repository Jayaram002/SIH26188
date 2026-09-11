from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.models.risk import RedFlagType

class RedFlagResponse(BaseModel):
    id: UUID
    flag_type: RedFlagType
    severity: str
    confidence: float
    description: str
    
    class Config:
        from_attributes = True

class RiskAssessmentResponse(BaseModel):
    id: UUID
    overall_risk_score: int
    risk_status: str
    explanation: list[str]
    recommendation: str
    created_at: datetime
    
    class Config:
        from_attributes = True
