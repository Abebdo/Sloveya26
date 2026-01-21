import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={cn(
      "fixed top-4 left-0 right-0 z-50 transition-all duration-300 mx-auto max-w-7xl px-4",
    )}>
      <div className={cn(
        "bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-brand-navy/5 transition-all duration-300",
        scrolled ? "bg-white/90 shadow-xl" : ""
      )}>
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-navy text-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-brand-navy tracking-tight">Solveya</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-brand-blue after:left-0 after:-bottom-1 hover:after:w-full after:transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-brand-navy hover:text-brand-blue">
            Log in
          </Link>
          <Button size="sm" className="pl-4 pr-1">
             Get Started <span className="ml-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3" /></span>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-brand-navy p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-brand-border p-6 flex flex-col gap-4 animate-slide-up md:hidden">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-lg font-semibold text-brand-navy py-2 border-b border-slate-100 last:border-0"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <Button variant="secondary" className="w-full">Log in</Button>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};
