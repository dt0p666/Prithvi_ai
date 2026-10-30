# PRITHVI — Urban Heat & Climate Vulnerability Intelligence

> **"Every City Has a Climate Story. The Earth Remembers Everything."**  
> *Ancient Indian earth aesthetics × cinematic environmental storytelling × computational climate intelligence.*

---

## 1. Project Overview

**PRITHVI** is a production-ready, ML-powered climate intelligence website built from the ground up to analyze urban heat, multi-variable environmental indicators, thermal vulnerability, and simulated urban interventions.

The platform faithfully reproduces the approved **Figma Make design** (`Interactive-Urban-Climate-Atlas`), utilizing a handcrafted palette of antique gold, deep forest green, weathered bronze, burnt terracotta, and dark earth charcoal, paired with monumental serif typography and an interactive 3D isometric city.

---

## 2. Dataset Verification & Provenance

The system is directly connected to the verified Kaggle CSV dataset:
`urban_heat_island_dataset.csv` (114,985 bytes).

### Verified Schema & Attributes
- **Total Records:** 500 simulated city nodes (`City_1` to `City_500`)
- **Total Features:** 15 columns (0 missing values, 0 duplicate records)
- **Primary Predictand (Target):** `Temperature (°C)` (ambient urban surface temperature in °C)
- **Data Character:** **Synthetic / Simulation-based benchmark**. All findings are clearly labeled as simulation-derived.
- **Geographic Information:** Includes global coordinates (`Latitude`: -88.7° to +88.7°, `Longitude`: -179.9° to +179.9°, `Elevation`: 0 to 4,497m).
- **Temporal Status:** Snapshot / cross-sectional. No historical longitudinal dates are fabricated; comparative analysis is conducted across land-cover regimes and simulated archetypes.

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `City Name` | string | Identifier (`City_1` to `City_500`) |
| `Latitude` | float64 | Geographic latitude (-90° to +90°) |
| `Longitude` | float64 | Geographic longitude (-180° to +180°) |
| `Elevation (m)` | float64 | Height above sea level in meters |
| `Temperature (°C)` | float64 | **Primary Target Variable** |
| `Land Cover` | categorical | `Water`, `Green Space`, `Industrial`, `Urban` |
| `Population Density (people/km²)` | int64 | Human population density |
| `Energy Consumption (kWh)` | float64 | Anthropogenic power expenditure |
| `Air Quality Index (AQI)` | int64 | Atmospheric particulate metric (0–200) |
| `Urban Greenness Ratio (%)` | float64 | Vegetative canopy coverage (0–60%) |
| `Health Impact (Mortality Rate/100k)`| float64 | Demographic health vulnerability metric |
| `Wind Speed (km/h)` | float64 | Boundary layer convective speed |
| `Humidity (%)` | float64 | Relative atmospheric moisture (20–80%) |
| `Annual Rainfall (mm)` | float64 | Annual precipitation in millimeters |
| `GDP per Capita (USD)` | float64 | Economic indicator in USD |

---

## 3. The Five Primary Pages

1. **Home (`/`):**
   - Monumental gold serif headline: `PRITHVI · THE EARTH REMEMBERS EVERYTHING`
   - Sanskrit subline: `पृथ्वी · Earth`
   - Primary Pill CTA: `ENTER THE ATLAS →`
   - Fine vertical pinstripe frames and diamond star corner accents (`✦`)
   - **Interactive 3D Isometric City:** Three.js architectural slab blocks, diagonal ground terrain, dynamic shadows, draggable orbit controls, interactive thermal hotspots (`● 35.8° SURFACE`, `● COOL CANOPY`), and a live District HUD telemetry card.

2. **Climate Explorer (`/explorer`):**
   - Multi-variable intelligence table & visualizer across 500 city nodes
   - Filter by Land Cover (`Urban`, `Green Space`, `Industrial`, `Water`)
   - Search by city name and sort by thermal / greenness indicators
   - Deep Node Telemetry Drawer inspecting energy, AQI, humidity, and density.

