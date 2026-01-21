import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className }) => {
  const variants = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider shadow-sm",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
