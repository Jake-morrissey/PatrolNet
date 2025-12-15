import React, { useState } from 'react';
import { Shield, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin();
      // If it's a signup, go to onboarding. If login, go to dashboard.
      if (isLogin) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      <button 
        onClick={() => navigate('/landing')}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="flex items-center gap-2 text-indigo-600 mb-8">
        <Shield className="h-8 w-8" />
        <span className="font-bold text-2xl text-slate-900">PatrolNet</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-slate-500 mb-6">
          {isLogin 
            ? 'Enter your details to access your security dashboard.' 
            : 'Start monitoring your business security in minutes.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input 
              type="email" 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full justify-center mt-6" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;