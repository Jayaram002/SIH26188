from fastapi import APIRouter
from app.api import auth, passengers, documents, face, fingerprint, iris, verification, reviews, dashboard, audit, system, settings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(passengers.router, prefix="/passengers", tags=["passengers"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(face.router, prefix="/face", tags=["face"])
api_router.include_router(fingerprint.router, prefix="/fingerprint", tags=["fingerprint"])
api_router.include_router(iris.router, prefix="/iris", tags=["iris"])
api_router.include_router(verification.router, prefix="/verification", tags=["verification"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(audit.router, prefix="/audit-logs", tags=["audit"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
