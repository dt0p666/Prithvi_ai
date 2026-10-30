import os
import json
from pathlib import Path
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib

class InferenceService:
    def __init__(self):
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        self.artifacts_dir = base_dir / "ml" / "artifacts"
        self.model_path = self.artifacts_dir / "best_model.joblib"
        self.metrics_path = self.artifacts_dir / "metrics.json"
        self._pipeline = None
        self._metrics = None

    def _ensure_loaded(self):
        if self._pipeline is None and self.model_path.exists():
            self._pipeline = joblib.load(self.model_path)
        if self._metrics is None and self.metrics_path.exists():
            with open(self.metrics_path, "r") as f:
                self._metrics = json.load(f)

    def get_metrics(self) -> Dict[str, Any]:
        self._ensure_loaded()
        if self._metrics:
            return self._metrics
        return {"status": "model_not_trained_yet"}

    def get_features(self) -> Dict[str, Any]:
        self._ensure_loaded()
        if self._metrics:
            return {
                "categorical": self._metrics.get("features", {}).get("categorical", []),
                "numeric": self._metrics.get("features", {}).get("numeric", []),
                "feature_importances": self._metrics.get("feature_importances", [])
            }
        return {"categorical": [], "numeric": []}

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        self._ensure_loaded()
        if self._pipeline is None:
            raise RuntimeError("Model artifacts not found. Train the model first.")

        # Map to expected column names
        row = {
            "Land Cover": input_data.get("land_cover", "Urban"),
            "Elevation (m)": float(input_data.get("elevation_m", 500.0)),
            "Population Density (people/km²)": int(input_data.get("population_density", 5000)),
            "Energy Consumption (kWh)": float(input_data.get("energy_consumption_kwh", 25000.0)),
            "Air Quality Index (AQI)": int(input_data.get("aqi", 100)),
            "Urban Greenness Ratio (%)": float(input_data.get("urban_greenness_ratio", 25.0)),
            "Wind Speed (km/h)": float(input_data.get("wind_speed_kmh", 15.0)),
            "Humidity (%)": float(input_data.get("humidity_pct", 50.0)),
            "Annual Rainfall (mm)": float(input_data.get("annual_rainfall_mm", 1500.0)),
            "GDP per Capita (USD)": float(input_data.get("gdp_per_capita", 25000.0)),
        }

        df_input = pd.DataFrame([row])
        pred = float(self._pipeline.predict(df_input)[0])

        caveats = [
            "Prediction generated from supervised regression on Kaggle Urban Heat Island benchmark.",
            "Simulated association; does not prove physical microscale thermodynamic causality.",
        ]

        if row["Urban Greenness Ratio (%)"] > 60.0:
            caveats.append("Out-of-distribution warning: Greenness ratio exceeds dataset max (60.0%).")

        return {
            "predicted_temperature_c": round(pred, 2),
            "units": "°C",
            "model_name": self._metrics.get("best_model", "RegressionPipeline") if self._metrics else "RegressionPipeline",
            "model_version": "1.0.0",
            "target": "Temperature (°C)",
            "is_simulation": True,
            "caveats": caveats
        }

inference_service = InferenceService()
