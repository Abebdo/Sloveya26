import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  Legend
} from 'recharts';
import { EntropyProfile } from '../types/diagnostic';

interface EntropyVisualizerProps {
  profile: EntropyProfile;
}

export const EntropyVisualizer: React.FC<EntropyVisualizerProps> = ({ profile }) => {
  // Generate a normal distribution curve based on mean and variance
  // to visualize the entropy distribution across the file.
  const distributionData = useMemo(() => {
    if (!profile) return [];

    const mean = profile.windowed_entropy_mean;
    const stdDev = Math.sqrt(profile.windowed_entropy_variance);
    const min = Math.max(0, profile.windowed_entropy_min); // Entropy >= 0
    const max = Math.min(8, profile.windowed_entropy_max); // Entropy <= 8 bits

    // Generate points
    const points = [];
    const steps = 100;
    const range = 8.0; // Total possible range 0-8

    for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * range;

        // Gaussian function
        let y = 0;
        if (stdDev > 0) {
            y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        } else if (Math.abs(x - mean) < 0.1) {
            y = 10; // Spike if variance is 0
        }

        points.push({ x, density: y });
    }
    return points;
  }, [profile]);

  if (!profile) return <div className="text-muted text-sm">No profile data available.</div>;

  return (
    <div className="w-full h-[300px] p-4 bg-card rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-primary mb-2">Shannon Entropy Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={distributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 8]}
            label={{ value: 'Entropy (bits)', position: 'insideBottom', offset: -10 }}
            stroke="hsl(var(--foreground))"
            tickFormatter={(val) => val.toFixed(1)}
          />
          <YAxis
            label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
            stroke="hsl(var(--foreground))"
            hide
          />
          <Tooltip
            formatter={(value: number) => [value.toFixed(4), 'Density']}
            labelFormatter={(label: number) => `Entropy: ${label.toFixed(2)} bits`}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
          />

          {/* Distribution Area */}
          <Area
            type="monotone"
            dataKey="density"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />

          {/* Global Entropy Marker */}
          <ReferenceLine x={profile.global_entropy} stroke="hsl(var(--secondary))" strokeDasharray="5 5" label="Global" />

          {/* Min/Max Markers */}
          <ReferenceLine x={profile.windowed_entropy_min} stroke="hsl(var(--destructive))" label="Min" />
          <ReferenceLine x={profile.windowed_entropy_max} stroke="hsl(var(--destructive))" label="Max" />

        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-2 text-xs text-muted-foreground">
        <span>Mean: {profile.windowed_entropy_mean.toFixed(3)}</span>
        <span>Var: {profile.windowed_entropy_variance.toFixed(3)}</span>
        <span>Global: {profile.global_entropy.toFixed(3)}</span>
      </div>
    </div>
  );
};
