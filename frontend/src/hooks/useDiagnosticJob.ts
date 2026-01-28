import { useState, useCallback, useRef, useEffect } from 'react';
import { submitJob, getJobStatus } from '../services/api';
import { JobResponse, DiagnosticResult } from '../types/diagnostic';

interface UseDiagnosticJobReturn {
  job: JobResponse | null;
  result: DiagnosticResult | null;
  isLoading: boolean;
  error: string | null;
  submit: (file: File) => Promise<void>;
  reset: () => void;
}

export const useDiagnosticJob = (): UseDiagnosticJobReturn => {
  const [job, setJob] = useState<JobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Polling ref
  const pollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimeout.current) {
        clearTimeout(pollTimeout.current);
        pollTimeout.current = null;
    }
  }, []);

  const pollStatus = useCallback(async (jobId: string) => {
    try {
        const jobStatus = await getJobStatus(jobId);
        setJob(jobStatus);

        if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
            stopPolling();
            setIsLoading(false);
        } else {
            // Poll again in 1s
            pollTimeout.current = setTimeout(() => pollStatus(jobId), 1000);
        }
    } catch (err: any) {
        setError(err.message || "Failed to poll job status");
        stopPolling();
        setIsLoading(false);
    }
  }, [stopPolling]);

  const submit = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setJob(null);

    try {
        const response = await submitJob(file);
        setJob(response);

        // Start polling
        pollStatus(response.job_id);
    } catch (err: any) {
        setError(err.message || "Failed to submit job");
        setIsLoading(false);
    }
  }, [pollStatus]);

  const reset = useCallback(() => {
    stopPolling();
    setJob(null);
    setError(null);
    setIsLoading(false);
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    job,
    result: job?.result || null,
    isLoading,
    error,
    submit,
    reset
  };
};
