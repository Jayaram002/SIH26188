def test_full_workflow(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # 1. Start verification
    res = client.post("/api/verification/start", json={"terminal": "T2", "demo_scenario": 1}, headers=headers)
    assert res.status_code == 200
    session_id = res.json()["id"]

    # 2. Risk calc
    res = client.post(f"/api/verification/{session_id}/risk", headers=headers)
    assert res.status_code == 200
    assert res.json()["risk_status"] == "VERIFIED"

    # 3. Finalize
    res = client.post(f"/api/verification/{session_id}/decision", headers=headers)
    assert res.status_code == 200
