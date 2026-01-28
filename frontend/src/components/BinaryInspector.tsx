import React from 'react';
import { DiagnosticResult } from '../types/diagnostic';
import { FileCode, Activity, Tag, Layers } from 'lucide-react';

interface BinaryInspectorProps {
  result: DiagnosticResult;
}

export const BinaryInspector: React.FC<BinaryInspectorProps> = ({ result }) => {
  const { metadata } = result;

  // Flatten metadata for display
  const entries = Object.entries(metadata);

  return (
    <div className="w-full bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <FileCode className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold text-foreground">Binary Metadata Inspector</h3>
      </div>

      <div className="p-0">
        {entries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
                No metadata extracted.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Parsed Fields */}
                <div className="p-4">
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Parsed Fields
                    </h4>
                    <div className="space-y-3 font-mono text-sm">
                        {entries.map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start border-b border-border/50 pb-2 last:border-0">
                                <span className="text-secondary">{key}</span>
                                <span className="text-foreground text-right break-all">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simulated Hex Structure (Visual representation of the parsed schema) */}
                <div className="p-4 bg-muted/20">
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Structural Layout
                    </h4>
                    <div className="space-y-2">
                        {entries.map(([key, value], index) => (
                            <div key={key} className="flex items-center gap-3 group">
                                <div className="w-12 text-xs text-muted-foreground font-mono">
                                    {`0x${(index * 4).toString(16).padStart(4, '0').toUpperCase()}`}
                                </div>
                                <div className="flex-1 h-8 bg-card border border-border rounded flex items-center px-3 font-mono text-xs text-primary group-hover:border-primary transition-colors cursor-help" title={String(value)}>
                                    <span className="opacity-50 mr-2">[{key}]</span>
                                    <span className="truncate">{String(value)}</span>
                                </div>
                            </div>
                        ))}
                         <div className="flex items-center gap-3 opacity-50">
                                <div className="w-12 text-xs text-muted-foreground font-mono">...</div>
                                <div className="flex-1 h-8 border border-dashed border-border rounded flex items-center px-3 font-mono text-xs text-muted-foreground">
                                    Payload Data
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
