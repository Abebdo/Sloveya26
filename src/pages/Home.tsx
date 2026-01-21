import { Analyzer } from '../components/analyzer/Analyzer';
import { ShieldCheck, Zap, Globe, Lock, Search, Building2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="relative">
      
      {/* SECTION 1: CENTERED HERO */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
            
            {/* HERO TEXT */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-xs font-bold tracking-wide uppercase">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                    </span>
                    AI Security Model v2.0 Live
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-brand-navy tracking-tight leading-[1.1]">
                    Verify any message. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Instantly detect fraud.</span>
                </h1>

                {/* Subtext */}
                <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                    The financial-grade AI that analyzes suspicious texts, URLs, and files to protect you from scams and social engineering.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/30 transition-all transform hover:-translate-y-1">
                        Get Protected Free
                    </Button>
                    <Button variant="outline" size="lg" className="h-14 px-8 text-base bg-white border-slate-200 text-slate-600 hover:text-brand-navy hover:border-brand-border/80 shadow-sm">
                        View API Documentation
                    </Button>
                </div>
            </motion.div>

            {/* ANALYZER WIDGET - The Star Element */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-20 relative max-w-5xl mx-auto"
            >
                {/* Glow Effect Behind Widget */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-brand-aurora-cyan/40 via-brand-aurora-purple/40 to-brand-aurora-pink/40 blur-[90px] rounded-full -z-10" />
                
                {/* The Widget Itself */}
                <Analyzer />

                {/* Trusted By Logos (Floating below widget) */}
                <div className="pt-16 pb-8">
                    <p className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Trusted by security teams at</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Stripe', 'Revolut', 'Monzo', 'Intercom', 'Coinbase'].map(name => (
                            <span key={name} className="text-xl font-bold text-slate-400 hover:text-brand-navy transition-colors">{name}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* SECTION 2: FEATURES GRID */}
      <section className="py-32 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-navy mb-6">Enterprise-grade forensics</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    We don't just match keywords. Our multi-layer AI analyzes semantic intent, psychological triggers, and technical metadata in real-time.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Deep Text Analysis", icon: Zap, desc: "Detects urgency, authority bias, and social engineering patterns using NLP." },
                    { title: "URL Dissection", icon: Globe, desc: "Unravels redirects, checks domain age, and verifies SSL certificates instantly." },
                    { title: "Privacy First", icon: Lock, desc: "Zero-knowledge architecture. Your messages are analyzed anonymously and never retrained on." },
                    { title: "File Forensics", icon: ShieldCheck, desc: "Scans PDF, EXE, and APK metadata to detect malicious payloads and anomalies." },
                    { title: "Company Vetting", icon: Building2, desc: "Cross-references business claims with official government registration databases." },
                    { title: "Real-time API", icon: Search, desc: "Integrate Solveya's detection engine directly into your own platforms via REST API." }
                ].map((f, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="glass-card p-8 rounded-[32px] group"
                    >
                        <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-border/50 shadow-sm">
                            <f.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy mb-3">{f.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-blue to-purple-600 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-brand-blue/30">
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to secure your communications?</h2>
                  <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                      Join 10,000+ users and companies who trust Solveya to detect fraud before it strikes.
                  </p>
                  <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90 h-14 px-10 text-lg border-0 shadow-lg">
                      Get Started Now
                  </Button>
              </div>
          </div>
      </section>

    </div>
  );
};