3. **Then / Now · Comparative Analysis (`/comparison`):**
   - Cross-sectional comparative analysis between contrasting microclimate archetypes (e.g. *High-Density Concrete Core* vs *Regenerative Forest Canopy*)
   - Real-time delta calculations: $\Delta\text{Temperature}$, $\Delta\text{Canopy}$, $\Delta\text{AQI}$, $\Delta\text{Mortality}$.

4. **Scenario Lab (`/scenario`):**
   - Interactive climate planning environment
   - Parameter controls: Target Land Cover, Urban Greenness Ratio (0–60%), Energy Consumption, and Population Density
   - 4 Quick-Action Presets (+35% Forest Canopy, Decarbonization, Riparian Wetland, Industrial Sprawl)
   - Baseline vs Modified prediction comparison with Out-of-Distribution guardrails.

5. **Methodology & Provenance (`/about`):**
   - Editorial manifesto on urban heat physics and epistemic boundaries
   - ML benchmarking results and feature importance
   - 6 Legal-Risk Audits (Age Gate, Font privacy, Session replay disabled, Marketing, Renewals, DMCA).
   - Expandable interactive FAQ.

---

## 4. Machine Learning Pipeline

- **Script:** [`ml/training/train.py`](file:///C:/Users/LOQ/OneDrive/Documents/prithvi.ai/ml/training/train.py)
- **Held-Out Split:** 80/20 train/test split with strict leakage prevention (preprocessors fit strictly on training fold).
- **Models Benchmarked:**
  - `DummyBaseline`: MAE = 6.1507 °C | RMSE = 7.0233 °C
  - `RidgeRegression`: MAE = 6.1676 °C | RMSE = 7.2507 °C
  - `RandomForestRegressor`: MAE = 6.0323 °C | RMSE = 7.1177 °C (**Best MAE**)
  - `LightGBMRegressor`: MAE = 6.2430 °C | RMSE = 7.5374 °C
- **Artifacts:** Persisted to `ml/artifacts/best_model.joblib` and `ml/artifacts/metrics.json`.

---

## 5. Backend REST API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, dataset connection, timestamp |
| `GET` | `/api/dataset/metadata` | Row count, schema, units, simulation notice |
| `GET` | `/api/dataset/summary` | Numeric distributions and land-cover frequencies |
| `GET` | `/api/locations` | 500 city coordinates for geographic visualization |
| `GET` | `/api/observations` | Filtered, sorted, and paginated records |
| `GET` | `/api/indicators` | Detailed definitions of atmospheric & thermal indicators |
| `GET` | `/api/comparison` | Pairwise city or archetype delta analysis |
| `GET` | `/api/models/metrics` | Held-out validation MAE, RMSE, R², feature importances |
| `GET` | `/api/models/features` | Input schema and feature importance weights |
| `POST` | `/api/models/predict` | Supervised regression temperature inference |
| `POST` | `/api/scenarios/run` | Microclimate intervention sensitivity simulation |
| `POST` | `/api/contact` | Inquiry transmission and contact workflow |

---

## 6. Execution & Testing

### Automated Test Suite (20 / 20 Tests Passed)
```bash
# Run backend and user journey tests
python -m pytest tests/ backend/tests/ -v
```

### Local Development
```bash
# 1. Start Backend API (Port 8000)
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 2. Start Frontend Dev Server (Port 5173)
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

### Production Build
```bash
cd frontend
npm run build
```

---

## 7. Deployment Configuration

- **Frontend:** Ready for Vercel deployment with client-side SPA routing (`dist/`).
- **Backend:** Ready for Render or Railway deployment via Uvicorn (`app.main:app`).
- **Continuous Integration:** Automated GitHub Actions workflow at `.github/workflows/ci.yml`.
