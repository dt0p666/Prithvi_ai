from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.services.data_service import data_service

router = APIRouter()

@router.get("/dataset/metadata")
def get_metadata():
    return data_service.get_metadata()

@router.get("/dataset/summary")
def get_summary():
    return data_service.get_summary()

@router.get("/locations")
def get_locations():
    return data_service.get_locations()

@router.get("/observations")
def get_observations(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=500, description="Items per page"),
    land_cover: Optional[str] = Query(None, description="Filter by Land Cover"),
    search: Optional[str] = Query(None, description="Search by city name"),
    sort_by: str = Query("temp_desc", description="Sort order: temp_desc, temp_asc, green_desc")
):
    return data_service.get_observations(
        page=page,
        limit=limit,
        land_cover=land_cover,
        search=search,
        sort_by=sort_by
    )

@router.get("/indicators")
def get_indicators():
    return data_service.get_indicators()

@router.get("/comparison")
def get_comparison(
    city_a: Optional[str] = Query(None, description="City A name"),
    city_b: Optional[str] = Query(None, description="City B name"),
    land_cover_a: Optional[str] = Query("Urban", description="Land cover regime A"),
    land_cover_b: Optional[str] = Query("Green Space", description="Land cover regime B")
):
    try:
        return data_service.get_comparison(
            city_a_name=city_a,
            city_b_name=city_b,
            land_cover_a=land_cover_a,
            land_cover_b=land_cover_b
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
