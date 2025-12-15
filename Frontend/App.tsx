import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DomainDetail from './pages/DomainDetail';
import Assets from './pages/Assets';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import { Reports, Billing } from './pages/ReportsBilling';
import { PlanType } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('Pro');

  const handleLogin = () => {
    setIsAuthenticated(true);
    if (currentPlan === 'Cancelled') setCurrentPlan('Pro');
  };
  
  const handleLogout = () => setIsAuthenticated(false);
  const handleUpdatePlan = (plan: PlanType) => setCurrentPlan(plan);

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/landing" 
          element={!isAuthenticated ? <Landing /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Auth onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />

        <Route 
          path="/onboarding" 
          element={
            isAuthenticated ? (
              <Onboarding />
            ) : (
              <Navigate to="/landing" replace />
            )
          } 
        />
        
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              currentPlan === 'Cancelled' ? <Navigate to="/billing" replace /> :
              <Layout onLogout={handleLogout}>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/landing" replace />
            )
          } 
        />

        <Route 
          path="/assets" 
          element={
            isAuthenticated ? (
              currentPlan === 'Cancelled' ? <Navigate to="/billing" replace /> :
              <Layout onLogout={handleLogout}>
                <Assets />
              </Layout>
            ) : (
              <Navigate to="/landing" replace />
            )
          } 
        />

        <Route 
          path="/assets/:id" 
          element={
            isAuthenticated ? (
              currentPlan === 'Cancelled' ? <Navigate to="/billing" replace /> :
              <Layout onLogout={handleLogout}>
                <DomainDetail />
              </Layout>
            ) : (
              <Navigate to="/landing" replace />
            )
          } 
        />

        <Route 
          path="/reports" 
          element={
            isAuthenticated ? (
              currentPlan === 'Cancelled' ? <Navigate to="/billing" replace /> :
              <Layout onLogout={handleLogout}>
                <Reports />
              </Layout>
            ) : (
              <Navigate to="/landing" replace />
            )
          } 
        />

        <Route 
          path="/billing" 
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Billing currentPlan={currentPlan} onUpdatePlan={handleUpdatePlan} />
              </Layout>
            ) : (
              <Navigate to="/landing" replace />
            )
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/landing"} replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;