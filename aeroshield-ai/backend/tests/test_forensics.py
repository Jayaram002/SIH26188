import pytest
from app.ai.demo.demo_forensics import DemoForensicsService

@pytest.mark.asyncio
async def test_forensics_normal():
    fs = DemoForensicsService()
    res = await fs.analyze("fake_path", "PASSPORT", scenario=1)
    assert res.overall_risk == "LOW"

@pytest.mark.asyncio
async def test_forensics_suspicious():
    fs = DemoForensicsService()
    res = await fs.analyze("fake_path", "PASSPORT", scenario=2)
    assert res.overall_risk == "HIGH"
    assert res.manipulation_detected == True
