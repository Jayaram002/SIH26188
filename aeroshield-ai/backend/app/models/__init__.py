from app.models.user import User, UserRole
from app.models.passenger import Passenger, TravelRecord
from app.models.document import IdentityDocument, DocumentType
from app.models.verification import VerificationSession, OCRResult, DocumentValidation, VerificationStatus
from app.models.biometric import ForensicAnalysis, FaceVerification, FingerprintVerification, IrisVerification, MatchResult, PADResult
from app.models.risk import RiskAssessment, RedFlag, RedFlagType
from app.models.review import ManualReview, ReviewStatus
from app.models.audit import AuditLog, AuditAction
from app.models.settings import SystemSetting
