import os
import json
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
import joblib

def run_training():
    base_dir = Path(__file__).resolve().parent.parent.parent
    csv_path = base_dir / "urban_heat_island_dataset.csv"
    artifacts_dir = base_dir / "ml" / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading dataset from: {csv_path}")
    df = pd.read_csv(csv_path, encoding='utf-8')

    # Target: Temperature (°C)
    target_col = "Temperature (°C)"
    y = df[target_col].values

    # Features:
    # Categorical: Land Cover
    # Numeric: Elevation (m), Population Density (people/km²), Energy Consumption (kWh),
    #          Air Quality Index (AQI), Urban Greenness Ratio (%), Wind Speed (km/h),
    #          Humidity (%), Annual Rainfall (mm), GDP per Capita (USD)
    categorical_features = ["Land Cover"]
    numeric_features = [
        "Elevation (m)",
        "Population Density (people/km²)",
        "Energy Consumption (kWh)",
        "Air Quality Index (AQI)",
        "Urban Greenness Ratio (%)",
        "Wind Speed (km/h)",
        "Humidity (%)",
        "Annual Rainfall (mm)",
        "GDP per Capita (USD)"
    ]

    feature_cols = categorical_features + numeric_features
    X = df[feature_cols]

    # Leakage-safe Train/Test Split (80/20 with random state 42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ]
    )

    # Models to benchmark
    models = {
        "DummyBaseline": DummyRegressor(strategy="mean"),
        "RidgeRegression": Ridge(alpha=1.0),
        "RandomForest": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42),
        "LightGBM": lgb.LGBMRegressor(n_estimators=100, max_depth=6, learning_rate=0.05, random_state=42, verbose=-1)
    }

    results = {}
    best_model_name = None
    best_rmse = float("inf")
    best_pipeline = None

    for name, model in models.items():
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("model", model)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(root_mean_squared_error(y_test, y_pred))
        r2 = float(r2_score(y_test, y_pred))

        results[name] = {
            "model_name": name,
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "r2": round(r2, 4)
        }
        print(f"[{name}] MAE: {mae:.4f} | RMSE: {rmse:.4f} | R²: {r2:.4f}")

        if rmse < best_rmse:
            best_rmse = rmse
            best_model_name = name
            best_pipeline = pipeline

    results[best_model_name]["best_model"] = True

    # Feature Importance (extract from best model if available, or Ridge/RF)
    feature_names = []
    # Numeric features
    feature_names.extend(numeric_features)
    # One-hot encoded categorical features
    cat_encoder = best_pipeline.named_steps["preprocessor"].named_transformers_["cat"]
    cat_names = list(cat_encoder.get_feature_names_out(categorical_features))
    transformed_features = numeric_features + cat_names

    rf_pipeline = Pipeline([("preprocessor", preprocessor), ("rf", models["RandomForest"])])
    rf_pipeline.fit(X_train, y_train)
    rf_importances = rf_pipeline.named_steps["rf"].feature_importances_

    feature_importance_list = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(transformed_features, rf_importances), key=lambda x: x[1], reverse=True)
    ]

    # Save artifacts
    model_save_path = artifacts_dir / "best_model.joblib"
    joblib.dump(best_pipeline, model_save_path)
    print(f"Saved best model pipeline to: {model_save_path}")

    metadata = {
        "target": target_col,
        "target_units": "°C",
        "dataset_rows": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "features": {
            "categorical": categorical_features,
            "numeric": numeric_features
        },
        "all_transformed_features": transformed_features,
        "models_benchmarked": results,
        "best_model": best_model_name,
        "feature_importances": feature_importance_list,
        "timestamp": "2026-10-30T22:08:00Z"
    }

    metrics_path = artifacts_dir / "metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metrics metadata to: {metrics_path}")

    return metadata

if __name__ == "__main__":
    run_training()
