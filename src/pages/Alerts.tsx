import React, { useState } from 'react';
import { Bell, Filter, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Alert } from '../services/mockData';
import AlertCard from '../components/AlertCard';

interface AlertsProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onAskAI?: (msg: string) => void;
}

export default function Alerts({ alerts, onResolveAlert, onAskAI }: AlertsProps) {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Information' | 'Resolved'>('All');

  const categories = ['All', 'Critical', 'Warning', 'Information', 'Resolved'];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'Resolved') return alert.resolved;
    if (filter === 'All') return !alert.resolved;
    return alert.severity === filter && !alert.resolved;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Alert Management</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Configure warning logs and IoT environment alerts</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === cat 
                  ? 'bg-white text-emerald-950 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Count Banner */}
      <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-emerald-700" />
          <span>Active alert rules running on background hardware loop.</span>
        </div>
        <span>{filteredAlerts.length} items listed</span>
      </div>

      {/* Alerts Log List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No active alerts matched</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              All sensors operating within expected parameters. Toggle filters to inspect resolved system alerts.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onResolve={onResolveAlert} 
              onAskAI={onAskAI}
            />
          ))
        )}
      </div>

    </div>
  );
}
