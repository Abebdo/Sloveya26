import { Link } from 'react-router-dom';
import { ShieldCheck, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-navy text-white rounded-lg flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-brand-navy">Solveya</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Financial-grade security analysis for everyone. Detect scams, phishing, and malware in seconds.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-navy mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/features" className="hover:text-brand-blue">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-blue">Pricing</Link></li>
              <li><Link to="/api" className="hover:text-brand-blue">API Access</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-navy mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-brand-blue">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-brand-blue">Security Blog</Link></li>
              <li><Link to="/careers" className="hover:text-brand-blue">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-navy mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/privacy" className="hover:text-brand-blue">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-blue">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-brand-blue">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">© 2024 Solveya Security Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-brand-navy transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-brand-navy transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-brand-navy transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
