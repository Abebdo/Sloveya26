from fastapi import APIRouter, status, HTTPException, Response
from solveya.api.models import HealthResponse
from solveya.api.dependencies import HealthMonitorDep
from solveya.core.types import HealthStatus

router = APIRouter(tags=["Health"])

@router.get(
    "",
    response_model=HealthResponse,
    summary="Get System Health",
    description="Returns detailed system health status and telemetry."
)
async def get_health(monitor: HealthMonitorDep):
    """
    Get the overall health status of the Solveya engine.
    """
    health_status = monitor.check_health()
    telemetry = monitor.get_system_telemetry()
    return HealthResponse(status=health_status, telemetry=telemetry)

@router.get(
    "/live",
    summary="Liveness Probe",
    description="Simple probe to check if the service is running."
)
async def liveness():
    return {"status": "ok"}

@router.get(
    "/ready",
    summary="Readiness Probe",
    description="Checks if the service is ready to accept traffic."
)
async def readiness(monitor: HealthMonitorDep, response: Response):
    health_status = monitor.check_health()
    if health_status == HealthStatus.UNHEALTHY:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {"status": "unhealthy", "detail": "System is in unhealthy state"}
    return {"status": "ready"}
