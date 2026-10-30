import os
from pathlib import Path
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from app.core.config import settings

class DataService:
    def __init__(self, csv_path: Optional[str] = None):
        self.csv_path = csv_path or settings.DATASET_PATH
        self._df: Optional[pd.DataFrame] = None
        self._load_and_validate()

    def _load_and_validate(self):
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Dataset CSV not found at {self.csv_path}")

        # Ingest UTF-8 CSV
        df = pd.read_csv(self.csv_path, encoding='utf-8')

        # Clean column names mapping
        # Target column: LST (°C)
        self.target_col = [c for c in df.columns if 'LST' in c][0]
        self._df = df

    @property
    def df(self) -> pd.DataFrame:
        if self._df is None:
            self._load_and_validate()
        return self._df

    def get_metadata(self) -> Dict[str, Any]:
        df = self.df
        return {
            "dataset_name": "India Cities Climate & Land Surface Temperature (2021-2025)",
            "coverage": "97 Indian Cities across 23 States",
            "time_range": "2021 - 2025 (Monthly Satellite Passes)",
            "cities_count": int(df['City'].nunique()),
            "states_count": int(df['State'].nunique()),
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "target_variable": self.target_col,
            "target_units": "°C",
            "columns": [
                {"name": "City", "type": "string", "units": "Indian Municipality"},
                {"name": "State", "type": "string", "units": "State / Union Territory"},
                {"name": "Latitude", "type": "float", "units": "degrees North (8.5° to 34.5°)"},
                {"name": "Longitude", "type": "float", "units": "degrees East (72.8° to 92.6°)"},
                {"name": "Year", "type": "integer", "units": "2021 to 2025"},
                {"name": "Month", "type": "string", "units": "Calendar Month"},
                {"name": "NDVI", "type": "float", "units": "Normalized Difference Vegetation Index (-0.2 to 0.9)"},
                {"name": "NDBI", "type": "float", "units": "Normalized Difference Built-up Index (-0.4 to 0.31)"},
                {"name": "NDWI", "type": "float", "units": "Normalized Difference Water Index (-0.5 to 0.21)"},
                {"name": "Elevation (m)", "type": "integer", "units": "meters above sea level"},
                {"name": self.target_col, "type": "float", "units": "degrees Celsius (°C)", "role": "target"}
            ],
            "unique_cities_count": int(df["City"].nunique()),
            "unique_states_count": int(df["State"].nunique()),
            "missing_values_count": int(df.isnull().sum().sum()),
            "duplicate_records_count": int(df.duplicated().sum())
        }

    def get_summary(self) -> Dict[str, Any]:
        df = self.df
        numeric_df = df.select_dtypes(include=[np.number])
        summary_stats = {}
        for col in numeric_df.columns:
            summary_stats[col] = {
                "mean": round(float(df[col].mean()), 3),
                "std": round(float(df[col].std()), 3),
                "min": round(float(df[col].min()), 3),
                "25%": round(float(df[col].quantile(0.25)), 3),
                "50%": round(float(df[col].median()), 3),
                "75%": round(float(df[col].quantile(0.75)), 3),
                "max": round(float(df[col].max()), 3)
            }

        state_counts = df['State'].value_counts().head(10).to_dict()
        year_counts = df['Year'].value_counts().sort_index().to_dict()

        return {
            "total_observations": len(df),
            "unique_cities": int(df["City"].nunique()),
            "numeric_distributions": summary_stats,
            "state_distribution_top10": state_counts,
            "year_distribution": {str(k): v for k, v in year_counts.items()},
            "target_variable": self.target_col,
            "mean_lst": round(float(df[self.target_col].mean()), 2),
            "mean_ndvi": round(float(df["NDVI"].mean()), 3),
            "mean_ndbi": round(float(df["NDBI"].mean()), 3),
            "mean_ndwi": round(float(df["NDWI"].mean()), 3)
        }

    def get_locations(self) -> List[Dict[str, Any]]:
        df = self.df
        # Group by City to get unique representative node for the geographical map
        grouped = df.groupby("City").agg({
            "State": "first",
            "Latitude": "first",
            "Longitude": "first",
            "Elevation (m)": "mean",
            self.target_col: "mean",
            "NDVI": "mean",
            "NDBI": "mean",
            "NDWI": "mean"
        }).reset_index()

        locations = []
        for _, row in grouped.iterrows():
            locations.append({
                "city_name": str(row["City"]).strip(),
                "state": str(row["State"]).strip(),
                "latitude": round(float(row["Latitude"]), 4),
                "longitude": round(float(row["Longitude"]), 4),
                "elevation_m": round(float(row["Elevation (m)"]), 1),
                "temperature_c": round(float(row[self.target_col]), 2),
                "lst_c": round(float(row[self.target_col]), 2),
                "ndvi": round(float(row["NDVI"]), 3),
                "ndbi": round(float(row["NDBI"]), 3),
                "ndwi": round(float(row["NDWI"]), 3),
                "greenness_pct": round(max(0.0, float(row["NDVI"]) * 100), 1),
                "land_cover": "Urban Fabric" if row["NDBI"] > 0 else "Vegetated / Mixed"
            })
        return locations

    def get_observations(
        self,
        page: int = 1,
        limit: int = 50,
        city: Optional[str] = None,
        state: Optional[str] = None,
        year: Optional[int] = None,
        month: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "temp_desc"
    ) -> Dict[str, Any]:
        df = self.df

        if city:
            df = df[df["City"].str.lower() == city.lower()]
        if state:
            df = df[df["State"].str.lower() == state.lower()]
        if year:
            df = df[df["Year"] == year]
        if month:
            df = df[df["Month"].str.lower() == month.lower()]

        if search:
            search_str = search.lower()
            df = df[df["City"].str.lower().str.contains(search_str) | df["State"].str.lower().str.contains(search_str)]

        if sort_by == "temp_desc":
            df = df.sort_values(by=self.target_col, ascending=False)
        elif sort_by == "temp_asc":
            df = df.sort_values(by=self.target_col, ascending=True)
        elif sort_by == "green_desc" or sort_by == "ndvi_desc":
            df = df.sort_values(by="NDVI", ascending=False)
        elif sort_by == "ndbi_desc":
            df = df.sort_values(by="NDBI", ascending=False)

        total_matching = len(df)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_df = df.iloc[start_idx:end_idx]

        # Standardize field names for seamless frontend compatibility
        items = []
        for _, row in paginated_df.iterrows():
            c_name = str(row["City"]).strip()
            items.append({
                "City Name": c_name,
                "City": c_name,
                "State": str(row["State"]).strip(),
                "Latitude": float(row["Latitude"]),
                "Longitude": float(row["Longitude"]),
                "Year": int(row["Year"]),
                "Month": str(row["Month"]),
                "NDVI": round(float(row["NDVI"]), 3),
                "NDBI": round(float(row["NDBI"]), 3),
                "NDWI": round(float(row["NDWI"]), 3),
                "Elevation (m)": int(row["Elevation (m)"]),
                "Temperature (°C)": round(float(row[self.target_col]), 2),
                "LST (°C)": round(float(row[self.target_col]), 2),
                "Urban Greenness Ratio (%)": round(max(0.0, float(row["NDVI"]) * 100), 1),
                "Land Cover": "Urban Fabric" if row["NDBI"] > 0 else "Vegetated Basin"
            })

        return {
            "total": total_matching,
            "page": page,
            "limit": limit,
            "pages": (total_matching + limit - 1) // limit if limit > 0 else 1,
            "items": items
        }

    def get_indicators(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "lst",
                "label": "Land Surface Temperature (LST)",
                "column": self.target_col,
                "units": "°C",
                "category": "Thermal Target",
                "description": "Satellite-derived thermal radiance representing surface skin temperature across Indian cities."
            },
            {
                "id": "ndvi",
                "label": "Vegetation Index (NDVI)",
                "column": "NDVI",
                "units": "index (-0.2 to 0.9)",
                "category": "Ecological",
                "description": "Normalized Difference Vegetation Index quantifying active green canopy reflectance."
            },
            {
                "id": "ndbi",
                "label": "Built-Up Index (NDBI)",
                "column": "NDBI",
                "units": "index (-0.4 to 0.31)",
                "category": "Urban Fabric",
                "description": "Normalized Difference Built-Up Index tracking impermeable asphalt and concrete pavements."
            },
            {
                "id": "ndwi",
                "label": "Water / Moisture Index (NDWI)",
                "column": "NDWI",
                "units": "index (-0.5 to 0.21)",
                "category": "Hydrological",
                "description": "Normalized Difference Water Index highlighting open water, wetlands, and soil moisture."
            },
            {
                "id": "elevation",
                "label": "Elevation",
                "column": "Elevation (m)",
                "units": "meters",
                "category": "Topographic",
                "description": "Height above mean sea level exerting adiabatic lapse-rate cooling."
            }
        ]

    def get_comparison(
        self,
        city_a_name: Optional[str] = None,
        city_b_name: Optional[str] = None,
        year_a: Optional[int] = None,
        year_b: Optional[int] = None
    ) -> Dict[str, Any]:
        df = self.df

        # If comparing two cities
        c_a = (city_a_name or "Delhi").strip()
        c_b = (city_b_name or "Bengaluru").strip()

        df_a = df[df["City"].str.strip().str.lower() == c_a.lower()]
        df_b = df[df["City"].str.strip().str.lower() == c_b.lower()]

        if year_a:
            df_a = df_a[df_a["Year"] == year_a]
        if year_b:
            df_b = df_b[df_b["Year"] == year_b]

        mean_a = df_a[[self.target_col, "NDVI", "NDBI", "NDWI", "Elevation (m)"]].mean().to_dict() if not df_a.empty else {}
        mean_b = df_b[[self.target_col, "NDVI", "NDBI", "NDWI", "Elevation (m)"]].mean().to_dict() if not df_b.empty else {}

        delta_temp = round(float(mean_b.get(self.target_col, 0) - mean_a.get(self.target_col, 0)), 2)
        delta_ndvi = round(float(mean_b.get("NDVI", 0) - mean_a.get("NDVI", 0)), 3)
        delta_ndbi = round(float(mean_b.get("NDBI", 0) - mean_a.get("NDBI", 0)), 3)

        return {
            "type": "city_comparison",
            "entity_a": {
                "city": c_a,
                "year": year_a or "2021-2025 Average",
                "temperature_c": round(float(mean_a.get(self.target_col, 0)), 2),
                "lst_c": round(float(mean_a.get(self.target_col, 0)), 2),
                "ndvi": round(float(mean_a.get("NDVI", 0)), 3),
                "ndbi": round(float(mean_a.get("NDBI", 0)), 3),
                "ndwi": round(float(mean_a.get("NDWI", 0)), 3),
                "elevation_m": round(float(mean_a.get("Elevation (m)", 0)), 1)
            },
            "entity_b": {
                "city": c_b,
                "year": year_b or "2021-2025 Average",
                "temperature_c": round(float(mean_b.get(self.target_col, 0)), 2),
                "lst_c": round(float(mean_b.get(self.target_col, 0)), 2),
                "ndvi": round(float(mean_b.get("NDVI", 0)), 3),
                "ndbi": round(float(mean_b.get("NDBI", 0)), 3),
                "ndwi": round(float(mean_b.get("NDWI", 0)), 3),
                "elevation_m": round(float(mean_b.get("Elevation (m)", 0)), 1)
            },
            "delta": {
                "temperature_c": delta_temp,
                "lst_c": delta_temp,
                "ndvi": delta_ndvi,
                "ndbi": delta_ndbi
            }
        }

data_service = DataService()
