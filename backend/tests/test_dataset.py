import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_metadata():
    res = client.get("/api/dataset/metadata")
    assert res.status_code == 200
    data = res.json()
    assert data["total_rows"] == 500
    assert data["total_columns"] == 15
    assert data["is_simulation"] is True
    assert data["missing_values_count"] == 0

def test_summary():
    res = client.get("/api/dataset/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_cities"] == 500
    assert "Temperature (°C)" in data["numeric_distributions"]
    assert "Urban" in data["land_cover_distribution"]

def test_locations():
    res = client.get("/api/locations")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 500
    assert "latitude" in data[0]
    assert "temperature_c" in data[0]

def test_observations_pagination():
    res = client.get("/api/observations?page=1&limit=10")
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) == 10
    assert data["total"] == 500
    assert data["pages"] == 50

def test_observations_filter():
    res = client.get("/api/observations?land_cover=Green Space&limit=50")
    assert res.status_code == 200
    data = res.json()
    for item in data["items"]:
        assert item["Land Cover"] == "Green Space"

def test_indicators():
    res = client.get("/api/indicators")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    assert any(i["id"] == "temperature" for i in data)

def test_comparison():
    res = client.get("/api/comparison?city_a=City_1&city_b=City_2")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "city_pair"
    assert "temperature_c" in data["delta"]

def test_contact():
    res = client.post("/api/contact", json={"name": "Scientist", "email": "sci@test.org", "message": "Atlas test"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "received"
