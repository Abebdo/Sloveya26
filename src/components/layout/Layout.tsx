import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet, ScrollRestoration } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-navy selection:bg-brand-blue/20 selection:text-brand-blue overflow-hidden relative">
      
      {/* Background Ambience (Light Mode Aurora) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Top Left Cyan */}
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-brand-aurora-cyan/30 blur-[120px] animate-pulse-slow" />
          
          {/* Bottom Right Purple */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-brand-aurora-purple/30 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          
          {/* Center Pink Highlight */}
          <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-aurora-pink/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar />
      
      <main className="flex-grow pt-20 z-10 relative">
        <Outlet />
      </main>
      
      <Footer />
      <ScrollRestoration />
    </div>
  );
};
