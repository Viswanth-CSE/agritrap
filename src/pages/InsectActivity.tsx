import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Bug, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
import { DetectionEvent } from '../services/mockData';

interface InsectActivityProps {
  detections: DetectionEvent[];
  irEventsToday: number;
}

export default function InsectActivity({ detections, irEventsToday }: InsectActivityProps) {
  const getHourlyGroups = () => {
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const groups = hours.map(h => ({ hour: h, count: 0 }));
    
    detections.forEach(d => {
      try {
        const hourNum = parseInt(d.timestamp.split(':')[0]);
        const closest = hours.reduce((prev, curr) => {
          const prevDiff = Math.abs(parseInt(prev.split(':')[0]) - hourNum);
          const currDiff = Math.abs(parseInt(curr.split(':')[0]) - hourNum);
          return currDiff < prevDiff ? curr : prev;
        });
        const match = groups.find(g => g.hour === closest);
        if (match) match.count++;
      } catch (e) {}
    });
    return groups;
  };

  const hourlyData = getHourlyGroups();

  let activityLevel = 'LOW';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  
  if (irEventsToday > 50) {
    activityLevel = 'CRITICAL';
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (irEventsToday > 25) {
    activityLevel = 'HIGH';
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (irEventsToday > 10) {
    activityLevel = 'MEDIUM';
    badgeColor = 'text-blue-700 bg-blue-50 border-blue-200';
  }

  // Find peak hour
  const peakGroup = [...hourlyData].sort((a, b) => b.count - a.count)[0];
  const peakTimeStr = peakGroup && peakGroup.count > 0 ? `${peakGroup.hour}` : 'No Peaks Yet';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Insect Activity Log</h2>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Statistical classifications of estimated insect presence events</p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover-premium">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Insect Activity</span>
            <Bug className="h-5 w-5 text-slate-400" />
          </div>
          <div className="my-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${badgeColor}`}>
              {activityLevel}
            </span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{irEventsToday} events</p>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block border-t border-slate-100 pt-3">
            Session active detections count
          </span>
        </div>

        {/* Info card 2 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover-premium">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peak Activity Period</span>
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
          <div className="my-4">
            <p className="text-2xl font-extrabold text-slate-900">{peakTimeStr}</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Corresponds to highest registered frequency hour.</p>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block border-t border-slate-100 pt-3">
            Determined by IR presence counts
          </span>
        </div>

        {/* Info card 3 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover-premium">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detection Count</span>
            <ArrowUpRight className="h-5 w-5 text-slate-400" />
          </div>
          <div className="my-4">
            <p className="text-3xl font-extrabold text-slate-900">{detections.length}</p>
            <p className="text-xs text-slate-500 mt-1 font-semibold">Total verified events logged in the table</p>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block border-t border-slate-100 pt-3">
            Continuous background telemetry
          </span>
        </div>

      </div>

      {/* Hourly distribution chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Hourly Insect Detections</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0'
                }} 
              />
              <Bar dataKey="count" name="Detections" fill="#047857" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table log */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Detection Event History</h3>
        
        {detections.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-slate-500">🪤 No detection events yet</p>
            <p className="text-xs text-slate-450">AgriTrap has not recorded any presence counts during this session.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">IR Event</th>
                  <th className="py-3 px-4">LDR Value</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Humidity</th>
                  <th className="py-3 px-4">Activity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {detections.map((det) => (
                  <tr key={det.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono">{det.timestamp}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">DETECTED</td>
                    <td className="py-3 px-4">{det.ldrValue} ADC</td>
                    <td className="py-3 px-4">{det.temperature}°C</td>
                    <td className="py-3 px-4">{det.humidity}%</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] bg-slate-100 border border-slate-200 font-bold">
                        {det.activityLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
