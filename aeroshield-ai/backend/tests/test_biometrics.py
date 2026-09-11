import pytest
from app.ai.demo.demo_face import DemoFaceService
from app.ai.demo.demo_fingerprint import DemoFingerprintService
from app.ai.demo.demo_iris import DemoIrisService

@pytest.mark.asyncio
async def test_face_match():
    fs = DemoFaceService()
    res = await fs.verify("a", "b", scenario=1)
    assert res.match_result == "MATCH"

@pytest.mark.asyncio
async def test_face_mismatch():
    fs = DemoFaceService()
    res = await fs.verify("a", "b", scenario=3)
    assert res.match_result == "MISMATCH"

@pytest.mark.asyncio
async def test_fingerprint_match():
    fs = DemoFingerprintService()
    res = await fs.verify("a", "b", scenario=1)
    assert res.match_result == "MATCH"

@pytest.mark.asyncio
async def test_iris_match():
    fs = DemoIrisService()
    res = await fs.verify("a", "b", "c", scenario=1)
    assert res.match_result == "MATCH"
