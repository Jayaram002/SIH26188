import hashlib
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        else:
            return hashlib.sha256(plain_password.encode('utf-8')).hexdigest() == hashed_password
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    try:
        # Truncate to 72 bytes max for bcrypt standards
        pwd_bytes = password.encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
    except Exception:
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
