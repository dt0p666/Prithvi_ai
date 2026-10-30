from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Literal
from app.services.inference_service import inference_service

router = APIRouter()

class PredictInput(BaseModel):
    land_cover: Literal["Water", "Green Space", "Industrial", "Urban"] = "Urban"
    elevation_m: float = Field(450.0, ge=0, le=9000, description="Elevation in meters")
    population_density: int = Field(5000, ge=0, le=50000, description="Population density people/km²")
    energy_consumption_kwh: float = Field(25000.0, ge=0, le=100000, description="Energy consumption in kWh")
    aqi: int = Field(100, ge=0, le=500, description="Air Quality Index")
    urban_greenness_ratio: float = Field(25.0, ge=0, le=100, description="Urban Greenness percentage")
    wind_speed_kmh: float = Field(15.0, ge=0, le=150, description="Wind speed in km/h")
    humidity_pct: float = Field(50.0, ge=0, le=100, description="Humidity percentage")
    annual_rainfall_mm: float = Field(1500.0, ge=0, le=10000, description="Annual rainfall in mm")
    gdp_per_capita: float = Field(25000.0, ge=0, le=200000, description="GDP per capita in USD")

@router.get("/models/metrics")
def get_metrics():
    return inference_service.get_metrics()

@router.get("/models/features")
def get_features():
    return inference_service.get_features()

@router.post("/models/predict")
def predict_temperature(payload: PredictInput):
    try:
        return inference_service.predict(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
