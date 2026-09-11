from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Date, ForeignKey
from app.database.engine import Base
from app.models.user import UUID

class Passenger(Base):
    __tablename__ = "passengers"
    id = Column(UUID, primary_key=True, default=uuid4)
    passenger_id = Column(String(20), unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    full_name = Column(String(200))
    nationality = Column(String(3))
    nationality_full = Column(String(100))
    date_of_birth = Column(Date)
    gender = Column(String(1))
    passport_number_hash = Column(String(255))
    passport_number_masked = Column(String(20))
    passport_expiry = Column(Date)
    biometric_enrolled = Column(Boolean, default=True)
    risk_profile = Column(String(20), default="LOW")
    watchlist_status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TravelRecord(Base):
    __tablename__ = "travel_records"
    id = Column(UUID, primary_key=True, default=uuid4)
    passenger_id = Column(UUID, ForeignKey("passengers.id"))
    flight_number = Column(String(10))
    airline = Column(String(100))
    origin = Column(String(5))
    destination = Column(String(5))
    terminal = Column(String(5))
    gate = Column(String(5))
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    visa_number_hash = Column(String(255))
    visa_type = Column(String(50))
    visa_expiry = Column(Date)
    visa_valid = Column(Boolean)
    travel_date = Column(Date)
    status = Column(String(20))
