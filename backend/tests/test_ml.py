import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_model_metrics():
    res = client.get("/api/models/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "models_benchmarked" in data
    assert "best_model" in data
    assert "feature_importances" in data
    assert data["target"] == "Temperature (°C)"

def test_model_features():
    res = client.get("/api/models/features")
    assert res.status_code == 200
    data = res.json()
    assert "Land Cover" in data["categorical"]
    assert "Elevation (m)" in data["numeric"]

def test_model_predict():
    payload = {
        "land_cover": "Green Space",
        "elevation_m": 800.0,
        "population_density": 3000,
        "energy_consumption_kwh": 12000.0,
        "aqi": 45,
        "urban_greenness_ratio": 48.0,
        "wind_speed_kmh": 12.0,
        "humidity_pct": 60.0,
        "annual_rainfall_mm": 1800.0,
        "gdp_per_capita": 35000.0
    }
    res = client.post("/api/models/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_temperature_c" in data
    assert isinstance(data["predicted_temperature_c"], (int, float))
    assert data["units"] == "°C"
    assert data["is_simulation"] is True

def test_predict_validation_error():
    # Negative elevation not allowed
    payload = {
        "land_cover": "InvalidCover",
        "elevation_m": -50.0
    }
    res = client.post("/api/models/predict", json=payload)
    assert res.status_code == 422  # Pydantic validation error

def test_scenario_run():
    payload = {
        "baseline_inputs": {
            "land_cover": "Urban",
            "urban_greenness_ratio": 12.0,
            "energy_consumption_kwh": 40000.0,
            "population_density": 9000,
            "aqi": 180,
            "elevation_m": 200.0,
            "wind_speed_kmh": 5.0,
            "humidity_pct": 40.0,
            "annual_rainfall_mm": 700.0,
            "gdp_per_capita": 20000.0
        },
        "scenario_inputs": {
            "land_cover": "Green Space",
            "urban_greenness_ratio": 50.0,
            "energy_consumption_kwh": 15000.0,
            "population_density": 4000,
            "aqi": 50,
            "elevation_m": 200.0,
            "wind_speed_kmh": 15.0,
            "humidity_pct": 65.0,
            "annual_rainfall_mm": 700.0,
            "gdp_per_capita": 20000.0
        }
    }
    res = client.post("/api/scenarios/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "baseline_temperature_c" in data
    assert "intervention_temperature_c" in data
    assert "delta_temperature_c" in data
    assert data["units"] == "°C"
