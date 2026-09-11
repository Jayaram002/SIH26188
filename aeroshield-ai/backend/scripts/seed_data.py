"""
AeroShield AI - Database Seed Script
Creates demo officers, passengers, and verification history.
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from sqlalchemy.orm import Session
from app.database.engine import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.settings import SystemSetting
from app.models.passenger import Passenger, TravelRecord
from app.models.verification import VerificationSession, VerificationStatus, OCRResult, DocumentValidation
from app.models.biometric import FaceVerification, FingerprintVerification, IrisVerification, ForensicAnalysis, MatchResult, PADResult
from app.models.risk import RiskAssessment, RedFlag, RedFlagType
from app.security.password import get_password_hash
import random
import datetime
import uuid


PASSENGER_DATA = [
    {"id": "AV-IND-000123", "first": "RAJESH", "last": "SHARMA", "full": "RAJESH KUMAR SHARMA", "nat": "IND", "nat_full": "India", "dob": "1990-03-15", "gender": "M", "passport": "****K5821", "expiry": "2031-03-14", "flight": "AX 204", "terminal": "T2", "gate": "G18", "risk": "LOW"},
    {"id": "AV-GBR-000458", "first": "JAMES", "last": "MORRISON", "full": "JAMES ALEXANDER MORRISON", "nat": "GBR", "nat_full": "United Kingdom", "dob": "1985-07-22", "gender": "M", "passport": "****M2341", "expiry": "2029-07-21", "flight": "BA 112", "terminal": "T2", "gate": "G04", "risk": "MEDIUM"},
    {"id": "AV-USA-000891", "first": "MICHAEL", "last": "CHEN", "full": "MICHAEL DAVID CHEN", "nat": "USA", "nat_full": "United States of America", "dob": "1992-11-08", "gender": "M", "passport": "****C7012", "expiry": "2030-11-07", "flight": "UA 505", "terminal": "T2", "gate": "G22", "risk": "HIGH"},
    {"id": "AV-CHN-001204", "first": "LI", "last": "MING", "full": "LI XIAO MING", "nat": "CHN", "nat_full": "China", "dob": "1988-05-30", "gender": "M", "passport": "****X3311", "expiry": "2028-05-29", "flight": "CA 836", "terminal": "T2", "gate": "G31", "risk": "MEDIUM"},
    {"id": "AV-UAE-000312", "first": "AISHA", "last": "HASSAN", "full": "AISHA IBRAHIM HASSAN", "nat": "UAE", "nat_full": "United Arab Emirates", "dob": "1994-02-14", "gender": "F", "passport": "****H4421", "expiry": "2032-02-13", "flight": "EK 511", "terminal": "T2", "gate": "G08", "risk": "LOW"},
    {"id": "AV-MEX-000567", "first": "CARLOS", "last": "GARCIA", "full": "CARLOS MENDEZ GARCIA", "nat": "MEX", "nat_full": "Mexico", "dob": "1987-09-03", "gender": "M", "passport": "****G7891", "expiry": "2027-09-02", "flight": "AM 112", "terminal": "T2", "gate": "G15", "risk": "LOW"},
    {"id": "AV-JPN-000234", "first": "YUKI", "last": "TANAKA", "full": "YUKI TANAKA", "nat": "JPN", "nat_full": "Japan", "dob": "1995-06-20", "gender": "F", "passport": "****T3301", "expiry": "2033-06-19", "flight": "NH 802", "terminal": "T2", "gate": "G25", "risk": "LOW"},
    {"id": "AV-FRA-000678", "first": "PIERRE", "last": "DUBOIS", "full": "PIERRE MARTIN DUBOIS", "nat": "FRA", "nat_full": "France", "dob": "1983-11-12", "gender": "M", "passport": "****D5512", "expiry": "2030-11-11", "flight": "AF 225", "terminal": "T2", "gate": "G09", "risk": "LOW"},
    {"id": "AV-AUS-000789", "first": "EMMA", "last": "WILLIAMS", "full": "EMMA GRACE WILLIAMS", "nat": "AUS", "nat_full": "Australia", "dob": "1991-04-07", "gender": "F", "passport": "****W9921", "expiry": "2031-04-06", "flight": "QF 001", "terminal": "T2", "gate": "G33", "risk": "LOW"},
    {"id": "AV-CAN-000345", "first": "LIAM", "last": "ANDERSON", "full": "LIAM JAMES ANDERSON", "nat": "CAN", "nat_full": "Canada", "dob": "1989-08-19", "gender": "M", "passport": "****A4412", "expiry": "2029-08-18", "flight": "AC 072", "terminal": "T2", "gate": "G11", "risk": "LOW"},
    {"id": "AV-DEU-000234", "first": "HANS", "last": "MUELLER", "full": "HANS PETER MUELLER", "nat": "DEU", "nat_full": "Germany", "dob": "1979-12-03", "gender": "M", "passport": "****M8821", "expiry": "2028-12-02", "flight": "LH 755", "terminal": "T2", "gate": "G17", "risk": "LOW"},
    {"id": "AV-ITA-000456", "first": "SOFIA", "last": "ROSSI", "full": "SOFIA MARIA ROSSI", "nat": "ITA", "nat_full": "Italy", "dob": "1997-03-25", "gender": "F", "passport": "****R3312", "expiry": "2033-03-24", "flight": "AZ 744", "terminal": "T2", "gate": "G20", "risk": "LOW"},
    {"id": "AV-BRA-000567", "first": "GABRIEL", "last": "SILVA", "full": "GABRIEL SANTOS SILVA", "nat": "BRA", "nat_full": "Brazil", "dob": "1993-07-14", "gender": "M", "passport": "****S5561", "expiry": "2030-07-13", "flight": "LA 803", "terminal": "T2", "gate": "G29", "risk": "LOW"},
    {"id": "AV-SGP-000678", "first": "WEI", "last": "TAN", "full": "TAN WEI LING", "nat": "SGP", "nat_full": "Singapore", "dob": "1996-11-30", "gender": "F", "passport": "****T7712", "expiry": "2032-11-29", "flight": "SQ 007", "terminal": "T2", "gate": "G35", "risk": "LOW"},
    {"id": "AV-ZAF-000789", "first": "SIPHO", "last": "DLAMINI", "full": "SIPHO MICHAEL DLAMINI", "nat": "ZAF", "nat_full": "South Africa", "dob": "1984-05-08", "gender": "M", "passport": "****D9921", "expiry": "2028-05-07", "flight": "SA 236", "terminal": "T2", "gate": "G13", "risk": "LOW"},
    {"id": "AV-RUS-000890", "first": "IVAN", "last": "PETROV", "full": "IVAN NIKOLAEVICH PETROV", "nat": "RUS", "nat_full": "Russia", "dob": "1981-09-22", "gender": "M", "passport": "****P1121", "expiry": "2027-09-21", "flight": "SU 212", "terminal": "T2", "gate": "G06", "risk": "MEDIUM"},
    {"id": "AV-KOR-000234", "first": "MINJUN", "last": "KIM", "full": "KIM MINJUN", "nat": "KOR", "nat_full": "South Korea", "dob": "1998-02-18", "gender": "M", "passport": "****K2231", "expiry": "2034-02-17", "flight": "KE 001", "terminal": "T2", "gate": "G27", "risk": "LOW"},
    {"id": "AV-TUR-000345", "first": "AYSE", "last": "YILMAZ", "full": "AYSE FATIMA YILMAZ", "nat": "TUR", "nat_full": "Turkey", "dob": "1986-06-11", "gender": "F", "passport": "****Y5541", "expiry": "2029-06-10", "flight": "TK 789", "terminal": "T2", "gate": "G19", "risk": "LOW"},
    {"id": "AV-NGA-000456", "first": "CHIDI", "last": "OKONKWO", "full": "CHIDI EMEKA OKONKWO", "nat": "NGA", "nat_full": "Nigeria", "dob": "1990-10-05", "gender": "M", "passport": "****O3321", "expiry": "2028-10-04", "flight": "DL 142", "terminal": "T2", "gate": "G23", "risk": "LOW"},
    {"id": "AV-ARG-000567", "first": "LUCIA", "last": "FERNANDEZ", "full": "LUCIA VALENTINA FERNANDEZ", "nat": "ARG", "nat_full": "Argentina", "dob": "1994-01-27", "gender": "F", "passport": "****F6612", "expiry": "2031-01-26", "flight": "AR 1320", "terminal": "T2", "gate": "G07", "risk": "LOW"},
    {"id": "AV-SAU-000678", "first": "KHALID", "last": "ALFARSI", "full": "KHALID AHMED ALFARSI", "nat": "SAU", "nat_full": "Saudi Arabia", "dob": "1982-08-14", "gender": "M", "passport": "****A8812", "expiry": "2027-08-13", "flight": "SV 854", "terminal": "T2", "gate": "G36", "risk": "LOW"},
    {"id": "AV-EGY-000789", "first": "NOUR", "last": "HASSAN", "full": "NOUR IBRAHIM HASSAN", "nat": "EGY", "nat_full": "Egypt", "dob": "1993-04-02", "gender": "F", "passport": "****H7712", "expiry": "2030-04-01", "flight": "MS 667", "terminal": "T2", "gate": "G14", "risk": "LOW"},
    {"id": "AV-THA-000890", "first": "SOMCHAI", "last": "WONGKUL", "full": "SOMCHAI WONGKUL", "nat": "THA", "nat_full": "Thailand", "dob": "1988-12-20", "gender": "M", "passport": "****W4421", "expiry": "2028-12-19", "flight": "TG 312", "terminal": "T2", "gate": "G28", "risk": "LOW"},
    {"id": "AV-SWE-000123", "first": "ASTRID", "last": "LINDQVIST", "full": "ASTRID MARIA LINDQVIST", "nat": "SWE", "nat_full": "Sweden", "dob": "1991-07-08", "gender": "F", "passport": "****L5531", "expiry": "2032-07-07", "flight": "SK 801", "terminal": "T2", "gate": "G10", "risk": "LOW"},
    {"id": "AV-IND-000999", "first": "PRIYA", "last": "NAIR", "full": "PRIYA SURESH NAIR", "nat": "IND", "nat_full": "India", "dob": "1996-09-15", "gender": "F", "passport": "****N1121", "expiry": "2034-09-14", "flight": "AI 140", "terminal": "T2", "gate": "G16", "risk": "LOW"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).count() > 0:
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("🌱 Seeding AeroShield AI database...")

    # === OFFICERS ===
    print("  📋 Creating officers...")
    pwd = get_password_hash("AeroShield@2026")
    officers = [
        User(officer_id="ADMIN001", full_name="Commander Sarah Mitchell", email="admin@aeroshield.ai", hashed_password=pwd, role=UserRole.ADMIN, terminal="T2", shift="Day Shift"),
        User(officer_id="IMM001", full_name="Officer James Patel", email="imm@aeroshield.ai", hashed_password=pwd, role=UserRole.IMMIGRATION_OFFICER, terminal="T2", shift="Day Shift"),
        User(officer_id="SEC001", full_name="Officer Priya Nair", email="sec@aeroshield.ai", hashed_password=pwd, role=UserRole.SECURITY_OFFICER, terminal="T2", shift="Day Shift"),
        User(officer_id="AUD001", full_name="Auditor Rahul Verma", email="aud@aeroshield.ai", hashed_password=pwd, role=UserRole.AUDITOR, terminal="T2", shift="Day Shift"),
    ]
    db.add_all(officers)
    db.commit()
    db.refresh(officers[1])  # IMM001

    # === SYSTEM SETTINGS ===
    print("  ⚙️  Seeding system settings...")
    settings_list = [
        SystemSetting(key="face_similarity_threshold", value="0.80", category="BIOMETRIC", description="Minimum face similarity score to pass verification"),
        SystemSetting(key="fingerprint_threshold", value="0.85", category="BIOMETRIC", description="Minimum fingerprint match score"),
        SystemSetting(key="iris_threshold", value="0.85", category="BIOMETRIC", description="Minimum iris match score"),
        SystemSetting(key="ocr_confidence_threshold", value="0.75", category="DOCUMENT", description="Minimum OCR confidence to accept extraction"),
        SystemSetting(key="risk_review_threshold", value="30", category="RISK", description="Risk score above which manual review is triggered"),
        SystemSetting(key="risk_high_threshold", value="70", category="RISK", description="Risk score above which HIGH RISK is flagged"),
        SystemSetting(key="document_expiry_days_warning", value="30", category="DOCUMENT", description="Days before document expiry to show warning"),
        SystemSetting(key="session_timeout_minutes", value="480", category="SESSION", description="Officer session timeout in minutes (8 hours)"),
    ]
    db.add_all(settings_list)
    db.commit()

    # === PASSENGERS ===
    print("  👤 Creating 25 passengers...")
    passenger_map = {}
    for pd in PASSENGER_DATA:
        dob = datetime.date.fromisoformat(pd["dob"])
        expiry = datetime.date.fromisoformat(pd["expiry"])
        p = Passenger(
            passenger_id=pd["id"],
            first_name=pd["first"],
            last_name=pd["last"],
            full_name=pd["full"],
            nationality=pd["nat"],
            nationality_full=pd["nat_full"],
            date_of_birth=dob,
            gender=pd["gender"],
            passport_number_masked=pd["passport"],
            passport_expiry=expiry,
            biometric_enrolled=True,
            risk_profile=pd["risk"],
            watchlist_status=False,
        )
        db.add(p)
        db.flush()
        passenger_map[pd["id"]] = p

        # Travel record
        tr = TravelRecord(
            passenger_id=p.id,
            flight_number=pd["flight"],
            airline=pd["flight"].split()[0] if " " in pd["flight"] else pd["flight"],
            origin="DEL",
            destination="DXB",
            terminal=pd["terminal"],
            gate=pd["gate"],
            departure_time=datetime.datetime.now() + datetime.timedelta(hours=random.randint(1, 8)),
            arrival_time=datetime.datetime.now() + datetime.timedelta(hours=random.randint(9, 16)),
            visa_type="Tourist" if random.random() > 0.3 else "Business",
            visa_valid=pd["risk"] != "HIGH",
            visa_expiry=(datetime.date.today() - datetime.timedelta(days=26)) if pd["id"] == "AV-CHN-001204" else (datetime.date.today() + datetime.timedelta(days=365)),
            travel_date=datetime.date.today(),
            status="CHECKED_IN",
        )
        db.add(tr)

    db.commit()

    # === VERIFICATION HISTORY (100 records for dashboard stats) ===
    print("  📊 Creating verification history (100 records)...")
    status_weights = [
        (VerificationStatus.VERIFIED, 75),
        (VerificationStatus.LOW_RISK, 10),
        (VerificationStatus.REVIEW_REQUIRED, 10),
        (VerificationStatus.HIGH_RISK, 5),
    ]

    passenger_ids = [p.id for p in passenger_map.values()]
    officer_id = officers[1].id

    ver_counter = 1
    for i in range(100):
        p_id = random.choice(passenger_ids)
        # Weighted random status
        r = random.randint(1, 100)
        if r <= 75:
            status = VerificationStatus.VERIFIED
            risk_score = random.randint(2, 14)
        elif r <= 85:
            status = VerificationStatus.LOW_RISK
            risk_score = random.randint(15, 29)
        elif r <= 95:
            status = VerificationStatus.REVIEW_REQUIRED
            risk_score = random.randint(30, 69)
        else:
            status = VerificationStatus.HIGH_RISK
            risk_score = random.randint(70, 95)

        started = datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(0, 8), minutes=random.randint(0, 59))

        session = VerificationSession(
            verification_id=f"VER-2026-T2-{str(ver_counter).zfill(6)}",
            passenger_id=p_id,
            officer_id=officer_id,
            terminal="T2",
            checkpoint=random.choice(["CHECKPOINT A", "CHECKPOINT B", "IMMIGRATION"]),
            current_step=8,
            status=status,
            started_at=started,
            completed_at=started + datetime.timedelta(seconds=random.randint(5, 15)),
        )
        db.add(session)
        db.flush()

        # Risk assessment
        ra = RiskAssessment(
            verification_session_id=session.id,
            identity_confidence=round(random.uniform(60, 99) if status != VerificationStatus.HIGH_RISK else random.uniform(20, 50), 1),
            document_integrity_score=round(random.uniform(60, 99), 1),
            biometric_confidence=round(random.uniform(70, 99), 1),
            overall_risk_score=risk_score,
            risk_status=status.value,
            explanation=["Demo historical record"],
            recommendation="Historical verification record",
        )
        db.add(ra)
        ver_counter += 1

    db.commit()

    print("✅ Seeding complete!")
    print("   Officers: 4")
    print("   Passengers: 25")
    print("   Verification history: 100 records")
    print()
    print("Demo credentials:")
    print("   ADMIN001 / AeroShield@2026")
    print("   IMM001   / AeroShield@2026")
    print("   SEC001   / AeroShield@2026")
    print("   AUD001   / AeroShield@2026")

    db.close()


if __name__ == "__main__":
    seed()
