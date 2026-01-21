import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverEffect = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-white rounded-[24px] border border-brand-border/60 shadow-sm overflow-hidden",
        hoverEffect && "hover:shadow-xl hover:shadow-brand-blue/5 hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
