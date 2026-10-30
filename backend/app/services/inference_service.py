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
            with open(self.metrics_path, "r", encoding="utf-8") as f:
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

        # Map to expected column names for India Cities dataset
        row = {
            "Month": str(input_data.get("month", "May")),
            "State": str(input_data.get("state", "Delhi")),
            "NDVI": float(input_data.get("ndvi", 0.22)),
            "NDBI": float(input_data.get("ndbi", 0.05)),
            "NDWI": float(input_data.get("ndwi", -0.24)),
            "Elevation (m)": int(input_data.get("elevation_m", 250)),
            "Latitude": float(input_data.get("latitude", 28.61)),
            "Longitude": float(input_data.get("longitude", 77.20)),
            "Year": int(input_data.get("year", 2024))
        }

        df_input = pd.DataFrame([row])
        pred = float(self._pipeline.predict(df_input)[0])

        caveats = [
            "Supervised LightGBM regression inference on multi-year Indian satellite observations (2021-2025).",
            "Sensitivity analysis reflects observational multivariate associations; local thermodynamics may vary.",
        ]

        if row["NDVI"] > 0.85 or row["NDBI"] > 0.35:
            caveats.append("Out-of-distribution warning: Feature values approach or exceed empirical dataset bounds.")

        return {
            "predicted_temperature_c": round(pred, 2),
            "predicted_lst_c": round(pred, 2),
            "units": "°C",
            "model_name": self._metrics.get("best_model", "LightGBM") if self._metrics else "LightGBM",
            "model_version": "2.0.0",
            "target": "Land Surface Temperature LST (°C)",
            "is_simulation": False,
            "dataset": "India Cities Dataset (2021-2025)",
            "caveats": caveats
        }

inference_service = InferenceService()
