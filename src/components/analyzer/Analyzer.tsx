import { useState } from 'react';
import { Tabs } from '../common/Tabs';
import { MessageCircle, Link as LinkIcon, FileText, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from '../common/FileUpload';
import { useAnalyze } from '../../hooks/useAnalyze';
import { ResultDashboard } from './ResultDashboard';

export const Analyzer = () => {
  const [activeTab, setActiveTab] = useState('message');
  
  // State for different inputs
  const [messageText, setMessageText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [companyInput, setCompanyInput] = useState({ name: '', website: '', email: '' });
  const [fileInput, setFileInput] = useState<File | null>(null);

  const { analyzeMessage, analyzeUrl, analyzeFile, analyzeCompany, isLoading, result, error, reset } = useAnalyze(); 

  const handleAnalyze = () => {
    if (activeTab === 'message') {
        if (!messageText.trim()) return;
        analyzeMessage(messageText);
    } else if (activeTab === 'url') {
        if (!urlInput.trim()) return;
        analyzeUrl(urlInput);
    } else if (activeTab === 'file') {
        if (!fileInput) return;
        analyzeFile(fileInput);
    } else if (activeTab === 'company') {
        if (!companyInput.name.trim()) return;
        analyzeCompany({ 
            companyName: companyInput.name, 
            website: companyInput.website, 
            email: companyInput.email 
        });
    }
  };

  const handleTabChange = (id: string) => {
      setActiveTab(id);
      reset(); 
  };

  const tabs = [
    { id: 'message', label: 'Message', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'url', label: 'URL', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'file', label: 'File', icon: <FileText className="w-4 h-4" /> },
    { id: 'company', label: 'Entity', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full relative z-20">
      
      {/* THE WIDGET CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel rounded-[32px] p-2 md:p-3 relative overflow-hidden group"
      >
        {/* Subtle moving sheen */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-white/60 p-6 md:p-8 shadow-inner">
            
            {/* TABS - Compact & Floating */}
            <div className="flex justify-center mb-8">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} className="bg-brand-light/80 border-brand-border/50" />
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                >
                    {/* MESSAGE INPUT */}
                    {activeTab === 'message' && (
                        <div className="relative group">
                            <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Paste suspicious text here..."
                            className="w-full h-40 bg-white rounded-2xl border border-brand-border p-5 text-base text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all resize-none shadow-sm group-hover:border-brand-blue/30"
                            />
                            <div className="text-right mt-2 text-xs text-slate-400 font-medium">
                                {messageText.length} characters
                            </div>
                        </div>
                    )}

                    {/* URL INPUT */}
                    {activeTab === 'url' && (
                        <div className="py-4 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://suspicious-link.com"
                                    className="w-full h-14 pl-12 pr-4 bg-white rounded-xl border border-brand-border text-brand-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all shadow-sm"
                                />
                            </div>
                            <p className="text-xs text-center text-slate-500">We analyze redirects, domain age, and reputation.</p>
                        </div>
                    )}

                    {/* FILE INPUT */}
                    {activeTab === 'file' && (
                        <div className="py-2">
                             <FileUpload onFileSelect={setFileInput} />
                             {fileInput && (
                                <div className="mt-4 p-3 bg-brand-light border border-brand-blue/20 rounded-xl flex items-center gap-3 animate-fade-in">
                                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">{fileInput.name}</div>
                                        <div className="text-xs text-slate-500">{(fileInput.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                </div>
                             )}
                        </div>
                    )}

                    {/* COMPANY INPUT */}
                    {activeTab === 'company' && (
                         <div className="space-y-4">
                            <input
                                type="text"
                                value={companyInput.name}
                                onChange={(e) => setCompanyInput({...companyInput, name: e.target.value})}
                                placeholder="Company Name (e.g. Acme Corp)"
                                className="w-full h-12 px-4 bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                            />
                            <input
                                type="text"
                                value={companyInput.website}
                                onChange={(e) => setCompanyInput({...companyInput, website: e.target.value})}
                                placeholder="Website (e.g. acme.com)"
                                className="w-full h-12 px-4 bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <Button 
                        size="lg" 
                        onClick={handleAnalyze} 
                        isLoading={isLoading}
                        className="w-full h-14 text-base shadow-lg shadow-brand-navy/10 hover:shadow-brand-navy/20"
                    >
                        {activeTab === 'message' ? 'Analyze Message' : 'Start Scan'}
                        <ArrowRight className="w-4 h-4 ml-2 opacity-60" />
                    </Button>

                </motion.div>
                ) : (
                    <div className="animate-fade-in">
                        <ResultDashboard 
                            result={result} 
                            originalText={activeTab === 'message' ? messageText : undefined} 
                        />
                        <button 
                            onClick={reset}
                            className="mt-6 w-full py-3 text-sm font-semibold text-slate-500 hover:text-brand-navy transition-colors border-t border-brand-border"
                        >
                            Start New Analysis
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
