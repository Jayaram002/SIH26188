import enum
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from app.database.engine import Base
import uuid

# SQLite fallback for UUID
from sqlalchemy.types import TypeDecorator, CHAR
class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True
    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PGUUID())
        else:
            return dialect.type_descriptor(CHAR(32))
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                return "%.32x" % value.int
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value

UUID = GUID

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    IMMIGRATION_OFFICER = "IMMIGRATION_OFFICER" 
    SECURITY_OFFICER = "SECURITY_OFFICER"
    AUDITOR = "AUDITOR"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID, primary_key=True, default=uuid4)
    officer_id = Column(String(20), unique=True, nullable=False)
    email = Column(String(255), unique=True)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    terminal = Column(String(10), default="T2")
    shift = Column(String(20), default="Day Shift")
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
