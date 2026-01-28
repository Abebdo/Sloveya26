from abc import ABC, abstractmethod
from typing import Any, AsyncIterator, List, Optional, Deque
import asyncio
import time
from collections import deque
from dataclasses import dataclass, field
from solveya.core.types import HealthStatus, DiagnosticResult

@dataclass
class PipelineMetrics:
    """
    Metrics for the diagnostic pipeline.
    """
    items_processed: int = 0
    items_failed: int = 0
    total_processing_time: float = 0.0
    current_queue_depth: int = 0
    stage_latencies: dict[str, float] = field(default_factory=dict)

class CircuitBreakerOpen(Exception):
    pass

class CircuitBreaker:
    """
    Simple circuit breaker pattern.
    """
    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.last_failure_time = 0.0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF-OPEN

    def record_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"

    def record_success(self):
        self.failures = 0
        self.state = "CLOSED"

    def allow_request(self) -> bool:
        if self.state == "CLOSED":
            return True
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF-OPEN"
                return True
            return False
        if self.state == "HALF-OPEN":
            # Allow one request to test
            return True
        return True

class PipelineStage(ABC):
    """
    Abstract base class for a processing stage in the pipeline.
    """
    def __init__(self, name: str):
        self.name = name
        self.circuit_breaker = CircuitBreaker()

    @abstractmethod
    async def process(self, data: Any) -> Any:
        """
        Process the input data and return the transformed data.
        """
        pass

    @abstractmethod
    async def health_check(self) -> HealthStatus:
        """
        Check the health of this stage.
        """
        pass

    async def execute_safe(self, data: Any) -> Any:
        """
        Execute process with circuit breaker logic.
        """
        if not self.circuit_breaker.allow_request():
            raise CircuitBreakerOpen(f"Circuit breaker open for stage {self.name}")

        try:
            start = time.time()
            result = await self.process(data)
            duration = time.time() - start
            self.circuit_breaker.record_success()
            return result
        except Exception as e:
            self.circuit_breaker.record_failure()
            raise e

class DiagnosticPipeline:
    """
    Orchestrates the execution of multiple pipeline stages.
    """
    def __init__(self, stages: List[PipelineStage], max_concurrent: int = 10) -> None:
        self.stages = stages
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.metrics = PipelineMetrics()
        self._shutdown_event = asyncio.Event()
        self._active_tasks: set[asyncio.Task] = set()

    async def _process_single_item(self, data: Any) -> Any:
        """
        Process a single item through all stages.
        """
        start_time = time.time()
        current_data = data

        try:
            for stage in self.stages:
                # Basic instrumentation
                stage_start = time.time()
                current_data = await stage.execute_safe(current_data)
                stage_duration = time.time() - stage_start

                # Update metrics (not thread-safe strictly but ok for asyncio if not threaded)
                current = self.metrics.stage_latencies.get(stage.name, 0.0)
                # Simple moving average or accumulation? Let's accumulate for now
                self.metrics.stage_latencies[stage.name] = current + stage_duration

            self.metrics.items_processed += 1
            self.metrics.total_processing_time += (time.time() - start_time)
            return current_data

        except Exception as e:
            self.metrics.items_failed += 1
            # In a real system, we might wrap this in a Result object with error info
            # For now, propagate or return None?
            # The signature says AsyncIterator[DiagnosticResult].
            # If a stage fails, we can't produce a DiagnosticResult unless we wrap the error.
            # We should probably catch and log, or return a failure result if defined.
            # Assuming the last stage produces DiagnosticResult, if we fail earlier, we can't.
            # We will re-raise to be handled by the caller/worker wrapper.
            raise e

    async def execute(self, input_data: AsyncIterator[bytes]) -> AsyncIterator[DiagnosticResult]:
        """
        Execute the pipeline on a stream of input data.
        """
        queue: asyncio.Queue[Any] = asyncio.Queue()

        # Producer coroutine
        async def producer():
            try:
                async for item in input_data:
                    if self._shutdown_event.is_set():
                        break

                    # Acquire semaphore to limit concurrency
                    await self.semaphore.acquire()

                    task = asyncio.create_task(self._worker(item, queue))
                    self._active_tasks.add(task)
                    task.add_done_callback(lambda t: self._active_tasks.discard(t))
                    task.add_done_callback(lambda t: self.semaphore.release())
            except Exception as e:
                # Handle producer error
                pass
            finally:
                # Wait for all tasks to finish?
                # We can't wait here blocks the producer loop.
                # But we should signal end of stream to consumer.
                pass

        async def _worker_wrapper(item, q):
            # This is the task created in producer
            try:
                result = await self._process_single_item(item)
                await q.put(result)
            except Exception as e:
                # Depending on requirements, we might yield a failure object or skip.
                # Spec implies DiagnosticResult.
                # If exception, we skip yielding to queue? Or yield error?
                # We'll skip for now or log.
                pass

        # We need to adapt the structure.
        # Ideally:
        # 1. Start a task that iterates input and spawns workers.
        # 2. Yield from the queue.
        # 3. Detect when to stop.

        # To detect completion:
        # Producer finishes -> wait for active tasks -> put sentinel in queue.

        async def producer_lifecycle():
            await producer()
            # Wait for all active tasks to complete
            if self._active_tasks:
                await asyncio.wait(self._active_tasks)
            # Signal end
            await queue.put(None)

        producer_task = asyncio.create_task(producer_lifecycle())

        while True:
            result = await queue.get()
            if result is None:
                break
            yield result

        await producer_task

    async def _worker(self, item: Any, queue: asyncio.Queue) -> None:
        """Internal worker wrapper."""
        try:
            result = await self._process_single_item(item)
            if isinstance(result, DiagnosticResult):
                await queue.put(result)
            else:
                # If pipeline didn't produce DiagnosticResult (configuration error?), skip or error.
                # We assume correct configuration.
                # But if intermediate result, we can't yield it.
                # We'll assume the pipeline is configured to return DiagnosticResult.
                # But strict type check:
                await queue.put(result)
        except Exception:
            # Failure is recorded in metrics. We don't yield failed results here.
            pass

    async def shutdown(self, timeout: float = 30.0) -> None:
        """
        Gracefully shutdown the pipeline.
        """
        self._shutdown_event.set()

        if self._active_tasks:
            # Wait for active tasks with timeout
            done, pending = await asyncio.wait(self._active_tasks, timeout=timeout)

            # Cancel pending
            for task in pending:
                task.cancel()
