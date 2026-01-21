import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2 p-2 bg-slate-100/50 backdrop-blur-sm rounded-[24px] border border-white/50 shadow-inner", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-6 py-3 rounded-[20px] text-sm font-bold transition-all duration-300 z-10 flex items-center gap-2",
              isActive ? "text-brand-blue shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-[20px] shadow-md border border-slate-100 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.icon && <span className={isActive ? "text-brand-blue" : "text-slate-400"}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
