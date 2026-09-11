from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://aeroshield:aeroshield@localhost:5432/aeroshield_db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hour shift
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10_000_000  # 10MB
    DEMO_MODE: bool = True
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    ENVIRONMENT: str = "development"

    SUPABASE_URL: str = "https://mpbeozinrofbpgyhjpub.supabase.co"
    SUPABASE_PUBLISHABLE_KEY: str = "sb_publishable_5Gl6wKELLD68W2m4HSN__Q_w_z8snth"
    SUPABASE_SECRET_KEY: str = ""
    SUPABASE_JWKS_URL: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
