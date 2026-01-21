import { Card } from '../components/common/Card';
import { Shield, Eye, Lock, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Securing the Digital Frontier</h1>
        <p className="text-xl text-slate-500">Solveya is on a mission to eliminate online fraud through advanced AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <Card className="bg-white border-slate-100 shadow-lg">
          <div className="p-4">
            <Shield className="w-12 h-12 text-brand-blue mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To democratize advanced cybersecurity. We believe everyone deserves to know if the message they just received is safe, without needing a degree in computer science.
            </p>
          </div>
        </Card>
        <Card className="bg-white border-slate-100 shadow-lg">
          <div className="p-4">
            <Eye className="w-12 h-12 text-brand-purple mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">The Problem</h3>
            <p className="text-slate-600 leading-relaxed">
              Scams are evolving. Phishing, social engineering, and AI-generated fraud cost the global economy billions annually. Traditional filters are no longer enough.
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Powered by Next-Gen AI</h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-8 text-center max-w-2xl mx-auto">
          Solveya utilizes state-of-the-art Large Language Models (LLMs) running on the Edge. Unlike basic keyword filters, our engine understands *context*, *intent*, and *psychological triggers*.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <Lock className="w-8 h-8 text-brand-green mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">Privacy First</h4>
            <p className="text-sm text-slate-600">Analysis happens on secure, stateless edge functions. We don't store your personal messages.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <Globe className="w-8 h-8 text-brand-blue mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">Global Reach</h4>
            <p className="text-sm text-slate-600">Trained on fraud patterns from over 50 countries and 20 languages.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <Shield className="w-8 h-8 text-brand-purple mb-4" />
            <h4 className="font-bold text-slate-900 mb-2">Real-time Defense</h4>
            <p className="text-sm text-slate-600">Our models are updated daily with new scam signatures and threat vectors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
