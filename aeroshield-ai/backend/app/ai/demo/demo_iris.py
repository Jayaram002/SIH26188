import asyncio
import random
from app.ai.interfaces import IrisService, BiometricMatchResultData
from app.ai.demo import DEMO_SCENARIOS

class DemoIrisService(IrisService):
    SERVICE_NAME = "DEMO_IRIS"
    
    async def verify(self, reference_template_id: str, left_path: str, right_path: str, scenario: int = 1) -> BiometricMatchResultData:
        await asyncio.sleep(random.uniform(0.4, 1.2))
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        score = s["iris_score"] + random.uniform(-0.01, 0.01)
        match_res = "MATCH" if score > 0.8 else ("UNCERTAIN" if score > 0.6 else "MISMATCH")
        
        return BiometricMatchResultData(
            similarity_score=score,
            quality_score=0.98,
            pad_result=s["iris_pad"],
            match_result=match_res,
            processing_time_ms=int(random.uniform(400, 1200)),
            service_name=self.SERVICE_NAME
        )

    async def check_pad(self, image_path: str, scenario: int = 1) -> dict:
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        return {"pad_result": s["iris_pad"]}
