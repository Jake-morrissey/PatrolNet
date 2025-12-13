import React from 'react';
import { Severity, Status } from '../types';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {title && <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>}
    {children}
  </div>
);

export const Badge: React.FC<{ label: string; type?: Severity | Status | 'neutral' }> = ({ label, type = 'neutral' }) => {
  let colorClass = "bg-slate-100 text-slate-600"; // neutral

  switch (type) {
    case Severity.CRITICAL:
    case Status.AT_RISK:
      colorClass = "bg-red-50 text-red-700 border border-red-100";
      break;
    case Severity.HIGH:
      colorClass = "bg-orange-50 text-orange-700 border border-orange-100";
      break;
    case Severity.MEDIUM:
    case Status.WARNING:
      colorClass = "bg-amber-50 text-amber-700 border border-amber-100";
      break;
    case Severity.LOW:
    case Status.SECURE:
      colorClass = "bg-emerald-50 text-emerald-700 border border-emerald-100";
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
};
