from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.models.passenger import Passenger, TravelRecord
from app.schemas.passenger import PassengerResponse, PassengerCreate, TravelRecordResponse
from app.security.deps import get_current_active_user
from app.models.user import User
from typing import List
from app.audit.logger import AuditLogger
from app.models.audit import AuditAction
import uuid

router = APIRouter()

@router.get("", response_model=List[PassengerResponse])
def get_passengers(search: str = "", page: int = 1, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    query = db.query(Passenger)
    if search:
        query = query.filter(Passenger.passenger_id.ilike(f"%{search}%") | Passenger.full_name.ilike(f"%{search}%"))
    passengers = query.offset((page - 1) * limit).limit(limit).all()
    AuditLogger.log(db, AuditAction.PASSENGER_SEARCH, "SUCCESS", officer_id=current_user.id, details={"search": search})
    return passengers

@router.get("/{passenger_id}", response_model=PassengerResponse)
def get_passenger(passenger_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Try by string ID or UUID
    try:
        uid = uuid.UUID(passenger_id)
        passenger = db.query(Passenger).filter(Passenger.id == uid).first()
    except ValueError:
        passenger = db.query(Passenger).filter(Passenger.passenger_id == passenger_id).first()
        
    if not passenger:
        raise HTTPException(status_code=404, detail="Passenger not found")
    AuditLogger.log(db, AuditAction.PASSENGER_IDENTIFIED, "SUCCESS", officer_id=current_user.id, passenger_id=passenger.id)
    return passenger

@router.post("", response_model=PassengerResponse)
def create_passenger(passenger: PassengerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_passenger = Passenger(**passenger.dict(exclude={"passport_number"}))
    db.add(db_passenger)
    db.commit()
    db.refresh(db_passenger)
    return db_passenger

@router.get("/{passenger_id}/history")
def get_passenger_history(passenger_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    passenger = get_passenger(passenger_id, db, current_user)
    return []

@router.get("/{passenger_id}/travel", response_model=List[TravelRecordResponse])
def get_passenger_travel(passenger_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    passenger = get_passenger(passenger_id, db, current_user)
    records = db.query(TravelRecord).filter(TravelRecord.passenger_id == passenger.id).all()
    return records
