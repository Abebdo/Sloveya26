import asyncio
import uuid
import time
from datetime import datetime
from typing import Dict, Any, Optional, AsyncIterator, List, Tuple
from dataclasses import dataclass, field

from solveya.core.types import (
    DiagnosticResult, EntropyProfile, AnomalyResult, HealthStatus, JobStatus
)
from solveya.core.entropy import ShannonEntropyCalculator
from solveya.core.isolation_forest import IsolationForestDetector
from solveya.core.lof import LOFAnalyzer
from solveya.core.binary_parser import BinaryMetadataParser
from solveya.services.pipeline import PipelineStage, DiagnosticPipeline

# Concrete Data Context
@dataclass
class ProcessingContext:
    job_id: str
    data: bytes
    timestamp: datetime
    metadata: Dict[str, Any] = field(default_factory=dict)
    entropy_profile: Optional[EntropyProfile] = None
    anomaly_results: List[AnomalyResult] = field(default_factory=list)

# Concrete Stages

class BinaryParsingStage(PipelineStage):
    def __init__(self, schema: Dict[str, Tuple[str, int]]):
        super().__init__("BinaryParsing")
        self.parser = BinaryMetadataParser(schema)

    async def process(self, context: ProcessingContext) -> ProcessingContext:
        # Try to parse metadata if possible
        try:
            # We assume the data is a single record or file
            # Parsing from offset 0
            if len(context.data) >= self.parser.record_size:
                parsed = self.parser.parse(context.data)
                context.metadata.update(parsed)
        except Exception:
            # If parsing fails, we continue with empty metadata or log
            # For robustness, we don't fail the whole job, just metadata extraction
            context.metadata["parsing_error"] = True

        return context

    async def health_check(self) -> HealthStatus:
        return HealthStatus.HEALTHY

class EntropyStage(PipelineStage):
    def __init__(self):
        super().__init__("EntropyCalculation")
        self.calculator = ShannonEntropyCalculator()
        # Binary parser also has get_entropy_profile helper,
        # but we can implement it here directly using the core calculator
        # to ensure separation of concerns if parser is just for metadata.
        # Actually BinaryMetadataParser has get_entropy_profile.
        # Let's use the core component directly here as per Layer 1 usage.

    async def process(self, context: ProcessingContext) -> ProcessingContext:
        # Calculate full profile
        # We need to replicate logic from BinaryMetadataParser.get_entropy_profile
        # or instantiate a parser just for that?
        # The core `ShannonEntropyCalculator` provides raw calc methods.
        # Let's implement profile generation here.

        data = context.data
        global_ent = self.calculator.calculate(data)
        rate = self.calculator.entropy_rate(data)

        # Windowed
        window_size = 256
        step = 128
        if len(data) < window_size:
            window_size = max(1, len(data))
            step = max(1, len(data))

        windowed = self.calculator.calculate_windowed(data, window_size, step)

        import statistics
        if windowed:
            mean = statistics.mean(windowed)
            var = statistics.variance(windowed) if len(windowed) > 1 else 0.0
            mn = min(windowed)
            mx = max(windowed)
        else:
            mean = var = mn = mx = 0.0

        context.entropy_profile = EntropyProfile(
            global_entropy=global_ent,
            entropy_rate=rate,
            windowed_entropy_mean=mean,
            windowed_entropy_variance=var,
            windowed_entropy_min=mn,
            windowed_entropy_max=mx
        )
        return context

    async def health_check(self) -> HealthStatus:
        return HealthStatus.HEALTHY

