from sqlalchemy.orm import Session
from app.models.passenger import Passenger

class PassengerService:
    def __init__(self, db: Session):
        self.db = db
        
    def get_passenger(self, pid: str) -> Passenger | None:
        return self.db.query(Passenger).filter(Passenger.passenger_id == pid).first()
