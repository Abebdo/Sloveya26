export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface SystemTelemetry {
    cpu_usage: number;
    memory_usage: number;
    active_jobs: number;
    queue_depth: number;
    timestamp: number;
}

export interface EntropyProfile {
    global_entropy: number;
    entropy_rate: number;
    windowed_entropy_mean: number;
    windowed_entropy_variance: number;
    windowed_entropy_min: number;
    windowed_entropy_max: number;
}

export interface AnomalyResult {
    detector_name: string;
    score: number;
    is_anomaly: boolean;
    details: Record<string, any>;
}

export interface DiagnosticResult {
    job_id: string;
    timestamp: string; // ISO string from datetime
    entropy_profile: EntropyProfile;
    anomaly_results: AnomalyResult[];
    metadata: Record<string, any>;
}

export interface JobResponse {
    job_id: string;
    status: JobStatus;
    submitted_at?: string;
    result?: DiagnosticResult;
}

export interface HealthResponse {
    status: HealthStatus;
    telemetry: SystemTelemetry;
    version: string;
}
