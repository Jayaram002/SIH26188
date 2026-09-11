from sqlalchemy.orm import Session
from app.models.document import IdentityDocument

class DocumentService:
    def __init__(self, db: Session):
        self.db = db

    def get_document(self, doc_id: str) -> IdentityDocument | None:
        return self.db.query(IdentityDocument).filter(IdentityDocument.id == doc_id).first()
