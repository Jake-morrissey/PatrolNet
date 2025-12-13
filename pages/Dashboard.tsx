import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Button, Badge } from '../components/UIComponents';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, RefreshCw, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Severity } from '../types';

const fullHistory = [
  { name: 'Nov', score: 58 },
  { name: 'Dec', score: 62 },
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 75 },
  { name: 'Apr', score: 72 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 85 },
  { name: 'Jul', score: 84 },
  { name: 'Aug', score: 88 },
  { name: 'Sep', score: 86 },
  { name: 'Oct', score: 89 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentScore = 89;
  const [timeRange, setTimeRange] = useState('6M');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanText, setLastScanText] = useState('Last scanned: 2 hours ago');
  
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanText('Last scanned: Just now');
    }, 2000);
  };

  // Score color logic
  const getScoreColorHex = (score: number) => {
    if (score >= 90) return '#10b981'; // emerald-500
    if (score >= 70) return '#6366f1'; // indigo-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-indigo-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getChartData = () => {
    switch (timeRange) {
      case '3M': return fullHistory.slice(-3);
      case '12M': return fullHistory;
      case '6M': 
      default: return fullHistory.slice(-6);
    }
  };

  const chartData = getChartData();
  const scoreData = [
    { name: 'Score', value: currentScore },
    { name: 'Remaining', value: 100 - currentScore }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Overview</h1>
          <p className="text-slate-500">Welcome back, Acme Corp. {lastScanText}</p>
        </div>
        <Button onClick={handleScan} variant="outline" disabled={isScanning}>
          {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isScanning ? 'Scanning...' : 'Run New Scan'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <Card className="col-span-1 lg:col-span-2">
           <div className="flex flex-col md:flex-row gap-8 items-center">
             <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                      paddingAngle={5}
                    >
                      <Cell fill={getScoreColorHex(currentScore)} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`text-5xl font-bold ${getScoreColorClass(currentScore)}`}>{currentScore}</span>
                  <span className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">Good</span>
                </div>
             </div>
             
             <div className="flex-1 space-y-4 text-center md:text-left">
               <div>
                 <h3 className="text-lg font-semibold text-slate-800">You are doing better than 70% of peers.</h3>
                 <p className="text-slate-500 text-sm mt-1">
                   Your security posture has improved by 13 points in the last 30 days. 
                   Great job fixing the open database ports.
                 </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-slate-50 rounded-lg">
                   <div className="text-slate-500 text-xs uppercase font-semibold">Checks Passed</div>
                   <div className="text-xl font-bold text-slate-800">42/50</div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-lg">
                   <div className="text-slate-500 text-xs uppercase font-semibold">Critical Issues</div>
                   <div className="text-xl font-bold text-emerald-600">0</div>
                 </div>
               </div>
             </div>
           </div>
        </Card>

        {/* Quick Actions / High Priority */}
        <Card title="Top Priority" className="col-span-1">
          <div className="space-y-4">
             <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
               <div className="flex gap-3">
                 <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                 <div>
                   <h4 className="font-semibold text-amber-900 text-sm">Expired SSL Certificate</h4>
                   <p className="text-amber-700 text-xs mt-1">domain-admin.acme.com</p>
                   <button 
                    onClick={() => navigate('/assets')}
                    className="mt-3 text-xs font-medium text-amber-800 hover:text-amber-950 underline"
                   >
                     View Details
                   </button>
                 </div>
               </div>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
               <div className="flex gap-3">
                 <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                 <div>
                   <h4 className="font-medium text-slate-700 text-sm">Email Security (DMARC)</h4>
                   <p className="text-slate-500 text-xs mt-1">Successfully configured on main domain.</p>
                 </div>
               </div>
             </div>
          </div>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-semibold text-slate-800">Security Trend</h3>
           <div className="relative">
             <select 
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value)}
               className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-indigo-500 focus:border-indigo-500 block cursor-pointer"
             >
               <option value="3M">Last 3 Months</option>
               <option value="6M">Last 6 Months</option>
               <option value="12M">Last Year</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown className="h-4 w-4" />
             </div>
           </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;