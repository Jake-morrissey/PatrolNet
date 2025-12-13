import React, { useState } from 'react';
import { Shield, ArrowRight, Search, Globe, Lock } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    // Navigate to assets page with the new domain in state to trigger auto-scan
    navigate('/assets', { state: { newDomain: domain } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-12 text-sm font-medium">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">1</div>
            Account Created
          </div>
          <div className="w-12 h-px bg-slate-300"></div>
          <div className="flex items-center gap-2 text-indigo-600">
             <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md ring-4 ring-indigo-50">2</div>
             Add First Asset
          </div>
           <div className="w-12 h-px bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400">
             <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">3</div>
             View Score
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">Let's secure your business</h1>
        <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
          To generate your first security score, we need to know where to look. 
          Enter your primary company domain below.
        </p>

        <Card className="max-w-lg mx-auto bg-white p-8 shadow-lg border-indigo-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-left">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Domain</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. mycompany.com" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-300"
                  autoFocus
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <Lock className="h-3 w-3" /> 
                We only perform passive, non-intrusive scans.
              </p>
            </div>
            <Button type="submit" className="w-full text-lg h-12">
              <Search className="h-5 w-5 mr-2" />
              Start Security Scan
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;