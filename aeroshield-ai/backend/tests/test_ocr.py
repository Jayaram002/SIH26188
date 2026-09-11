import pytest
from app.ai.demo.demo_ocr import DemoOCRService

@pytest.mark.asyncio
async def test_ocr_extraction():
    ocr = DemoOCRService()
    res = await ocr.extract("fake_path", "PASSPORT", scenario=1)
    assert res.confidence > 0.9
    assert res.mrz_detected == True

@pytest.mark.asyncio
async def test_ocr_invalid():
    ocr = DemoOCRService()
    res = await ocr.extract("fake_path", "PASSPORT", scenario=5)
    assert res.mrz_detected == False
