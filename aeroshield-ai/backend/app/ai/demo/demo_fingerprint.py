import asyncio
import random
from app.ai.interfaces import FingerprintService, BiometricMatchResultData
from app.ai.demo import DEMO_SCENARIOS

class DemoFingerprintService(FingerprintService):
    SERVICE_NAME = "DEMO_FINGERPRINT"
    
    async def verify(self, reference_template_id: str, sample_path: str, scenario: int = 1) -> BiometricMatchResultData:
        await asyncio.sleep(random.uniform(0.2, 0.8))
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        score = s["fingerprint_score"] + random.uniform(-0.01, 0.01)
        match_res = "MATCH" if score > 0.8 else ("UNCERTAIN" if score > 0.6 else "MISMATCH")
        
        return BiometricMatchResultData(
            similarity_score=score,
            quality_score=0.92,
            pad_result=s["fingerprint_pad"],
            match_result=match_res,
            processing_time_ms=int(random.uniform(200, 800)),
            service_name=self.SERVICE_NAME
        )

    async def check_pad(self, sample_path: str, scenario: int = 1) -> dict:
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        return {"pad_result": s["fingerprint_pad"]}
