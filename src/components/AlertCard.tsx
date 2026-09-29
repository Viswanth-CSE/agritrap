import React from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Alert } from '../services/mockData';

interface AlertCardProps {
  alert: Alert;
  onResolve: (id: string) => void;
  onAskAI?: (msg: string) => void;
}

export default function AlertCard({ alert, onResolve, onAskAI }: AlertCardProps) {
  const isResolved = alert.resolved;

  const severityStyles = {
    Critical: {
      bg: 'bg-rose-50 border-rose-200',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      titleColor: 'text-rose-950',
      btn: 'hover:bg-rose-100 text-rose-700 bg-rose-50/50'
    },
    Warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-950',
      btn: 'hover:bg-amber-100 text-amber-700 bg-amber-50/50'
    },
    Information: {
      bg: 'bg-blue-50 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-950',
      btn: 'hover:bg-blue-100 text-blue-700 bg-blue-50/50'
    }
  };

  const currentStyles = severityStyles[alert.severity];
  const Icon = currentStyles.icon;

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${isResolved ? 'bg-slate-50/60 border-slate-200 opacity-70' : currentStyles.bg} flex items-start justify-between shadow-sm`}>
      <div className="flex space-x-4">
        <div className={`p-2.5 rounded-xl bg-white shadow-sm ${currentStyles.iconColor} mt-0.5`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className={`font-bold text-sm tracking-wide ${isResolved ? 'text-slate-500 line-through' : currentStyles.titleColor}`}>
              {alert.title}
            </h4>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {alert.category}
            </span>
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${isResolved ? 'text-slate-450' : 'text-slate-700'}`}>
            {alert.message}
          </p>
          <span className="text-[10px] font-semibold text-slate-400 block mt-2">
            Logged: {alert.timestamp}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {!isResolved && onAskAI && (
          <button
            onClick={() => onAskAI(`Explain this alert detail: ${alert.title} - ${alert.message}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-850 hover:bg-emerald-50 border border-emerald-250 transition-colors"
          >
            Ask AI
          </button>
        )}
        {!isResolved ? (
          <button
            onClick={() => onResolve(alert.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${currentStyles.btn}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Resolve</span>
          </button>
        ) : (
          <span className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold py-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Resolved</span>
          </span>
        )}
      </div>
    </div>
  );
}
