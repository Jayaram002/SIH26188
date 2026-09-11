from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.password import verify_password
from app.security.jwt import create_access_token
from app.security.deps import get_current_user
from app.models.user import User
from app.schemas.auth import Token, UserResponse
from app.audit.logger import AuditLogger
from app.models.audit import AuditAction
from datetime import datetime

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.officer_id == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": user.officer_id})
    AuditLogger.log(db, AuditAction.OFFICER_LOGIN, "SUCCESS", officer_id=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "officer_id": user.officer_id,
            "full_name": user.full_name,
            "role": user.role,
            "terminal": user.terminal,
            "shift": user.shift
        }
    }

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    AuditLogger.log(db, AuditAction.OFFICER_LOGOUT, "SUCCESS", officer_id=current_user.id)
    return {"message": "Successfully logged out"}
