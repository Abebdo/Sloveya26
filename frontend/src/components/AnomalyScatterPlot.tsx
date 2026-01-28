import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  Cell
} from 'recharts';
import { DiagnosticResult, AnomalyResult } from '../types/diagnostic';

interface AnomalyScatterPlotProps {
  result: DiagnosticResult;
}

export const AnomalyScatterPlot: React.FC<AnomalyScatterPlotProps> = ({ result }) => {
  // We visualize the "Entropy Space" (Global Entropy vs Variance)
  // and mark the point as Anomaly or Normal based on detectors.

  const { entropy_profile, anomaly_results } = result;

  const isAnomaly = anomaly_results.some(r => r.is_anomaly);
  const maxScore = Math.max(...anomaly_results.map(r => Math.abs(r.score)), 0.1);

  // Data point representing this file
  const data = [
    {
      x: entropy_profile.global_entropy,
      y: entropy_profile.windowed_entropy_variance,
      z: maxScore, // Bubble size based on anomaly score magnitude
      name: result.job_id,
      status: isAnomaly ? 'Anomaly' : 'Normal',
      detectors: anomaly_results.map(r => `${r.detector_name}: ${r.is_anomaly ? 'ABNORMAL' : 'OK'} (${r.score.toFixed(3)})`).join(', ')
    }
  ];

  // Mock reference data for "Normal" zone visualization (context)
  // In a real system, this would come from a baseline dataset
  const referenceData = [
    { x: 7.5, y: 0.1, z: 0.1, status: 'Reference' },
    { x: 7.2, y: 0.2, z: 0.1, status: 'Reference' },
    { x: 7.8, y: 0.05, z: 0.1, status: 'Reference' },
    { x: 6.5, y: 0.5, z: 0.1, status: 'Reference' },
    { x: 5.0, y: 2.0, z: 0.1, status: 'Reference' }, // Encrypted/Compressed usually high entropy, low variance
    // High variance implies structured mixed with unstructured
  ];

  return (
    <div className="w-full h-[300px] p-4 bg-card rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-primary mb-2">Entropy Space Projection</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="x"
            name="Global Entropy"
            unit=" bits"
            domain={[0, 8]}
            stroke="hsl(var(--foreground))"
            label={{ value: 'Global Entropy', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Entropy Variance"
            stroke="hsl(var(--foreground))"
            label={{ value: 'Variance', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis type="number" dataKey="z" range={[100, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            formatter={(value: any, name: any, props: any) => {
                if (name === 'z') return null;
                return value;
            }}
          />
          <Legend />

          <Scatter name="Current Job" data={data} shape="circle">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.status === 'Anomaly' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
              />
            ))}
          </Scatter>

          {/* Reference points to show context */}
          <Scatter name="Baseline Context" data={referenceData} fill="hsl(var(--muted-foreground))" shape="cross" opacity={0.5} />

        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-muted-foreground">
        {data[0].detectors}
      </div>
    </div>
  );
};
