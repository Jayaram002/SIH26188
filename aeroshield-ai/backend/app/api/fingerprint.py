from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.schemas.biometric import BiometricVerifyRequest
from app.models.biometric import FingerprintVerification
from app.models.verification import VerificationSession
from app.audit.logger import AuditLogger
from app.models.audit import AuditAction
from app.ai.demo.demo_fingerprint import DemoFingerprintService

router = APIRouter()

@router.post("/verify")
async def verify_fingerprint(req: BiometricVerifyRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    sess = db.query(VerificationSession).filter(VerificationSession.id == req.verification_session_id).first()
    scenario = req.scenario or (sess.demo_scenario if sess else 1)
    
    fs = DemoFingerprintService()
    res = await fs.verify("ref_id", "sample.jpg", scenario)
    
    fv = FingerprintVerification(
        verification_session_id=req.verification_session_id,
        similarity_score=res.similarity_score,
        quality_score=res.quality_score,
        pad_result=res.pad_result,
        match_result=res.match_result,
        finger_detected=True,
        processing_time_ms=res.processing_time_ms,
        service_used=res.service_name
    )
    db.add(fv)
    db.commit()
    db.refresh(fv)
    
    AuditLogger.log(db, AuditAction.FINGERPRINT_VERIFICATION, res.match_result, officer_id=current_user.id, session_id=req.verification_session_id)
    return fv
