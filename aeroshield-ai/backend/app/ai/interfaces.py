from abc import ABC, abstractmethod
from typing import Any, List
from pydantic import BaseModel

class OCRResultData(BaseModel):
    confidence: float
    mrz_detected: bool
    name: str
    doc_number_masked: str
    nationality: str
    dob: str
    expiry: str
    gender: str
    mrz_line1: str = ""
    mrz_line2: str = ""
    processing_time_ms: int
    service_name: str
    
class OCRService(ABC):
    @abstractmethod
    async def extract(self, file_path: str, document_type: str, scenario: int = 1) -> OCRResultData:
        pass
    
class ForensicResultData(BaseModel):
    photo_region_risk: str
    text_region_risk: str
    stamp_region_risk: str
    metadata_anomaly: bool
    compression_anomaly: bool
    manipulation_detected: bool
    overall_risk: str
    suspicious_regions: list[dict]
    metadata_details: dict
    processing_time_ms: int
    service_name: str

class ForensicsService(ABC):
    @abstractmethod
    async def analyze(self, file_path: str, document_type: str, scenario: int = 1) -> ForensicResultData:
        pass

class BiometricMatchResultData(BaseModel):
    similarity_score: float
    quality_score: float
    pad_result: str
    match_result: str
    processing_time_ms: int
    service_name: str

class FaceService(ABC):
    @abstractmethod
    async def verify(self, reference_path: str, live_image_path: str, scenario: int = 1) -> BiometricMatchResultData:
        pass
    @abstractmethod
    async def check_liveness(self, image_path: str, scenario: int = 1) -> dict:
        pass

class FingerprintService(ABC):
    @abstractmethod
    async def verify(self, reference_template_id: str, sample_path: str, scenario: int = 1) -> BiometricMatchResultData:
        pass
    @abstractmethod
    async def check_pad(self, sample_path: str, scenario: int = 1) -> dict:
        pass

class IrisService(ABC):
    @abstractmethod
    async def verify(self, reference_template_id: str, left_path: str, right_path: str, scenario: int = 1) -> BiometricMatchResultData:
        pass
    @abstractmethod
    async def check_pad(self, image_path: str, scenario: int = 1) -> dict:
        pass
