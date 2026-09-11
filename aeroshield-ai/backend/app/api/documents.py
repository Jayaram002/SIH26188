from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.engine import get_db
from app.security.deps import get_current_active_user
from app.models.user import User
from app.models.document import IdentityDocument, DocumentType
from app.models.verification import OCRResult, VerificationSession
from app.schemas.document import DocumentResponse
from app.audit.logger import AuditLogger
from app.models.audit import AuditAction
from app.ai.demo.demo_ocr import DemoOCRService
from app.ai.demo.demo_forensics import DemoForensicsService
import shutil
import os
import uuid

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), document_type: str = "PASSPORT", verification_session_id: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{uuid.uuid4()}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    doc = IdentityDocument(
        document_type=DocumentType(document_type),
        file_path=file_path,
        file_size=os.path.getsize(file_path),
        mime_type=file.content_type,
        uploaded_by=current_user.id
    )
    if verification_session_id:
        doc.verification_session_id = uuid.UUID(verification_session_id)
        
    db.add(doc)
    db.commit()
    db.refresh(doc)
    AuditLogger.log(db, AuditAction.DOCUMENT_UPLOAD, "SUCCESS", officer_id=current_user.id, session_id=doc.verification_session_id)
    return doc

@router.post("/{document_id}/ocr")
async def perform_ocr(document_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    doc = db.query(IdentityDocument).filter(IdentityDocument.id == uuid.UUID(document_id)).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    sess = None
    scenario = 1
    if doc.verification_session_id:
        sess = db.query(VerificationSession).filter(VerificationSession.id == doc.verification_session_id).first()
        if sess and sess.demo_scenario:
            scenario = sess.demo_scenario

    ocr_service = DemoOCRService()
    res = await ocr_service.extract(doc.file_path, doc.document_type.value, scenario)
    
    ocr_res = OCRResult(
        verification_session_id=doc.verification_session_id,
        document_id=doc.id,
        document_type=doc.document_type.value,
        ocr_confidence=res.confidence,
        mrz_detected=res.mrz_detected,
        extracted_name=res.name,
        extracted_doc_number_masked=res.doc_number_masked,
        extracted_nationality=res.nationality,
        extracted_gender=res.gender,
        extracted_mrz_line1=res.mrz_line1,
        extracted_mrz_line2=res.mrz_line2,
        processing_time_ms=res.processing_time_ms,
        service_used=res.service_name
    )
    db.add(ocr_res)
    db.commit()
    db.refresh(ocr_res)
    AuditLogger.log(db, AuditAction.OCR_PERFORMED, "SUCCESS", officer_id=current_user.id, session_id=doc.verification_session_id)
    return ocr_res

@router.post("/{document_id}/validate")
async def validate_document(document_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    AuditLogger.log(db, AuditAction.DOCUMENT_VALIDATION, "SUCCESS", officer_id=current_user.id)
    return {"status": "validated"}

@router.post("/{document_id}/forensics")
async def document_forensics(document_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    doc = db.query(IdentityDocument).filter(IdentityDocument.id == uuid.UUID(document_id)).first()
    if not doc:
        raise HTTPException(status_code=404)
        
    sess = None
    scenario = 1
    if doc.verification_session_id:
        sess = db.query(VerificationSession).filter(VerificationSession.id == doc.verification_session_id).first()
        if sess and sess.demo_scenario:
            scenario = sess.demo_scenario

    fs = DemoForensicsService()
    res = await fs.analyze(doc.file_path, doc.document_type.value, scenario)
    
    from app.models.biometric import ForensicAnalysis
    fa = ForensicAnalysis(
        verification_session_id=doc.verification_session_id,
        document_id=doc.id,
        photo_region_risk=res.photo_region_risk,
        text_region_risk=res.text_region_risk,
        stamp_region_risk=res.stamp_region_risk,
        metadata_anomaly=res.metadata_anomaly,
        compression_anomaly=res.compression_anomaly,
        manipulation_detected=res.manipulation_detected,
        overall_risk=res.overall_risk,
        suspicious_regions=res.suspicious_regions,
        metadata_details=res.metadata_details,
        processing_time_ms=res.processing_time_ms,
        service_used=res.service_name
    )
    db.add(fa)
    db.commit()
    db.refresh(fa)
    AuditLogger.log(db, AuditAction.FORENSIC_ANALYSIS, "SUCCESS", officer_id=current_user.id, session_id=doc.verification_session_id)
    return fa
