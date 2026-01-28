from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Annotated
import numpy as np
from solveya.api.models import AnomalyResultModel, ErrorResponse
from solveya.api.dependencies import OrchestratorDep
from solveya.core.entropy import ShannonEntropyCalculator
from solveya.core.types import AnomalyResult, EntropyProfile

router = APIRouter(tags=["Anomalies"])

@router.post(
    "/detect",
    response_model=List[AnomalyResultModel],
    summary="Synchronous Anomaly Detection",
    description="Perform immediate anomaly detection on a binary segment without full pipeline overhead.",
    responses={400: {"model": ErrorResponse}}
)
async def detect_anomalies(
    orchestrator: OrchestratorDep,
    file: Annotated[UploadFile, File(description="Binary segment")]
):
    """
    Directly invoke anomaly detectors on uploaded data.
    """
    try:
        data = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if not data:
        raise HTTPException(status_code=400, detail="Empty data")

    # 1. Feature Extraction (Entropy)
    # We must replicate the feature extraction logic from AnomalyStage to ensure consistency
    calculator = ShannonEntropyCalculator()
    global_ent = calculator.calculate(data)

    window_size = 256
    step = 128
    if len(data) < window_size:
        window_size = max(1, len(data))
        step = max(1, len(data))

    windowed = calculator.calculate_windowed(data, window_size, step)

    import statistics
    if windowed:
        mean = statistics.mean(windowed)
        var = statistics.variance(windowed) if len(windowed) > 1 else 0.0
        mn = min(windowed)
        mx = max(windowed)
    else:
        mean = var = mn = mx = 0.0

    features = [global_ent, mean, var, mn, mx]
    X = np.array([features])

    results = []

    # 2. Isolation Forest
    try:
        iso_scores = orchestrator.iso_forest.get_anomaly_scores(X)
        results.append(AnomalyResult(
            detector_name="IsolationForest",
            score=iso_scores["scores"][0],
            is_anomaly=iso_scores["predictions"][0] == -1,
            details={"probability": iso_scores.get("anomaly_probability", [0])[0]}
        ))
    except RuntimeError:
        # Model not fitted
        pass

    # 3. LOF
    try:
        if orchestrator.lof.novelty:
            pred = orchestrator.lof.predict(X)
            results.append(AnomalyResult(
                detector_name="LOF",
                score=0.0,
                is_anomaly=pred[0] == -1,
                details={}
            ))
    except RuntimeError:
        pass

    if not results:
        # If no models are fitted or available, return empty list or specific warning?
        # We return empty list as typed.
        pass

    return results
