import React from 'react';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { SensorData } from '../services/mockData';

interface AIInsightProps {
  currentSensor: SensorData;
  irEventsToday: number;
  onAskAI: (msg: string) => void;
}

export default function AIInsight({ currentSensor, irEventsToday, onAskAI }: AIInsightProps) {
  // Simple classification based on today's events
  let activityLevel = 'LOW';
  let recommendation = 'Environmental conditions are normal. Maintain standard monitoring schedules.';
  let alertColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (irEventsToday > 50) {
    activityLevel = 'CRITICAL';
    recommendation = 'Check the trap immediately. High frequency of insect events detected. Ensure UV light is clean and functional.';
    alertColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (irEventsToday > 25) {
    activityLevel = 'HIGH';
    recommendation = 'Inspect crops near the trap and continue monitoring over the next few hours. Conditions are favorable for activity.';
    alertColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (irEventsToday > 10) {
    activityLevel = 'MEDIUM';
    recommendation = 'Moderate activity detected. Normal agricultural behavior under current temperature and humidity fields.';
    alertColor = 'text-blue-700 bg-blue-50 border-blue-200';
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover-premium">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-150">
          <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🤖 AI Insight</h4>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AgriTrap Real-time Advisory</p>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border ${alertColor} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Classification Status</span>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/70 border border-current shadow-sm">
            {activityLevel}
          </span>
        </div>
        <p className="text-sm font-semibold leading-relaxed">
          AgriTrap recorded increased detection activity today ({irEventsToday} events). 
        </p>
      </div>

      <div className="text-xs text-slate-600 mb-6 space-y-2">
        <p className="font-semibold text-slate-800">Recommendation:</p>
        <p className="leading-relaxed">{recommendation}</p>
      </div>

      <button
        onClick={() => onAskAI(`Analyze the high insect activity detected today. Current level is classified as ${activityLevel} with ${irEventsToday} events.`)}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md shadow-emerald-950/10"
      >
        <span>Ask AgriTrap AI</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
