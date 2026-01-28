import React, { useCallback } from 'react';
import { useDiagnosticJob } from '../hooks/useDiagnosticJob';
import { useWebSocket } from '../hooks/useWebSocket';
import { EntropyVisualizer } from './EntropyVisualizer';
import { AnomalyScatterPlot } from './AnomalyScatterPlot';
import { BinaryInspector } from './BinaryInspector';
import { Upload, AlertCircle, Activity, Cpu, Server, CheckCircle, Clock, XCircle } from 'lucide-react';
import clsx from 'clsx';

export const DiagnosticDashboard: React.FC = () => {
  const { job, result, isLoading, error, submit, reset } = useDiagnosticJob();
  const { telemetry, isConnected } = useWebSocket();

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        submit(e.target.files[0]);
    }
  }, [submit]);

  const StatusIcon = () => {
    if (!job) return null;
    switch (job.status) {
        case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
        case 'processing': return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
        case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans">
      {/* Header / Telemetry Bar */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">SOLVEYA <span className="text-foreground font-light opacity-50">DIAGNOSTICS</span></h1>
            <p className="text-muted-foreground text-sm mt-1">Cyber-Physical Anomaly Detection Engine</p>
        </div>

        {/* System Status */}
        <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 bg-card p-3 rounded border border-border">
                <Server className={clsx("w-4 h-4", isConnected ? "text-green-500" : "text-red-500")} />
                <span className="text-muted-foreground">Gateway:</span>
                <span className={clsx("font-mono font-bold", isConnected ? "text-green-500" : "text-red-500")}>
                    {isConnected ? "ONLINE" : "OFFLINE"}
                </span>
            </div>
            {telemetry && (
                <>
                    <div className="flex items-center gap-2 bg-card p-3 rounded border border-border">
                        <Cpu className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">CPU:</span>
                        <span className="font-mono font-bold text-foreground">{telemetry.cpu_usage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card p-3 rounded border border-border">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Jobs:</span>
                        <span className="font-mono font-bold text-foreground">{telemetry.active_jobs}</span>
                    </div>
                </>
            )}
        </div>
      </header>

      <main className="space-y-6">
        {/* Upload / Control Panel */}
        <section className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden transition-all hover:border-primary/50">
           {!job && (
               <label className="cursor-pointer flex flex-col items-center gap-3 group z-10">
                   <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                       <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <div className="text-center">
                       <p className="text-lg font-medium group-hover:text-primary transition-colors">Upload Firmware / Telemetry</p>
                       <p className="text-sm text-muted-foreground">Supports binary formats up to 1GB</p>
                   </div>
                   <input type="file" className="hidden" onChange={handleFileUpload} disabled={isLoading} />
               </label>
           )}

           {job && (
               <div className="w-full max-w-2xl">
                   <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                           <StatusIcon />
                           <div>
                               <p className="font-medium text-lg">Job ID: <span className="font-mono text-muted-foreground">{job.job_id.slice(0, 8)}...</span></p>
                               <p className="text-xs text-muted-foreground capitalize">{job.status}</p>
                           </div>
                       </div>
                       {job.status === 'completed' || job.status === 'failed' ? (
                           <button onClick={reset} className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded transition-colors">
                               Analyze Another
                           </button>
                       ) : null}
                   </div>

                   {/* Progress Bar Mockup */}
                   {(job.status === 'processing' || job.status === 'pending') && (
                       <div className="w-full h-1 bg-muted rounded overflow-hidden">
                           <div className="h-full bg-primary animate-progress-indeterminate" />
                       </div>
                   )}

                   {error && (
                       <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded flex items-center gap-2 text-red-200 text-sm">
                           <AlertCircle className="w-4 h-4" />
                           {error}
                       </div>
                   )}
               </div>
           )}
        </section>

        {/* Results Grid */}
        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <EntropyVisualizer profile={result.entropy_profile} />
                <AnomalyScatterPlot result={result} />
                <div className="lg:col-span-2">
                    <BinaryInspector result={result} />
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
