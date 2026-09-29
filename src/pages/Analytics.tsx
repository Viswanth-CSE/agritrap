import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface AnalyticsProps {
  irEventsToday: number;
  history: any[];
}

export default function Analytics({ irEventsToday, history }: AnalyticsProps) {
  // Extract averages from real history
  const getAverage = (key: string) => {
    if (history.length === 0) return 'No Data';
    const sum = history.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return (sum / history.length).toFixed(1);
  };

  const avgTemp = getAverage('temp');
  const avgHum = getAverage('hum');

  const correlationData = [
    { name: 'Insect Detections Event Count', count: irEventsToday, correlation: 'Direct IR sensor reading counts.' },
    { name: 'Average Temp (Session)', count: avgTemp === 'No Data' ? 'N/A' : `${avgTemp}°C`, correlation: 'Average recorded temperature.' },
    { name: 'Average Humidity (Session)', count: avgHum === 'No Data' ? 'N/A' : `${avgHum}%`, correlation: 'Average recorded humidity.' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Advanced Analytics</h2>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Statistical correlation indices and historical trends</p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover-premium">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Detection Events</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{irEventsToday !== null ? irEventsToday : 'No Data'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover-premium">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Temp (Session)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{avgTemp !== 'No Data' ? `${avgTemp}°C` : 'No Data'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover-premium">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Humidity (Session)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{avgHum !== 'No Data' ? `${avgHum}%` : 'No Data'}</p>
        </div>
      </div>

      {/* Weekly trend chart - replaced with session trend */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Session Activity Trend</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LDR values frequency over logged updates</p>
          </div>
        </div>
        <div className="h-64">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">Waiting for live data history...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="ldr" name="LDR Light Value" fill="#047857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Environment correlation study */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Environment Trends */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Environmental Factors Overlay</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">DHT22 Session Trends (Temperature & Humidity)</p>
            </div>
          </div>
          <div className="h-64">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">Waiting for live data history...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#e11d48" strokeWidth={2} />
                  <Line type="monotone" dataKey="hum" name="Humidity (%)" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Correlation factors card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Correlation Studies</h3>
            
            <div className="space-y-4">
              {correlationData.map((corr, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-slate-800">{corr.name}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{corr.count}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-semibold leading-relaxed">
                    {corr.correlation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-[10px] text-slate-500 mt-6">
            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              <strong>Disclaimer:</strong> Environmental correlation models indicate possible trends. Scientific causation is not established from these sensor logs alone.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
