from pydantic import BaseModel
import os
from pathlib import Path

class Settings(BaseModel):
    PROJECT_NAME: str = "PRITHVI - Urban Heat & Climate Vulnerability Intelligence"
    API_V1_STR: str = "/api"
    VERSION: str = "1.0.0"
    DATASET_PATH: str = str(Path(__file__).resolve().parent.parent.parent.parent / "urban_heat_island_dataset.csv")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

settings = Settings()
