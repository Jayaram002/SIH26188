from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.models.settings import SystemSetting

router = APIRouter()

@router.get("")
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return db.query(SystemSetting).all()

@router.put("/{key}")
def update_setting(key: str, value: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if setting:
        setting.value = value
        db.commit()
        db.refresh(setting)
    return setting
