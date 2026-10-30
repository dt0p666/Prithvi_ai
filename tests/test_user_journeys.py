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
    assert res_meta.json()["total_rows"] == 500

def test_journey_2_climate_researcher():
    """User 2: Climate Researcher filters observations and inspects environmental indicators."""
    res_obs = client.get("/api/observations?land_cover=Green Space&limit=10&sort_by=green_desc")
    assert res_obs.status_code == 200
    data = res_obs.json()
    assert len(data["items"]) <= 10
    for item in data["items"]:
        assert item["Land Cover"] == "Green Space"
        assert "Temperature (°C)" in item
        assert "Urban Greenness Ratio (%)" in item

    res_ind = client.get("/api/indicators")
    assert res_ind.status_code == 200
    indicators = res_ind.json()
    assert any(i["id"] == "greenness" for i in indicators)

def test_journey_3_environmental_analyst():
    """User 3: Environmental Analyst compares contrasting microclimate archetypes."""
    res_comp = client.get("/api/comparison?land_cover_a=Urban&land_cover_b=Green Space")
    assert res_comp.status_code == 200
    data = res_comp.json()
    assert data["type"] == "land_cover_archetype"
    assert "delta" in data
    assert "temperature_c" in data["delta"]

def test_journey_4_urban_planner():
    """User 4: Urban Planner runs climate scenario simulation with intervention."""
    payload = {
        "baseline_inputs": {
            "land_cover": "Urban",
            "urban_greenness_ratio": 10.0,
            "energy_consumption_kwh": 45000.0,
            "population_density": 9500,
            "aqi": 180,
            "elevation_m": 300.0,
            "wind_speed_kmh": 6.0,
            "humidity_pct": 45.0,
            "annual_rainfall_mm": 900.0,
            "gdp_per_capita": 25000.0
        },
        "scenario_inputs": {
            "land_cover": "Green Space",
            "urban_greenness_ratio": 45.0,
            "energy_consumption_kwh": 20000.0,
            "population_density": 6000,
            "aqi": 60,
            "elevation_m": 300.0,
            "wind_speed_kmh": 12.0,
            "humidity_pct": 55.0,
            "annual_rainfall_mm": 900.0,
            "gdp_per_capita": 25000.0
        }
    }
    res_scen = client.post("/api/scenarios/run", json=payload)
    assert res_scen.status_code == 200
    data = res_scen.json()
    assert "baseline_temperature_c" in data
    assert "intervention_temperature_c" in data
    assert "delta_temperature_c" in data
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
