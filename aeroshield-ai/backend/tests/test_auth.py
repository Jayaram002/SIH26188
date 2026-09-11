def test_login_success(client):
    response = client.post("/api/auth/login", data={"username": "ADMIN_TEST", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure(client):
    response = client.post("/api/auth/login", data={"username": "ADMIN_TEST", "password": "wrong"})
    assert response.status_code == 400

def test_get_me(client, auth_token):
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {auth_token}"})
    assert response.status_code == 200
    assert response.json()["officer_id"] == "ADMIN_TEST"
