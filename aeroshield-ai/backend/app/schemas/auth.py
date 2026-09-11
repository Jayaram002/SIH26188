from pydantic import BaseModel
from uuid import UUID
from app.models.user import UserRole

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    officer_id: str | None = None

class UserBase(BaseModel):
    officer_id: str
    email: str | None = None
    full_name: str
    role: UserRole
    terminal: str = "T2"
    shift: str = "Day Shift"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True
