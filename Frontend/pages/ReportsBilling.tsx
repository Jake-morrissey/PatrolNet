import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UIComponents';
import { FileText, Download, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { Status, PlanType } from '../types';

export const Reports: React.FC = () => {
  const handleDownload = (type: string) => {
    const date = new Date().toISOString().split('T')[0];
    let content = '';
    let filename = '';
    let mimeType = '';

    if (type === 'PDF') {
      filename = `PatrolNet_Executive_Summary_${date}.txt`;
      mimeType = 'text/plain';
      content = `
PATROLNET EXECUTIVE SECURITY REPORT
Date: ${date}
-----------------------------------

Overall Security Score: B+ (89/100)

Summary:
The organization's security posture is strong. Critical vulnerabilities regarding open ports have been remediated. 
Focus area for next quarter: Employee phishing training.

Top Risks Resolved:
- Open Database Port 5432 (Fixed)
- Expired SSL Certificate on dev (Fixed)

Current Status:
- 42 Checks Passed
- 0 Critical Issues
      `;
    } else {
      filename = `PatrolNet_Technical_Scan_${date}.csv`;
      mimeType = 'text/csv';
      content = `ID,Title,Severity,Category,Status\n1,Missing HSTS,Medium,Encryption,Open\n2,Open Port 8080,High,Network,Open\n3,SPF Record SoftFail,Low,Email,Open`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Executive Summary">
          <p className="text-slate-500 mb-6 text-sm">
            A high-level overview suitable for board meetings or client presentations. 
            Includes score trends and major risk reduction achievements.
          </p>
          <Button variant="outline" className="w-full" onClick={() => handleDownload('PDF')}>
            <Download className="h-4 w-4" /> Download Report
          </Button>
        </Card>
        <Card title="Technical Detail Report">
          <p className="text-slate-500 mb-6 text-sm">
            Full list of all 42 checks passed and failed, including raw JSON output 
            for IT teams to ingest into ticketing systems.
          </p>
          <Button variant="outline" className="w-full" onClick={() => handleDownload('CSV')}>
            <Download className="h-4 w-4" /> Download CSV
          </Button>
        </Card>
      </div>
    </div>
  );
};

interface PricingPlansProps {
  currentPlan: PlanType;
  onUpdatePlan: (plan: PlanType) => void;
  onBack: () => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ currentPlan, onUpdatePlan, onBack }) => {
  const handleSelectPlan = (plan: PlanType) => {
    onUpdatePlan(plan);
    onBack();
  };

  const getButtonProps = (plan: PlanType) => {
    if (currentPlan === plan) {
      return { children: 'Current Plan', disabled: true, variant: 'primary' as const };
    }
    // Logic: If moving to a higher tier, say Upgrade. If lower, say Downgrade.
    // Order: Starter (10), Pro (49), Enterprise (199)
    const tiers = ['Starter', 'Pro', 'Enterprise'];
    const currentIndex = tiers.indexOf(currentPlan === 'Cancelled' ? '' : currentPlan);
    const targetIndex = tiers.indexOf(plan);
    
    if (currentPlan === 'Cancelled' || targetIndex > currentIndex) {
      return { children: 'Upgrade', onClick: () => handleSelectPlan(plan), variant: 'primary' as const };
    }
    return { children: 'Downgrade', onClick: () => handleSelectPlan(plan), variant: 'outline' as const };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {currentPlan !== 'Cancelled' && (
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Billing
        </button>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {currentPlan === 'Cancelled' ? 'Reactivate your subscription' : 'Upgrade your security'}
        </h1>
        <p className="text-slate-600 mt-2">Choose a plan that scales with your business.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Starter */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col ${currentPlan === 'Starter' ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
          <h3 className="font-bold text-xl text-slate-900">Starter</h3>
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold text-slate-900">$10</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> 1 Domain</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Weekly Scans</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Basic Score</li>
          </ul>
          <Button className="w-full" {...getButtonProps('Starter')} />
        </div>

        {/* Pro */}
        <div className={`bg-white rounded-xl shadow-md border p-6 flex flex-col relative ${currentPlan === 'Pro' ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
          {currentPlan === 'Pro' && (
             <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
               CURRENT
             </div>
          )}
          <h3 className={`font-bold text-xl ${currentPlan === 'Pro' ? 'text-indigo-600' : 'text-slate-900'}`}>Pro Business</h3>
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold text-slate-900">$49</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> 5 Domains</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Daily Monitoring</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> AI Explanations</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Email Alerts</li>
          </ul>
          <Button className="w-full" {...getButtonProps('Pro')} />
        </div>

        {/* Enterprise */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col ${currentPlan === 'Enterprise' ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
          <h3 className="font-bold text-xl text-slate-900">Enterprise</h3>
          <div className="mt-4 mb-6">
            <span className="text-4xl font-bold text-slate-900">$199</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Unlimited Domains</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Hourly Monitoring</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> API Access</li>
            <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="h-4 w-4 text-emerald-500" /> Dedicated Support</li>
          </ul>
          <Button className="w-full" {...getButtonProps('Enterprise')} />
        </div>
      </div>
    </div>
  );
};

interface BillingProps {
  currentPlan: PlanType;
  onUpdatePlan: (plan: PlanType) => void;
}

export const Billing: React.FC<BillingProps> = ({ currentPlan, onUpdatePlan }) => {
  const [showPlans, setShowPlans] = useState(false);

  // If the plan is cancelled, force the pricing view.
  if (currentPlan === 'Cancelled' || showPlans) {
    return <PricingPlans currentPlan={currentPlan} onUpdatePlan={onUpdatePlan} onBack={() => setShowPlans(false)} />;
  }

  const getPlanPrice = (plan: PlanType) => {
    switch (plan) {
      case 'Starter': return '$10';
      case 'Pro': return '$49';
      case 'Enterprise': return '$199';
      default: return '$0';
    }
  };

  const getPlanName = (plan: PlanType) => {
    switch (plan) {
      case 'Starter': return 'Starter Plan';
      case 'Pro': return 'Pro Business';
      case 'Enterprise': return 'Enterprise';
      default: return 'No Plan';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Subscription</h1>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-100 pb-8 mb-8">
          <div>
            <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Current Plan</div>
            <div className="text-3xl font-bold text-slate-900">{getPlanName(currentPlan)}</div>
            <p className="text-slate-500 mt-2">{getPlanPrice(currentPlan)}/month • Next billing date: Nov 25, 2023</p>
          </div>
          <div className="mt-4 md:mt-0">
             <Badge label="Active" type={Status.SECURE} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Plan Features</h3>
          <ul className="space-y-3">
            {[
              'Unlimited Domain Scans',
              'Daily Automated Monitoring',
              'AI-Powered Risk Explanation',
              'Priority Support'
            ].map(feat => (
              <li key={feat} className="flex items-center gap-3 text-slate-600">
                <Check className="h-5 w-5 text-emerald-500" />
                {feat}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
          <Button variant="outline" onClick={() => setShowPlans(true)}>Update Payment Method / Change Plan</Button>
          <Button 
            variant="ghost" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onUpdatePlan('Cancelled')}
          >
            Cancel Subscription
          </Button>
        </div>
      </Card>
    </div>
  );
};