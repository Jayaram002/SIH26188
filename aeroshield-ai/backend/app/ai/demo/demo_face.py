import asyncio
import random
from app.ai.interfaces import FaceService, BiometricMatchResultData
from app.ai.demo import DEMO_SCENARIOS

class DemoFaceService(FaceService):
    SERVICE_NAME = "DEMO_FACE"
    
    async def verify(self, reference_path: str, live_image_path: str, scenario: int = 1) -> BiometricMatchResultData:
        await asyncio.sleep(random.uniform(0.3, 1.0))
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        score = s["face_score"] + random.uniform(-0.01, 0.01)
        
        match_res = "MATCH" if score > 0.8 else ("UNCERTAIN" if score > 0.6 else "MISMATCH")
        
        return BiometricMatchResultData(
            similarity_score=score,
            quality_score=0.95,
            pad_result=s["face_pad"],
            match_result=match_res,
            processing_time_ms=int(random.uniform(300, 1000)),
            service_name=self.SERVICE_NAME
        )

    async def check_liveness(self, image_path: str, scenario: int = 1) -> dict:
        s = DEMO_SCENARIOS.get(scenario, DEMO_SCENARIOS[1])
        return {"liveness_result": s["face_liveness"]}
