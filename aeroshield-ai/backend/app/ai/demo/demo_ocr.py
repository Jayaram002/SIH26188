import asyncio
import random
from app.ai.interfaces import OCRService, OCRResultData
from app.ai.demo import DEMO_SCENARIOS

class DemoOCRService(OCRService):
    SERVICE_NAME = "DEMO_OCR"
    
    async def extract(self, file_path: str, document_type: str, scenario: int = 1) -> OCRResultData:
        await asyncio.sleep(random.uniform(0.5, 1.2))
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        base_conf = s["ocr_confidence"]
        
        return OCRResultData(
            confidence=base_conf + random.uniform(-0.02, 0.02),
            mrz_detected=s["mrz_ok"],
            name="DEMO NAME",
            doc_number_masked="****1234",
            nationality="USA",
            dob="1990-01-01",
            expiry="2030-01-01" if scenario != 4 else "2020-01-01",
            gender="M",
            mrz_line1="P<USADEMO<<NAME<<<<<<<<<<<<<<<<<<<<<<<<<<",
            mrz_line2="1234567890USA900101M300101<<<<<<<<<<<<<<0",
            processing_time_ms=int(random.uniform(500, 1200)),
            service_name=self.SERVICE_NAME
        )
