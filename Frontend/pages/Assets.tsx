import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Button } from '../components/UIComponents';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, X, Edit2, Loader2, Save } from 'lucide-react';
import { Status } from '../types';

const initialAssets = [
  { id: '1', name: 'acme-corp.com', score: 72, status: Status.WARNING, lastScan: '2023-10-25' },
  { id: '2', name: 'shop.acme-corp.com', score: 88, status: Status.SECURE, lastScan: '2023-10-24' },
  { id: '3', name: 'dev.acme-corp.com', score: 45, status: Status.AT_RISK, lastScan: '2023-10-20' },
];

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [assets, setAssets] = useState(initialAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  
  // Edit State
  const [editAsset, setEditAsset] = useState<{id: string, name: string} | null>(null);
  const hasOnboardedRef = useRef(false);

  // Reusable function to trigger scanning logic
  const startScanningAsset = (domainName: string) => {
    const newId = String(Date.now()); // Simple unique ID
    const newAsset = {
      id: newId,
      name: domainName,
      score: 0,
      status: Status.WARNING,
      lastScan: 'Initializing scan...',
    };
    
    setAssets(prev => [newAsset, ...prev]);

    // Simulate progressive scanning steps
    const steps = [
        { msg: 'Resolving DNS...', delay: 1000 },
        { msg: 'Scanning ports (25%)...', delay: 3000 },
        { msg: 'Checking headers (50%)...', delay: 5000 },
        { msg: 'Analyzing content (75%)...', delay: 7000 },
        { msg: 'Finalizing score...', delay: 8500 },
    ];

    steps.forEach(({ msg, delay }) => {
        setTimeout(() => {
            setAssets(prev => prev.map(a => a.id === newId ? { ...a, lastScan: msg } : a));
        }, delay);
    });

    // Complete scan
    setTimeout(() => {
        setAssets(prev => prev.map(a => a.id === newId ? { 
            ...a, 
            lastScan: new Date().toISOString().split('T')[0],
            score: Math.floor(Math.random() * 20) + 70, // Random score 70-90
            status: Status.SECURE
        } : a));
    }, 10000);
  };

  // Handle incoming domain from Onboarding
  useEffect(() => {
    const state = location.state as { newDomain?: string };
    if (state?.newDomain && !hasOnboardedRef.current) {
      hasOnboardedRef.current = true;
      startScanningAsset(state.newDomain);
      // Clear history state so refresh doesn't duplicate (though ref handles it too)
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    
    startScanningAsset(newDomain);
    setNewDomain('');
    setIsModalOpen(false);
  };

  const openEditModal = (e: React.MouseEvent, asset: typeof assets[0]) => {
    e.stopPropagation(); // Prevent navigation
    setEditAsset({ id: asset.id, name: asset.name });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAsset || !editAsset.name.trim()) return;
    
    setAssets(assets.map(a => a.id === editAsset.id ? { ...a, name: editAsset.name } : a));
    setEditAsset(null);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">My Assets</h1>
           <p className="text-slate-500">Manage the domains and IPs PatrolNet monitors.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Asset
        </Button>
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Add New Domain</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddAsset}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Domain Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. app.mycompany.com" 
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                  required
                />
                <p className="text-xs text-slate-500 mt-2">We will immediately run a passive scan on this domain.</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Start Monitoring</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {editAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Asset</h2>
              <button onClick={() => setEditAsset(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Domain Name</label>
                <input 
                  type="text" 
                  value={editAsset.name}
                  onChange={(e) => setEditAsset({...editAsset, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setEditAsset(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search domains..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-semibold text-slate-600 text-sm">Asset Name</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Score</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Last Scan</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => {
                const isScanning = asset.lastScan.includes('...');
                return (
                <tr 
                  key={asset.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/assets/${asset.id}`)}
                >
                  <td className="p-4 font-medium text-slate-900">{asset.name}</td>
                  <td className="p-4">
                    <Badge label={asset.status} type={asset.status} />
                  </td>
                  <td className="p-4">
                    {asset.score === 0 && isScanning ? (
                       <span className="text-slate-400 text-sm flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> --
                       </span>
                    ) : (
                      <span className={`font-bold ${asset.score < 50 ? 'text-red-600' : asset.score < 75 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {asset.score}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {isScanning ? (
                        <span className="text-indigo-600 font-medium flex items-center gap-2">
                           <Loader2 className="h-3 w-3 animate-spin" />
                           {asset.lastScan}
                        </span>
                    ) : (
                        asset.lastScan
                    )}
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => openEditModal(e, asset)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <span className="text-indigo-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Assets;