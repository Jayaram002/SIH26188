from app.risk.engine import calculate_risk
from app.ai.demo import DEMO_SCENARIOS

def test_risk_low():
    res = calculate_risk(DEMO_SCENARIOS[1])
    assert res["risk_status"] == "VERIFIED"
    assert res["overall_risk_score"] < 15

def test_risk_medium():
    res = calculate_risk(DEMO_SCENARIOS[2])
    assert res["risk_status"] == "REVIEW_REQUIRED"

def test_risk_high():
    res = calculate_risk(DEMO_SCENARIOS[5])
    assert res["risk_status"] == "HIGH_RISK"
