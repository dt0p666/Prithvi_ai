import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_journey_1_general_visitor():
    """User 1: General Visitor accesses homepage, health check, and metadata."""
    res_health = client.get("/api/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"
    assert res_health.json()["dataset_connected"] is True

    res_meta = client.get("/api/dataset/metadata")
    assert res_meta.status_code == 200
    assert res_meta.json()["total_rows"] == 5587
    assert res_meta.json()["cities_count"] == 97

def test_journey_2_climate_researcher():
    """User 2: Climate Researcher filters observations and inspects environmental indicators."""
    res_obs = client.get("/api/observations?state=Delhi&limit=10&sort_by=temp_desc")
    assert res_obs.status_code == 200
    data = res_obs.json()
    assert len(data["items"]) <= 10
    for item in data["items"]:
        assert item["State"] == "Delhi"
        assert "LST (°C)" in item
        assert "NDVI" in item
        assert "NDBI" in item

    res_ind = client.get("/api/indicators")
    assert res_ind.status_code == 200
    indicators = res_ind.json()
    assert any(i["id"] == "ndvi" for i in indicators)
    assert any(i["id"] == "lst" for i in indicators)

def test_journey_3_environmental_analyst():
    """User 3: Environmental Analyst compares contrasting microclimates across Indian cities or years."""
    res_comp = client.get("/api/comparison?city_a=Delhi&city_b=Bangalore")
    assert res_comp.status_code == 200
    data = res_comp.json()
    assert "entity_a" in data
    assert "entity_b" in data
    assert "delta" in data
    assert "lst_c" in data["delta"]

def test_journey_4_urban_planner():
    """User 4: Urban Planner runs climate scenario simulation with intervention."""
    payload = {
        "baseline_inputs": {
            "month": "May",
            "state": "Delhi",
            "ndvi": 0.12,
            "ndbi": 0.18,
            "ndwi": -0.35,
            "elevation_m": 220.0,
            "latitude": 28.61,
            "longitude": 77.20,
            "year": 2024
        },
        "scenario_inputs": {
            "month": "May",
            "state": "Delhi",
            "ndvi": 0.40,
            "ndbi": -0.05,
            "ndwi": -0.15,
            "elevation_m": 220.0,
            "latitude": 28.61,
            "longitude": 77.20,
            "year": 2024
        }
    }
    res_scen = client.post("/api/scenarios/run", json=payload)
    assert res_scen.status_code == 200
    data = res_scen.json()
    assert "baseline_lst_c" in data
    assert "intervention_lst_c" in data
    assert "delta_lst_c" in data
    assert len(data["caveats"]) >= 1

def test_journey_5_contact_and_feedback():
    """User 5: Mobile / Public Visitor submits inquiry through contact pipeline."""
    payload = {
        "name": "Prof. Rao",
        "email": "rao@urbanclimate.in",
        "message": "Inquiry regarding spatial downscaling models for PRITHVI."
    }
    res_contact = client.post("/api/contact", json=payload)
    assert res_contact.status_code == 200
    assert res_contact.json()["status"] == "received"
