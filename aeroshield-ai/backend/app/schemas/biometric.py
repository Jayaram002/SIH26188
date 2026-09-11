from pydantic import BaseModel
from uuid import UUID

class BiometricVerifyRequest(BaseModel):
    verification_session_id: UUID
    scenario: int | None = None
