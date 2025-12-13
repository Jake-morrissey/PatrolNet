import React, { useState } from 'react';
import { Card, Badge, Button } from '../components/UIComponents';
import { Domain, Finding, Status, Severity } from '../types';
import { ChevronDown, ChevronRight, Bot, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { explainFindingInPlainEnglish } from '../services/geminiService';

const mockDomain: Domain = {
  id: '1',
  name: 'acme-corp.com',
  score: 72,
  lastScan: new Date().toISOString(),
  status: Status.WARNING,
  findings: [
    {
      id: 'f1',
      title: 'Missing HSTS Header',
      description: 'The HTTP Strict Transport Security header is missing from the server response.',
      severity: Severity.MEDIUM,
      category: 'Encryption',
      remediation: 'Add "Strict-Transport-Security" header to your Nginx/Apache config.'
    },
    {
      id: 'f2',
      title: 'Open Port 8080',
      description: 'An administrative interface appears to be exposed on port 8080.',
      severity: Severity.HIGH,
      category: 'Network Exposure',
      remediation: 'Close port 8080 on the firewall or restrict access to VPN IPs only.'
    },
    {
      id: 'f3',
      title: 'SPF Record Soft Fail',
      description: 'SPF record ends with ~all instead of -all.',
      severity: Severity.LOW,
      category: 'Email Security',
      remediation: 'Change SPF record to end with "-all" to prevent spoofing.'
    }
  ]
};

const DomainDetail: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const toggleFinding = (id: string) => {
    if (expandedFinding === id) {
      setExpandedFinding(null);
      setAiExplanation('');
    } else {
      setExpandedFinding(id);
      setAiExplanation(''); // Clear previous
    }
  };

  const handleAskAi = async (finding: Finding) => {
    setLoadingAi(true);
    const explanation = await explainFindingInPlainEnglish(finding);
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/assets')}
        className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Assets
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{mockDomain.name}</h1>
            <Badge label={mockDomain.status} type={mockDomain.status} />
          </div>
          <p className="text-slate-500 mt-1">Last scanned: {new Date(mockDomain.lastScan).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 uppercase font-semibold">Security Score</div>
          <div className="text-4xl font-bold text-indigo-600">{mockDomain.score}/100</div>
        </div>
      </div>

      {/* Findings List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Security Findings</h2>
          <span className="text-sm text-slate-500">{mockDomain.findings.length} issues found</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {mockDomain.findings.map((finding) => (
            <div key={finding.id} className="transition-colors hover:bg-slate-50">
              <div 
                className="p-6 cursor-pointer flex items-center gap-4"
                onClick={() => toggleFinding(finding.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-slate-900">{finding.title}</h3>
                    <Badge label={finding.severity} type={finding.severity} />
                  </div>
                  <p className="text-slate-500 text-sm truncate">{finding.description}</p>
                </div>
                {expandedFinding === finding.id ? <ChevronDown className="text-slate-400" /> : <ChevronRight className="text-slate-400" />}
              </div>

              {/* Expanded Detail View */}
              {expandedFinding === finding.id && (
                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-4">
                    
                    {/* Plain Language Explanation (AI) */}
                    <div className="bg-white p-4 rounded border border-indigo-100 shadow-sm">
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                           <Bot className="h-5 w-5" />
                           <span>Plain English Explanation</span>
                         </div>
                         {!aiExplanation && (
                           <Button 
                            variant="secondary"
                            className="text-xs py-1 h-8"
                            onClick={(e) => { e.stopPropagation(); handleAskAi(finding); }}
                            disabled={loadingAi}
                           >
                             {loadingAi ? 'Analyzing...' : 'Ask PatrolNet AI'}
                           </Button>
                         )}
                       </div>
                       
                       {loadingAi && (
                         <div className="space-y-2 animate-pulse">
                           <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                           <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                         </div>
                       )}

                       {aiExplanation && (
                         <div className="prose prose-sm text-slate-600">
                           <p className="whitespace-pre-line leading-relaxed">{aiExplanation}</p>
                         </div>
                       )}

                       {!aiExplanation && !loadingAi && (
                         <p className="text-slate-500 text-sm italic">
                           Tap the button above to have our AI translate this technical issue into business terms.
                         </p>
                       )}
                    </div>

                    {/* Standard Remediation */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                         How to fix it
                      </h4>
                      <div className="bg-slate-100 p-3 rounded text-sm font-mono text-slate-700 border border-slate-200">
                        {finding.remediation}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainDetail;