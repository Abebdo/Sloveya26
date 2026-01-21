import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue/50";
  
  const variants = {
    primary: "bg-brand-navy text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-brand-navy/20 border border-transparent",
    secondary: "bg-white text-brand-navy hover:bg-slate-50 border border-brand-border shadow-sm hover:border-brand-blue/30",
    outline: "bg-transparent text-brand-navy border border-brand-navy/20 hover:bg-brand-navy/5",
    ghost: "bg-transparent text-slate-500 hover:text-brand-navy hover:bg-slate-100/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
