export interface CityRecord {
  'City Name': string;
  Latitude: number;
  Longitude: number;
  'Elevation (m)': number;
  'Temperature (°C)': number;
  'Land Cover': 'Water' | 'Green Space' | 'Industrial' | 'Urban';
  'Population Density (people/km²)': number;
  'Energy Consumption (kWh)': number;
  'Air Quality Index (AQI)': number;
  'Urban Greenness Ratio (%)': number;
  'Health Impact (Mortality Rate/100k)': number;
  'Wind Speed (km/h)': number;
  'Humidity (%)': number;
  'Annual Rainfall (mm)': number;
  'GDP per Capita (USD)': number;
}

export interface DatasetSummary {
  total_cities: number;
  avg_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_greenness: number;
  land_cover_distribution: Record<string, number>;
  avg_aqi: number;
  avg_population_density: number;
}

export interface PredictionRequest {
  land_cover: 'Water' | 'Green Space' | 'Industrial' | 'Urban';
  elevation_m: number;
  population_density: number;
  energy_consumption_kwh: number;
  aqi: number;
  urban_greenness_ratio: number;
  wind_speed_kmh: number;
  humidity_pct: number;
  annual_rainfall_mm: number;
  gdp_per_capita: number;
  latitude?: number;
  longitude?: number;
}

export interface PredictionResponse {
  predicted_temperature_c: number;
  units: string;
  model_name: string;
  model_version: string;
  target: string;
  is_simulation: boolean;
  feature_contributions?: Record<string, number>;
  caveats: string[];
}

export interface ModelMetrics {
  model_name: string;
  mae: number;
  rmse: number;
  r2: number;
  best_model: boolean;
  features_used: string[];
  feature_importances: { feature: string; importance: number }[];
}

export interface ScenarioRunRequest {
  baseline_city?: string;
  custom_inputs?: PredictionRequest;
  interventions: {
    greenness_delta_pct?: number; // e.g. +15%
    energy_reduction_pct?: number; // e.g. -20%
    target_land_cover?: 'Water' | 'Green Space' | 'Industrial' | 'Urban';
  };
}

export interface ScenarioRunResponse {
  baseline_temperature_c: number;
  intervention_temperature_c: number;
  delta_temperature_c: number;
  units: string;
  confidence_interval: [number, number];
  caveats: string[];
}
