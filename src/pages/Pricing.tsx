import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Check, X } from 'lucide-react';

export const Pricing = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-500">Protect yourself or your entire organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <Card className="flex flex-col bg-white border-slate-100 shadow-lg">
          <div className="p-6 flex-grow">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic Protection</h3>
            <div className="text-4xl font-extrabold text-brand-blue mb-6">$0</div>
            <p className="text-slate-500 mb-8">Essential tools for individuals.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> 10 Analyses / day
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> Basic Scam Detection
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> Risk Score
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <X className="w-5 h-5" /> Detailed Breakdown
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <X className="w-5 h-5" /> API Access
              </li>
            </ul>
          </div>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full">Get Started</Button>
          </div>
        </Card>

        {/* Pro Tier */}
        <Card className="relative border-brand-blue/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] flex flex-col bg-white transform scale-105 z-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-brand-purple" />
          <div className="p-6 flex-grow">
            <div className="absolute top-4 right-4 bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded">POPULAR</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Shield</h3>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">$9<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <p className="text-slate-500 mb-8">Complete protection for power users.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-800 font-medium">
                <Check className="w-5 h-5 text-brand-blue" /> Unlimited Analyses
              </li>
              <li className="flex items-center gap-3 text-slate-800 font-medium">
                <Check className="w-5 h-5 text-brand-blue" /> Deep Linguistic Analysis
              </li>
              <li className="flex items-center gap-3 text-slate-800 font-medium">
                <Check className="w-5 h-5 text-brand-blue" /> Heatmap & Rewrite
              </li>
              <li className="flex items-center gap-3 text-slate-800 font-medium">
                <Check className="w-5 h-5 text-brand-blue" /> Priority Support
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <X className="w-5 h-5" /> API Access
              </li>
            </ul>
          </div>
          <div className="p-6 pt-0">
            <Button variant="primary" className="w-full shadow-lg shadow-brand-blue/20">Start Free Trial</Button>
          </div>
        </Card>

        {/* Enterprise Tier */}
        <Card className="flex flex-col bg-white border-slate-100 shadow-lg">
          <div className="p-6 flex-grow">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">Custom</div>
            <p className="text-slate-500 mb-8">For platforms & large organizations.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> High-volume API Access
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> Custom Model Tuning
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> Dedicated SLA
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="w-5 h-5 text-brand-blue" /> SSO Integration
              </li>
            </ul>
          </div>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full">Contact Sales</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
