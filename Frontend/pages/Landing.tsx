import React from 'react';
import { Shield, CheckCircle, ArrowRight, Lock, Activity } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Shield className="h-6 w-6" />
            <span className="font-bold text-xl text-slate-900">PatrolNet</span>
          </div>
          {/* Top action button removed as requested */}
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-32 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Now supporting automated compliance checks
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Understand your company's <br className="hidden md:block"/>
          <span className="text-indigo-600">cybersecurity risk</span> in minutes.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Most small businesses don't know they are exposed until it's too late. 
          PatrolNet scans your digital assets and explains your risks in plain English.
          No jargon, just peace of mind.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => navigate('/login')} className="h-12 px-8 text-lg">Get your Score</Button>
          <Button variant="secondary" onClick={handleScrollToFeatures} className="h-12 px-8 text-lg">See How It Works</Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="bg-slate-50 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Scoring</h3>
              <p className="text-slate-600">
                We give you a simple A-F grade based on hundreds of security checks. 
                Know exactly where you stand at a glance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Actionable Fixes</h3>
              <p className="text-slate-600">
                Don't just see the problem. Get step-by-step instructions on how to fix it, 
                prioritized by impact.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Monitoring</h3>
              <p className="text-slate-600">
                Security isn't a one-time thing. We watch your perimeter constantly and 
                alert you if something changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Footer Teaser */}
      <section className="py-24 border-t border-slate-200 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Trusted by 500+ small businesses</h2>
        <div className="flex justify-center gap-4 text-slate-400 font-semibold text-lg uppercase tracking-wider">
           <span>Acme Corp</span> • <span>Starlight Tech</span> • <span>Dovetail Inc</span> • <span>MetricFlow</span>
        </div>
      </section>
    </div>
  );
};

export default Landing;