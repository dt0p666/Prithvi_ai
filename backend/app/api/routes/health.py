from fastapi import APIRouter
from datetime import datetime, timezone
import os
from pathlib import Path
from app.core.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    dataset_exists = Path(settings.DATASET_PATH).exists()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dataset_connected": dataset_exists,
        "dataset_path": settings.DATASET_PATH if dataset_exists else None,
    }
