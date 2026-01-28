from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime
from solveya.core.types import HealthStatus, JobStatus

class EntropyProfileModel(BaseModel):
    global_entropy: float
    entropy_rate: float
    windowed_entropy_mean: float
    windowed_entropy_variance: float
    windowed_entropy_min: float
    windowed_entropy_max: float

    model_config = ConfigDict(from_attributes=True)

class AnomalyResultModel(BaseModel):
    detector_name: str
    score: float
    is_anomaly: bool
    details: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)

class DiagnosticResultModel(BaseModel):
    job_id: str
    timestamp: datetime
    entropy_profile: Optional[EntropyProfileModel]
    anomaly_results: List[AnomalyResultModel]
    metadata: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)

class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    submitted_at: Optional[datetime] = None
    result: Optional[DiagnosticResultModel] = None

    model_config = ConfigDict(from_attributes=True)

class SystemTelemetryModel(BaseModel):
    cpu_usage: float
    memory_usage: float
    active_jobs: int
    queue_depth: int
    timestamp: float

    model_config = ConfigDict(from_attributes=True)

class HealthResponse(BaseModel):
    status: HealthStatus
    telemetry: SystemTelemetryModel
    version: str = "0.1.0"

    model_config = ConfigDict(from_attributes=True)

class ErrorResponse(BaseModel):
    detail: str
