export interface CityRecord {
  'City Name': string;
  City: string;
  State: string;
  Latitude: number;
  Longitude: number;
  Year: number;
  Month: string;
  NDVI: number;
  NDBI: number;
  NDWI: number;
  'Elevation (m)': number;
  'Temperature (°C)': number;
  'LST (°C)': number;
  'Urban Greenness Ratio (%)': number;
  'Land Cover': string;
}

export interface DatasetMetadata {
  dataset_name: string;
  coverage: string;
  time_range: string;
  cities_count: number;
  states_count: number;
  total_rows: number;
  total_columns: number;
  target_variable: string;
  target_units: string;
  columns: { name: string; type: string; units: string }[];
}

export interface DatasetSummary {
  total_observations: number;
  unique_cities: number;
  target_variable: string;
  mean_lst: number;
  mean_ndvi: number;
  mean_ndbi: number;
  mean_ndwi: number;
  state_distribution_top10: Record<string, number>;
  year_distribution: Record<string, number>;
}

export interface ModelPredictionRequest {
  month: string;
  state: string;
  ndvi: number;
  ndbi: number;
  ndwi: number;
  elevation_m: number;
  latitude?: number;
  longitude?: number;
  year?: number;
}

export interface ModelPredictionResponse {
  predicted_lst_c: number;
  predicted_temperature_c: number;
  units: string;
  model_name: string;
  model_version: string;
  target: string;
  r2_score: number;
  mae_c: number;
  feature_contributions?: Record<string, number>;
  caveats: string[];
}

export interface ModelMetrics {
  best_model: string;
  target: string;
  test_samples: number;
  models: Record<string, { mae: number; rmse: number; r2: number }>;
  feature_importances: { feature: string; importance: number }[];
}

export interface ScenarioRunRequest {
  baseline_inputs: ModelPredictionRequest;
  scenario_inputs: ModelPredictionRequest;
}

export interface ScenarioRunResponse {
  baseline_lst_c: number;
  intervention_lst_c: number;
  delta_lst_c: number;
  units: string;
  caveats: string[];
}
