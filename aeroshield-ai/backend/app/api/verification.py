from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.schemas.verification import VerificationStartRequest, VerificationSessionResponse
from app.models.verification import VerificationSession, VerificationStatus
from app.models.risk import RiskAssessment
from app.audit.logger import AuditLogger
from app.models.audit import AuditAction
from app.risk.engine import calculate_risk
from app.ai.demo import DEMO_SCENARIOS
import uuid
import datetime

router = APIRouter()

@router.post("/start", response_model=VerificationSessionResponse)
def start_verification(req: VerificationStartRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    vid = f"VER-{datetime.datetime.utcnow().year}-{req.terminal}-{uuid.uuid4().hex[:6].upper()}"
    sess = VerificationSession(
        verification_id=vid,
        passenger_id=req.passenger_id,
        officer_id=current_user.id,
        terminal=req.terminal,
        checkpoint=req.checkpoint,
        demo_scenario=req.demo_scenario or 1
    )
    db.add(sess)
    db.commit()
    db.refresh(sess)
    AuditLogger.log(db, AuditAction.SESSION_STARTED, "SUCCESS", officer_id=current_user.id, session_id=sess.id)
    return sess

@router.get("/{session_id}", response_model=VerificationSessionResponse)
def get_session(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    sess = db.query(VerificationSession).filter(VerificationSession.id == uuid.UUID(session_id)).first()
    if not sess:
        raise HTTPException(status_code=404)
    return sess

@router.post("/{session_id}/risk")
def calculate_session_risk(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    sess = db.query(VerificationSession).filter(VerificationSession.id == uuid.UUID(session_id)).first()
    if not sess:
        raise HTTPException(status_code=404)
        
    s_idx = sess.demo_scenario or 1
    signals = DEMO_SCENARIOS.get(s_idx, DEMO_SCENARIOS[1])
    
    risk_res = calculate_risk(signals)
    
    ra = RiskAssessment(
        verification_session_id=sess.id,
        identity_confidence=95.0,
        document_integrity_score=90.0,
        biometric_confidence=92.0,
        overall_risk_score=risk_res["overall_risk_score"],
        risk_status=risk_res["risk_status"],
        explanation=risk_res["explanation"],
        recommendation=risk_res["recommendation"],
        weights_used={},
        signals_used={}
    )
    db.add(ra)
    
    sess.status = VerificationStatus(risk_res["risk_status"])
    if sess.status in [VerificationStatus.VERIFIED, VerificationStatus.LOW_RISK]:
        sess.completed_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(ra)
    AuditLogger.log(db, AuditAction.RISK_CALCULATED, risk_res["risk_status"], officer_id=current_user.id, session_id=sess.id)
    return ra

@router.post("/{session_id}/decision")
def finalize_decision(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    sess = db.query(VerificationSession).filter(VerificationSession.id == uuid.UUID(session_id)).first()
    sess.status = VerificationStatus.VERIFIED
    sess.completed_at = datetime.datetime.utcnow()
    db.commit()
    AuditLogger.log(db, AuditAction.FINAL_DECISION, "VERIFIED", officer_id=current_user.id, session_id=sess.id)
    return {"status": "success"}
