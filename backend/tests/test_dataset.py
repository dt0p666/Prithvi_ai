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
    assert data["total_rows"] == 5587
    assert data["total_columns"] == 11
    assert data["unique_cities_count"] == 97
    assert data["missing_values_count"] == 0
    assert "LST" in data["target_variable"]

def test_summary():
    res = client.get("/api/dataset/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_observations"] == 5587
    assert data["unique_cities"] == 97
    assert "NDVI" in data["numeric_distributions"]
    assert "NDBI" in data["numeric_distributions"]

def test_locations():
    res = client.get("/api/locations")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 97
    assert "city_name" in data[0]
    assert "state" in data[0]
    assert "latitude" in data[0]
    assert "lst_c" in data[0]

def test_observations_pagination():
    res = client.get("/api/observations?page=1&limit=20")
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) == 20
    assert data["total"] == 5587

def test_observations_filter():
    res = client.get("/api/observations?city=Delhi&limit=50")
    assert res.status_code == 200
    data = res.json()
    for item in data["items"]:
        assert item["City"] == "Delhi"

def test_indicators():
    res = client.get("/api/indicators")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    assert any(i["id"] == "lst" for i in data)
    assert any(i["id"] == "ndvi" for i in data)

def test_comparison():
    res = client.get("/api/comparison?city_a=Delhi&city_b=Bangalore")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "city_comparison"
    assert "temperature_c" in data["delta"]

def test_contact():
    res = client.post("/api/contact", json={"name": "Scientist", "email": "sci@test.org", "message": "Atlas test"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "received"
