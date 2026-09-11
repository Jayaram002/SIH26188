from pydantic import BaseModel

class DashboardStatistics(BaseModel):
    total_verifications: int
    verified_count: int
    review_required_count: int
    high_risk_count: int
    avg_processing_time: float
