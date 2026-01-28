from fastapi import APIRouter, UploadFile, File, HTTPException, status, BackgroundTasks
from typing import Annotated
from solveya.api.models import JobResponse, ErrorResponse
from solveya.api.dependencies import OrchestratorDep
from solveya.core.types import JobStatus

router = APIRouter(tags=["Diagnostics"])

@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit Diagnostic Job",
    description="Submit a binary file for deep cyber-physical diagnostic analysis.",
    responses={400: {"model": ErrorResponse}}
)
async def submit_job(
    orchestrator: OrchestratorDep,
    file: Annotated[UploadFile, File(description="Binary firmware or telemetry file")]
):
    """
    Ingest binary data and spawn a diagnostic pipeline job.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    # Read file content
    # For very large files, streaming to a temp file is better,
    # but for this iteration we read into memory as per Orchestrator design taking bytes.
    # Tier 1 requires `bytes` for parsing.
    try:
        data = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Empty file submitted")

    # Submit to orchestrator
    job_id = await orchestrator.submit_job(data)

    return JobResponse(
        job_id=job_id,
        status=JobStatus.PENDING,
        submitted_at=orchestrator.jobs[job_id]["submitted_at"]
    )

@router.get(
    "/{job_id}",
    response_model=JobResponse,
    summary="Get Job Status/Result",
    description="Poll for job status or retrieve final diagnostic results.",
    responses={404: {"model": ErrorResponse}}
)
async def get_job_status(
    job_id: str,
    orchestrator: OrchestratorDep
):
    """
    Retrieve the status and results of a diagnostic job.
    """
    status = orchestrator.get_job_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")

    result = None
    if status == JobStatus.COMPLETED:
        result = orchestrator.get_result(job_id)

    job_info = orchestrator.jobs.get(job_id)

    return JobResponse(
        job_id=job_id,
        status=status,
        submitted_at=job_info["submitted_at"] if job_info else None,
        result=result
    )