class AnomalyStage(PipelineStage):
    def __init__(self, iso_forest: IsolationForestDetector, lof: LOFAnalyzer):
        super().__init__("AnomalyDetection")
        self.iso_forest = iso_forest
        self.lof = lof

    async def process(self, context: ProcessingContext) -> ProcessingContext:
        # Anomaly detection requires feature extraction.
        # For raw binary data, we usually use entropy features or metadata features.
        # We will construct a feature vector from the EntropyProfile.

        if not context.entropy_profile:
            return context

        features = [
            context.entropy_profile.global_entropy,
            context.entropy_profile.windowed_entropy_mean,
            context.entropy_profile.windowed_entropy_variance,
            context.entropy_profile.windowed_entropy_min,
            context.entropy_profile.windowed_entropy_max
        ]

        # Reshape for sklearn (1, n_features)
        # Using numpy implicitly handled by core wrappers?
        # Wrappers expect np.ndarray.
        import numpy as np
        X = np.array([features])

        # Isolation Forest
        try:
            # We use decision_function (lower is more abnormal usually, or opposite depending on impl)
            # Wrapper get_anomaly_scores returns dict
            # Run in thread pool as per requirements
            iso_scores = await asyncio.to_thread(self.iso_forest.get_anomaly_scores, X)

            context.anomaly_results.append(AnomalyResult(
                detector_name="IsolationForest",
                score=iso_scores["scores"][0],
                is_anomaly=iso_scores["predictions"][0] == -1,
                details={"probability": iso_scores.get("anomaly_probability", [0])[0]}
            ))
        except RuntimeError:
            # Model not fitted
            pass

        # LOF
        try:
            # LOF novelty detection
            if self.lof.novelty:
                # Run in thread pool
                pred = await asyncio.to_thread(self.lof.predict, X)

                context.anomaly_results.append(AnomalyResult(
                    detector_name="LOF",
                    score=0.0, # Not available
                    is_anomaly=pred[0] == -1,
                    details={}
                ))
        except RuntimeError:
            pass

        return context

    async def health_check(self) -> HealthStatus:
        return HealthStatus.HEALTHY

class Orchestrator:
    """
    High-level service orchestrator.
    Manages the diagnostic pipeline, job submission, and results.
    """

    DEFAULT_SCHEMA = {
        "magic": (">I", 0),      # 4 bytes magic
        "version": (">H", 4),    # 2 bytes version
        "flags": (">H", 6),      # 2 bytes flags
        "timestamp": (">d", 8),  # 8 bytes double
        "device_id": (">Q", 16), # 8 bytes ulong
        "seq_num": (">I", 24)    # 4 bytes uint
    }

    def __init__(self):
        # Initialize Core Components
        self.iso_forest = IsolationForestDetector()
        self.lof = LOFAnalyzer(novelty=True) # Use novelty mode for inference

        # Initialize Stages
        stages = [
            BinaryParsingStage(self.DEFAULT_SCHEMA),
            EntropyStage(),
            AnomalyStage(self.iso_forest, self.lof)
        ]

        # Initialize Pipeline
        self.pipeline = DiagnosticPipeline(stages, max_concurrent=20)

        # Job State
        self.jobs: Dict[str, Dict[str, Any]] = {} # id -> info
        self.results: Dict[str, DiagnosticResult] = {}

        # Internal Queue for Pipeline Feed
        self._input_queue: asyncio.Queue[Tuple[str, bytes]] = asyncio.Queue()
        self._output_task: Optional[asyncio.Task] = None

    async def start(self):
        """Starts the orchestration loop."""
        # Start pipeline execution
        # execute returns an AsyncIterator of results
        # We need to consume it
        self._output_task = asyncio.create_task(self._consume_results())

    async def _consume_results(self):
        """Consumes results from the pipeline."""

        # We need an adapter iterator to feed the pipeline.
        async def context_adapter():
            while True:
                item = await self._input_queue.get()
                job_id, data = item
                yield ProcessingContext(
                    job_id=job_id,
                    data=data,
                    timestamp=datetime.now()
                )

        result_stream = self.pipeline.execute(context_adapter())

        async for result_context in result_stream:
            # result_context should be ProcessingContext (as it flows through stages)

            if isinstance(result_context, ProcessingContext):
                diag_result = DiagnosticResult(
                    job_id=result_context.job_id,
                    timestamp=result_context.timestamp,
                    entropy_profile=result_context.entropy_profile, # type: ignore
                    anomaly_results=result_context.anomaly_results,
                    metadata=result_context.metadata
                )
                self.results[diag_result.job_id] = diag_result
                if diag_result.job_id in self.jobs:
                    self.jobs[diag_result.job_id]["status"] = JobStatus.COMPLETED

    async def submit_job(self, data: bytes) -> str:
        """Submits a new diagnostic job."""
        job_id = str(uuid.uuid4())
        self.jobs[job_id] = {
            "id": job_id,
            "status": JobStatus.PENDING,
            "submitted_at": datetime.now()
        }
        await self._input_queue.put((job_id, data))
        self.jobs[job_id]["status"] = JobStatus.PROCESSING
        return job_id

    def get_job_status(self, job_id: str) -> Optional[JobStatus]:
        job = self.jobs.get(job_id)
        if job:
            return job["status"]
        return None

    def get_result(self, job_id: str) -> Optional[DiagnosticResult]:
        return self.results.get(job_id)

    async def shutdown(self):
        await self.pipeline.shutdown()
        if self._output_task:
            self._output_task.cancel()
            try:
                await self._output_task
            except asyncio.CancelledError:
                pass
