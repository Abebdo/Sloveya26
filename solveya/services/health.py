import time
import psutil
from typing import Optional, Callable, Dict, Any
from solveya.core.types import SystemTelemetry, HealthStatus

class HealthMonitor:
    """
    Service for monitoring system health and collecting telemetry.
    """

    def __init__(self, metrics_provider: Optional[Callable[[], Dict[str, int]]] = None):
        """
        Initialize HealthMonitor.

        Args:
            metrics_provider: Optional callback to fetch application specific metrics
                              (e.g. queue depth, active jobs).
                              Expected keys: 'active_jobs', 'queue_depth'.
        """
        self.metrics_provider = metrics_provider

    def get_system_telemetry(self) -> SystemTelemetry:
        """
        Collects real-time system telemetry.
        """
        cpu = psutil.cpu_percent(interval=None)
        memory = psutil.virtual_memory().percent

        active_jobs = 0
        queue_depth = 0

        if self.metrics_provider:
            metrics = self.metrics_provider()
            active_jobs = metrics.get('active_jobs', 0)
            queue_depth = metrics.get('queue_depth', 0)

        return SystemTelemetry(
            cpu_usage=cpu,
            memory_usage=memory,
            active_jobs=active_jobs,
            queue_depth=queue_depth,
            timestamp=time.time()
        )

    def check_health(self) -> HealthStatus:
        """
        Determines the overall system health status.
        """
        telemetry = self.get_system_telemetry()

        # Simple heuristics
        if telemetry.cpu_usage > 90.0 or telemetry.memory_usage > 90.0:
            return HealthStatus.UNHEALTHY

        if telemetry.cpu_usage > 75.0 or telemetry.memory_usage > 75.0:
            return HealthStatus.DEGRADED

        return HealthStatus.HEALTHY
