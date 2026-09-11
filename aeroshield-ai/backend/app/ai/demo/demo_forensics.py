import asyncio
import random
from app.ai.interfaces import ForensicsService, ForensicResultData
from app.ai.demo import DEMO_SCENARIOS

class DemoForensicsService(ForensicsService):
    SERVICE_NAME = "DEMO_FORENSICS"
    
    async def analyze(self, file_path: str, document_type: str, scenario: int = 1) -> ForensicResultData:
        await asyncio.sleep(random.uniform(0.8, 2.0))
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        tampering = s["tampering"]
        
        overall = "HIGH" if tampering else "LOW"
        region_risk = "HIGH" if tampering else "LOW"
        
        return ForensicResultData(
            photo_region_risk=region_risk,
            text_region_risk=region_risk,
            stamp_region_risk="LOW",
            metadata_anomaly=tampering,
            compression_anomaly=tampering,
            manipulation_detected=tampering,
            overall_risk=overall,
            suspicious_regions=[{"region": "photo", "risk": "HIGH", "confidence": 0.9, "description": "Mismatch"}] if tampering else [],
            metadata_details={},
            processing_time_ms=int(random.uniform(800, 2000)),
            service_name=self.SERVICE_NAME
        )
