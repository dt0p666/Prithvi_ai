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
        # Normalize degree symbol and square symbol if needed while preserving semantic physical names
        self._df = df

    @property
    def df(self) -> pd.DataFrame:
        if self._df is None:
            self._load_and_validate()
        return self._df

    def get_metadata(self) -> Dict[str, Any]:
        df = self.df
        return {
            "dataset_name": "Urban Heat Island (UHI) Dataset",
            "provenance": "Kaggle Open Benchmark",
            "is_simulation": True,
            "simulation_notice": "Contains 500 simulated city nodes with 15 environmental and socioeconomic features. All records represent cross-sectional synthetic entities.",
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": [
                {"name": "City Name", "type": "string", "units": "identifier"},
                {"name": "Latitude", "type": "float", "units": "degrees (-90 to +90)"},
                {"name": "Longitude", "type": "float", "units": "degrees (-180 to +180)"},
                {"name": "Elevation (m)", "type": "float", "units": "meters"},
                {"name": "Temperature (°C)", "type": "float", "units": "degrees Celsius (°C)", "role": "target"},
                {"name": "Land Cover", "type": "categorical", "categories": ["Water", "Green Space", "Industrial", "Urban"]},
                {"name": "Population Density (people/km²)", "type": "integer", "units": "people/km²"},
                {"name": "Energy Consumption (kWh)", "type": "float", "units": "kilowatt-hours"},
                {"name": "Air Quality Index (AQI)", "type": "integer", "units": "AQI index (0-200)"},
                {"name": "Urban Greenness Ratio (%)", "type": "float", "units": "percentage (0-100%)"},
                {"name": "Health Impact (Mortality Rate/100k)", "type": "float", "units": "mortality per 100,000"},
                {"name": "Wind Speed (km/h)", "type": "float", "units": "kilometers per hour"},
                {"name": "Humidity (%)", "type": "float", "units": "percentage (0-100%)"},
                {"name": "Annual Rainfall (mm)", "type": "float", "units": "millimeters"},
                {"name": "GDP per Capita (USD)", "type": "float", "units": "US Dollars"}
            ],
            "missing_values_count": int(df.isnull().sum().sum()),
            "duplicate_records_count": int(df.duplicated().sum())
        }

    def get_summary(self) -> Dict[str, Any]:
        df = self.df
        numeric_df = df.select_dtypes(include=[np.number])
        summary_stats = {}
        for col in numeric_df.columns:
            summary_stats[col] = {
                "mean": round(float(df[col].mean()), 2),
                "std": round(float(df[col].std()), 2),
                "min": round(float(df[col].min()), 2),
                "25%": round(float(df[col].quantile(0.25)), 2),
                "50%": round(float(df[col].median()), 2),
                "75%": round(float(df[col].quantile(0.75)), 2),
                "max": round(float(df[col].max()), 2)
            }

        land_cover_counts = df['Land Cover'].value_counts().to_dict()

        return {
            "total_cities": len(df),
            "numeric_distributions": summary_stats,
            "land_cover_distribution": land_cover_counts,
            "target_variable": "Temperature (°C)",
            "mean_temperature": round(float(df["Temperature (°C)"].mean()), 2),
            "mean_greenness": round(float(df["Urban Greenness Ratio (%)"].mean()), 2),
            "mean_aqi": round(float(df["Air Quality Index (AQI)"].mean()), 2),
            "mean_density": round(float(df["Population Density (people/km²)"].mean()), 2)
        }

    def get_locations(self) -> List[Dict[str, Any]]:
        df = self.df
        locations = []
        for _, row in df.iterrows():
            locations.append({
                "city_name": str(row["City Name"]),
                "latitude": round(float(row["Latitude"]), 4),
                "longitude": round(float(row["Longitude"]), 4),
                "elevation_m": round(float(row["Elevation (m)"]), 1),
                "temperature_c": round(float(row["Temperature (°C)"]), 2),
                "land_cover": str(row["Land Cover"]),
                "greenness_pct": round(float(row["Urban Greenness Ratio (%)"]), 2)
            })
        return locations

    def get_observations(
        self,
        page: int = 1,
        limit: int = 50,
        land_cover: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "temp_desc"
    ) -> Dict[str, Any]:
        df = self.df

        if land_cover and land_cover != "ALL":
            df = df[df["Land Cover"] == land_cover]

        if search:
            search_str = search.lower()
            df = df[df["City Name"].str.lower().str.contains(search_str) | df["Land Cover"].str.lower().str.contains(search_str)]

        if sort_by == "temp_desc":
            df = df.sort_values(by="Temperature (°C)", ascending=False)
        elif sort_by == "temp_asc":
            df = df.sort_values(by="Temperature (°C)", ascending=True)
        elif sort_by == "green_desc":
            df = df.sort_values(by="Urban Greenness Ratio (%)", ascending=False)

        total_matching = len(df)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_df = df.iloc[start_idx:end_idx]

        items = paginated_df.to_dict(orient="records")
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
                "id": "temperature",
                "label": "Ambient Surface Temperature",
                "column": "Temperature (°C)",
                "units": "°C",
                "category": "Thermal",
                "description": "Primary heat metric reflecting urban boundary-layer thermal state."
            },
            {
                "id": "greenness",
                "label": "Urban Greenness Ratio",
                "column": "Urban Greenness Ratio (%)",
                "units": "%",
                "category": "Ecological",
                "description": "Vegetative canopy fraction mitigating heat through evapotranspiration and shading."
            },
            {
                "id": "energy",
                "label": "Energy Consumption",
                "column": "Energy Consumption (kWh)",
                "units": "kWh",
                "category": "Anthropogenic",
                "description": "Direct electrical and mechanical energy expenditure generating anthropogenic heat."
            },
            {
                "id": "aqi",
                "label": "Air Quality Index",
                "column": "Air Quality Index (AQI)",
                "units": "AQI",
                "category": "Atmospheric",
                "description": "Atmospheric particulate and aerosol density contributing to radiative thermal trapping."
            },
            {
                "id": "density",
                "label": "Population Density",
                "column": "Population Density (people/km²)",
                "units": "people/km²",
                "category": "Demographic",
                "description": "Human concentration indexing thermal exposure and built-up compactness."
            }
        ]

    def get_comparison(
        self,
        city_a_name: Optional[str] = None,
        city_b_name: Optional[str] = None,
        land_cover_a: Optional[str] = None,
        land_cover_b: Optional[str] = None
    ) -> Dict[str, Any]:
        df = self.df

        if city_a_name and city_b_name:
            ca = df[df["City Name"] == city_a_name]
            cb = df[df["City Name"] == city_b_name]
            if ca.empty or cb.empty:
                raise ValueError("One or both specified cities not found.")
            rec_a = ca.iloc[0].to_dict()
            rec_b = cb.iloc[0].to_dict()
            return {
                "type": "city_pair",
                "entity_a": rec_a,
                "entity_b": rec_b,
                "delta": {
                    "temperature_c": round(float(rec_b["Temperature (°C)"] - rec_a["Temperature (°C)"]), 2),
                    "greenness_pct": round(float(rec_b["Urban Greenness Ratio (%)"] - rec_a["Urban Greenness Ratio (%)"]), 2),
                    "aqi": int(rec_b["Air Quality Index (AQI)"] - rec_a["Air Quality Index (AQI)"]),
                    "energy_kwh": round(float(rec_b["Energy Consumption (kWh)"] - rec_a["Energy Consumption (kWh)"]), 2)
                }
            }

        # Compare land-cover aggregations
        cover_a = land_cover_a or "Urban"
        cover_b = land_cover_b or "Green Space"
        agg_a = df[df["Land Cover"] == cover_a].mean(numeric_only=True).to_dict()
        agg_b = df[df["Land Cover"] == cover_b].mean(numeric_only=True).to_dict()

        return {
            "type": "land_cover_archetype",
            "archetype_a": {"land_cover": cover_a, **{k: round(v, 2) for k, v in agg_a.items()}},
            "archetype_b": {"land_cover": cover_b, **{k: round(v, 2) for k, v in agg_b.items()}},
            "delta": {
                "temperature_c": round(float(agg_b["Temperature (°C)"] - agg_a["Temperature (°C)"]), 2),
                "greenness_pct": round(float(agg_b["Urban Greenness Ratio (%)"] - agg_a["Urban Greenness Ratio (%)"]), 2),
                "aqi": round(float(agg_b["Air Quality Index (AQI)"] - agg_a["Air Quality Index (AQI)"]), 1),
                "energy_kwh": round(float(agg_b["Energy Consumption (kWh)"] - agg_a["Energy Consumption (kWh)"]), 2)
            }
        }

# Global singleton data service
data_service = DataService()
