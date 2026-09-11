from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class PassengerBase(BaseModel):
    passenger_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    nationality: Optional[str] = None
    nationality_full: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    passport_number_masked: Optional[str] = None
    passport_expiry: Optional[date] = None
    biometric_enrolled: bool = True
    risk_profile: str = "LOW"
    watchlist_status: bool = False

class PassengerCreate(PassengerBase):
    passport_number: Optional[str] = None

class PassengerResponse(PassengerBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class TravelRecordResponse(BaseModel):
    id: UUID
    flight_number: Optional[str] = None
    airline: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    terminal: Optional[str] = None
    gate: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    visa_type: Optional[str] = None
    visa_expiry: Optional[date] = None
    visa_valid: Optional[bool] = None
    travel_date: Optional[date] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True
