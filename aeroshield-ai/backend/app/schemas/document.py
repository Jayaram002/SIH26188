from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.document import DocumentType

class DocumentResponse(BaseModel):
    id: UUID
    document_type: DocumentType
    file_path: str
    file_size: int
    mime_type: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True
