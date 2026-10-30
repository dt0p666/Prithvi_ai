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
    assert "LST" in data["target"]

def test_model_features():
    res = client.get("/api/models/features")
    assert res.status_code == 200
    data = res.json()
    assert "Month" in data["categorical"]
    assert "NDVI" in data["numeric"]
    assert "NDBI" in data["numeric"]

def test_model_predict():
    payload = {
        "month": "May",
        "state": "Maharashtra",
        "ndvi": 0.28,
        "ndbi": 0.04,
        "ndwi": -0.15,
        "elevation_m": 560,
        "latitude": 18.52,
        "longitude": 73.85,
        "year": 2024
    }
    res = client.post("/api/models/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_lst_c" in data
    assert isinstance(data["predicted_lst_c"], (int, float))
    assert data["units"] == "°C"

def test_predict_validation_error():
    # Invalid NDVI > 1.0
    payload = {
        "month": "May",
        "ndvi": 5.0
    }
    res = client.post("/api/models/predict", json=payload)
    assert res.status_code == 422

def test_scenario_run():
    payload = {
        "baseline_inputs": {
            "month": "May",
            "state": "Delhi",
            "ndvi": 0.15,
            "ndbi": 0.12,
            "ndwi": -0.30,
            "elevation_m": 220,
            "latitude": 28.61,
            "longitude": 77.20,
            "year": 2024
        },
        "scenario_inputs": {
            "month": "May",
            "state": "Delhi",
            "ndvi": 0.45,  # Increased vegetation
            "ndbi": -0.05, # Reduced built-up fraction
            "ndwi": -0.15,
            "elevation_m": 220,
            "latitude": 28.61,
            "longitude": 77.20,
            "year": 2024
        }
    }
    res = client.post("/api/scenarios/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "baseline_lst_c" in data
    assert "intervention_lst_c" in data
    assert "delta_lst_c" in data
    assert data["units"] == "°C"
