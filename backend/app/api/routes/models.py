from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.inference_service import inference_service

router = APIRouter()

class PredictInput(BaseModel):
    month: str = Field("May", description="Month of observation")
    state: str = Field("Delhi", description="State or Union Territory")
    ndvi: float = Field(0.22, ge=-0.5, le=1.0, description="Normalized Difference Vegetation Index")
    ndbi: float = Field(0.05, ge=-0.6, le=0.6, description="Normalized Difference Built-Up Index")
    ndwi: float = Field(-0.24, ge=-0.8, le=0.8, description="Normalized Difference Water Index")
    elevation_m: int = Field(250, ge=0, le=9000, description="Elevation in meters above sea level")
    latitude: float = Field(28.61, ge=5.0, le=40.0, description="Latitude degrees North")
    longitude: float = Field(77.20, ge=65.0, le=100.0, description="Longitude degrees East")
    year: int = Field(2024, ge=2021, le=2030, description="Year of observation")

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
