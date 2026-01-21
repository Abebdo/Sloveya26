import React from 'react';
import type { AnalysisResult } from '../../lib/types';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface HeatmapProps {
  text: string;
  highlights: AnalysisResult['highlightIndices'];
}

export const HeatmapHighlighter: React.FC<HeatmapProps> = ({ text, highlights }) => {
  if (!highlights || highlights.length === 0) {
    return <p className="whitespace-pre-wrap text-slate-600 leading-relaxed text-sm md:text-base">{text}</p>;
  }

  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sortedHighlights = [...highlights].sort((a, b) => b.phrase.length - a.phrase.length);
  const pattern = new RegExp(`(${sortedHighlights.map(h => escapeRegExp(h.phrase)).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm md:text-base leading-loose whitespace-pre-wrap shadow-inner text-slate-700">
      {parts.map((part, i) => {
        const match = sortedHighlights.find(h => h.phrase.toLowerCase() === part.toLowerCase());
        
        if (match) {
          const colorClass = match.type === 'DANGER' 
            ? 'bg-red-100 text-red-700 border-b-2 border-red-400 cursor-help' 
            : 'bg-amber-100 text-amber-700 border-b-2 border-amber-400 cursor-help';

          return (
            <motion.span
              key={i}
              initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
              animate={{ backgroundColor: match.type === 'DANGER' ? '#fee2e2' : '#fef3c7' }} // red-100 / amber-100
              className={cn("relative group px-1 rounded mx-0.5 font-semibold", colorClass)}
            >
              {part}
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 rounded-xl text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl leading-normal text-center">
                {match.explanation}
                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </span>
            </motion.span>
          );
        }
        return <span key={i} className="text-slate-600">{part}</span>;
      })}
    </div>
  );
};
