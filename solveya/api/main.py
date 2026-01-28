from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from solveya.api.routes import health, diagnostics, anomalies, telemetry
from solveya.api.dependencies import get_orchestrator

# Rate Limiting Configuration
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown of background services (Orchestrator).
    """
    orchestrator = get_orchestrator()
    await orchestrator.start()
    yield
    await orchestrator.shutdown()

def create_application() -> FastAPI:
    """
    FastAPI Application Factory.
    """
    app = FastAPI(
        title="Solveya Cyber-Physical Diagnostic Engine",
        description="National-grade binary analysis and anomaly detection platform.",
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/api/docs",
        openapi_url="/api/openapi.json"
    )

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # In production, restrict to frontend domain
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rate Limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Routers
    api_prefix = "/api/v1"
    app.include_router(health.router, prefix=f"{api_prefix}/health")
    app.include_router(diagnostics.router, prefix=f"{api_prefix}/diagnostics")
    app.include_router(anomalies.router, prefix=f"{api_prefix}/anomalies")
    app.include_router(telemetry.router, prefix=f"{api_prefix}/telemetry")

    return app

# Main entry point for uvicorn
app = create_application()
