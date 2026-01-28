from functools import lru_cache
from typing import Annotated, Dict
from fastapi import Depends
from solveya.services.orchestrator import Orchestrator
from solveya.services.health import HealthMonitor
from solveya.core.types import JobStatus

# Global singleton instances
_orchestrator_instance = None
_health_monitor_instance = None

def get_orchestrator() -> Orchestrator:
    """
    Dependency provider for the Orchestrator service (Singleton).
    """
    global _orchestrator_instance
    if _orchestrator_instance is None:
        _orchestrator_instance = Orchestrator()
    return _orchestrator_instance

def get_health_monitor() -> HealthMonitor:
    """
    Dependency provider for the HealthMonitor service (Singleton).
    Injects orchestrator metrics.
    """
    global _health_monitor_instance
    if _health_monitor_instance is None:
        orchestrator = get_orchestrator()

        def metrics_provider() -> Dict[str, int]:
            active = sum(1 for j in orchestrator.jobs.values() if j['status'] == JobStatus.PROCESSING)
            queue_depth = orchestrator._input_queue.qsize()
            return {
                "active_jobs": active,
                "queue_depth": queue_depth
            }

        _health_monitor_instance = HealthMonitor(metrics_provider=metrics_provider)

    return _health_monitor_instance

# Type aliases for dependency injection
OrchestratorDep = Annotated[Orchestrator, Depends(get_orchestrator)]
HealthMonitorDep = Annotated[HealthMonitor, Depends(get_health_monitor)]
