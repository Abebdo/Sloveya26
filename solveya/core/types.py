from enum import Enum
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional
from datetime import datetime
from solveya.core.binary_parser import EntropyProfile

class HealthStatus(str, Enum):
    """
    System component health status.
    """
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"

class JobStatus(str, Enum):
    """
    Diagnostic job execution status.
    """
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class AnomalyResult:
    """
    Result from a single anomaly detector.
    """
    detector_name: str
    score: float
    is_anomaly: bool
    details: Dict[str, Any] = field(default_factory=dict)

@dataclass
class DiagnosticResult:
    """
    Aggregated result of the diagnostic pipeline.
    """
    job_id: str
    timestamp: datetime
    entropy_profile: EntropyProfile
    anomaly_results: List[AnomalyResult]
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class SystemTelemetry:
    """
    Real-time system telemetry data.
    """
    cpu_usage: float
    memory_usage: float
    active_jobs: int
    queue_depth: int
    timestamp: float
