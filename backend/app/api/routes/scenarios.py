from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Literal
from app.services.inference_service import inference_service
from app.api.routes.models import PredictInput

router = APIRouter()

class ScenarioRunRequest(BaseModel):
    baseline_inputs: Optional[PredictInput] = None
    scenario_inputs: PredictInput

@router.post("/scenarios/run")
def run_scenario(payload: ScenarioRunRequest):
    try:
        baseline_data = payload.baseline_inputs.model_dump() if payload.baseline_inputs else PredictInput().model_dump()
        scenario_data = payload.scenario_inputs.model_dump()

        base_res = inference_service.predict(baseline_data)
        scen_res = inference_service.predict(scenario_data)

        b_temp = base_res["predicted_temperature_c"]
        s_temp = scen_res["predicted_temperature_c"]
        delta = round(s_temp - b_temp, 2)

        is_ood = scenario_data["urban_greenness_ratio"] > 60.0 or scenario_data["energy_consumption_kwh"] > 50000.0

        caveats = [
            "Sensitivity analysis derived from supervised regressor on cross-sectional benchmark data.",
            "Observational associations do not establish physical microscale thermodynamic causality.",
        ]
        if is_ood:
            caveats.append("One or more intervention parameters exceed the observed dataset envelope.")

        return {
            "baseline_temperature_c": b_temp,
            "intervention_temperature_c": s_temp,
            "delta_temperature_c": delta,
            "units": "°C",
            "is_out_of_distribution": is_ood,
            "model_version": base_res["model_version"],
            "caveats": caveats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
