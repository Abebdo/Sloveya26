import React from 'react';
import { motion } from 'framer-motion';

interface RiskMeterProps {
  score: number; // 0-100
  level: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, level }) => {
  // Color calculation based on score
  const getColor = (s: number) => {
    if (s < 20) return '#10b981'; // Brand Green (Safe)
    if (s < 50) return '#f59e0b'; // Amber (Warning)
    if (s < 80) return '#f97316'; // Orange (High)
    return '#ef4444'; // Red (Critical)
  };

  const color = getColor(score);
  
  // SVG Arc calculations
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle */}
          <motion.circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="drop-shadow-sm"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-5xl font-extrabold tracking-tighter text-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {score}%
          </motion.span>
          <span className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-bold">Risk Score</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 px-4 py-1.5 rounded-full border border-slate-100 bg-white shadow-sm"
        style={{ color: color, borderColor: `${color}30` }}
      >
        <span className="font-bold tracking-wider text-sm">{level}</span>
      </motion.div>
    </div>
  );
};
