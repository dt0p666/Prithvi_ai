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
    limit: int = Query(50, ge=1, le=5000, description="Items per page"),
    city: Optional[str] = Query(None, description="Filter by Indian City"),
    state: Optional[str] = Query(None, description="Filter by State"),
    year: Optional[int] = Query(None, description="Filter by Year (2021-2025)"),
    month: Optional[str] = Query(None, description="Filter by Month"),
    search: Optional[str] = Query(None, description="Search by city or state name"),
    sort_by: str = Query("temp_desc", description="Sort order: temp_desc, temp_asc, ndvi_desc, ndbi_desc")
):
    return data_service.get_observations(
        page=page,
        limit=limit,
        city=city,
        state=state,
        year=year,
        month=month,
        search=search,
        sort_by=sort_by
    )

@router.get("/indicators")
def get_indicators():
    return data_service.get_indicators()

@router.get("/comparison")
def get_comparison(
    city_a: Optional[str] = Query("Delhi", description="City A name"),
    city_b: Optional[str] = Query("Bangalore", description="City B name"),
    year_a: Optional[int] = Query(None, description="Year for City A (e.g. 2021)"),
    year_b: Optional[int] = Query(None, description="Year for City B (e.g. 2025)")
):
    try:
        return data_service.get_comparison(
            city_a_name=city_a,
            city_b_name=city_b,
            year_a=year_a,
            year_b=year_b
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
