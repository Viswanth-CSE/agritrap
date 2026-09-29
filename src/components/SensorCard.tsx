import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusText?: string;
  statusType?: 'success' | 'warning' | 'error' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

export default function SensorCard({ 
  title, 
  value, 
  unit = '', 
  statusText, 
  statusType = 'neutral', 
  icon: Icon,
  description 
}: SensorCardProps) {
  
  const statusColors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const badgeDot = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    neutral: 'bg-slate-400'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-250 p-6 shadow-sm hover-premium flex flex-col justify-between h-44">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-baseline">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="ml-1 text-lg font-semibold text-slate-500">{unit}</span>}
        </div>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
        <span className="text-xs text-slate-500">Sensor Health</span>
        {statusText && (
          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[statusType]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badgeDot[statusType]} pulse-green`}></span>
            <span>{statusText}</span>
          </span>
        )}
      </div>
    </div>
  );
}
